import { Component, ElementRef, Input } from '@angular/core';
import { SpiderFilterService } from '../../filters/spider-filter/spider-filter.service'
import * as d3 from 'd3';

export interface spiderPathInterface {
  closeness?: number;
  importance?: number;
  index?: number;
  name?: string;
  size?: number;
  toAlpha?: number;
  toX?: number;
  toY?: number;
  volume?: number;
  vx?: number;
  vy?: number;
  x?: number;
  y?: number;
  parent?: any;
  label?: string;
}

@Component({
  selector: 'app-spider',
  templateUrl: 'spider.component.html',
  styleUrls: ['spider.component.scss']
})
export class SpiderComponent {

  constructor(
    private elem: ElementRef,
    private spiderFilterService: SpiderFilterService
  ) {

    /**
     * make a subscribe for filters
     */
    spiderFilterService.spiderFilters$.subscribe(
      value => {

        this.simulation.stop();

        let data:any =  JSON.parse(JSON.stringify(this.d3json)) ;
        let filterData:any = [data];

        /**
         * filter data with memoization
         */
        let index = 0;
        for (let item in value){
          let tempArray = [];
          for (let row of filterData[index]){
            if (
              row[item] > value[item][0] &&
              row[item] < value[item][1] ||
              row['parent'] === true
            ){
              tempArray.push(row);
            }
          }
          filterData.push(tempArray);
          index++;
        }

        //delete nodes and simulation
        this.svgContainer['svg'].selectAll("*").remove();
        this.simulation = null;

        this.spiderCall(filterData.pop());

      }
    )
  }

  private d3json:Array<any> = [];

  public svgContainer: any = {};
  public simulation: any;

  /**
   *
   * @param data: nodes of circle
   */
  public tick(data) {
    data.svgContainer['gCircles'].nodes().forEach((circle:any) => {

      data.svgContainer['circleNode'] = d3.select(circle);

      data.svgContainer['circleNode']
        .attr("transform", (d:spiderPathInterface) => {
          let coordinateFromCenter = data.collide(-Math.atan2(d.y-data.svgContainer['height']/2, d.x-data.svgContainer['width']/2), d.closeness, 20);
          if (!d.parent){
            d.toX = coordinateFromCenter.x*data.zoom;
            d.toY = coordinateFromCenter.y*data.zoom;
            d.toAlpha =  -Math.atan2(d.y-data.svgContainer['height']/2, d.x-data.svgContainer['width']/2);
            return "translate(" + [data.svgContainer['width']/2 + coordinateFromCenter.x*data.zoom,data.svgContainer['height']/2 + coordinateFromCenter.y*data.zoom] + ")";
          } else {
            d.toX = 0;
            d.toY = 0;
            d.toAlpha =  0;
            return "translate(" + [data.svgContainer['width']/2, data.svgContainer['height']/2] + ")";
          }
        });

      data.svgContainer['circleNode']
        .selectAll('path')
        .attr("d", (d:spiderPathInterface) => {
          let
            dx = -d.toX,
            dy = -d.toY,
            dr = Math.sqrt(d.toX*d.toX+d.toY*d.toY),
            dqx = dx + dr/2*Math.sqrt(5)*Math.cos(d.toAlpha+Math.PI/3),
            dqy = dy + dr/2*Math.sqrt(5)*Math.sin(d.toAlpha+Math.PI/3);

          return "M " + (-d.volume/data.zoom*Math.cos(d.toAlpha-Math.PI/3)) + "," + (-d.volume/data.zoom*Math.sin(d.toAlpha-Math.PI/3)) + " Q " + dqx/2 + "," + dqy/2 + " " + dx + "," + dy;
        });
    });
  }

  /**
   * collide element around center with minimal distance of minFromCenter
   * minFromCenter less than 100 and more than 0
   * @param alpha
   * @param r
   * @param minFromCenter
   * @returns {{x: number, y: number}}
   */
  private collide(alpha, r, minFromCenter) {
    if (minFromCenter>100) console.error('minFromCenter less than 100');
    if (minFromCenter<0) console.error('minFromCenter more than 0');

    //100 - condition from task, can't be more 100
    r = minFromCenter + r * (100-minFromCenter)/100;
    return {
      x: r*Math.cos(alpha),
      y: r*Math.sin(alpha),
    }
  }

  public zoom:number = 4;

  public spiderCall(data){

    this.svgContainer = {};
    this.svgContainer['svg']    = d3.select(this.elem.nativeElement.children[0]);
    this.svgContainer['width']  = +this.svgContainer['svg'].attr("width");
    this.svgContainer['height'] = +this.svgContainer['svg'].attr("height");

    let color = d3.rgb(64, 59, 98).toString();

    /**
     * make g path container before circles
     * @type {Selection<ChildElement, NewDatum, PElement, PDatum>}
     */
    this.svgContainer['gCircles'] = this.svgContainer['svg']
      .selectAll("circle")
      .data(data)
      .enter()
      .append("g");

    /**
     * make circle in g path container
     * @type {Selection<ChildElement, NewDatum, PElement, PDatum>}
     */
    this.svgContainer['circles'] = this.svgContainer['gCircles']
      .append("circle")
      .attr("r", (d:spiderPathInterface)=>{ return d.volume/this.zoom; })
      .text((d:spiderPathInterface)=>{return d.label})
      .style("fill", (d:spiderPathInterface)=>{ return  d3.rgb(color).toString(); })
      .style("fill-opacity", (d:spiderPathInterface)=>{ return  d.importance/100; });

    /**
     * make text
     * @type {Selection<ChildElement, NewDatum, PElement, PDatum>}
     */

    this.svgContainer['textCircles'] = this.svgContainer['gCircles']
      .append("text")
      .text((d:spiderPathInterface)=>{return d.name;})
      .attr("fill", (d:spiderPathInterface)=>{ return (d.parent)?"#ffffff":color; })
      .attr("y", (d:spiderPathInterface)=>{ return -10 - d.volume/this.zoom; })
      .attr("alignment-baseline","middle")
      .attr("text-anchor", "middle");

    this.svgContainer['pathCircles'] = this.svgContainer['gCircles']
      .append("path");


    /**
     * create label for first node to text
     * @type {any|ChildElement}
     */
    this.svgContainer['text'] = this.svgContainer['textCircles'].node();
    let bbox = ((text:any)=>{return text.getBBox()})(this.svgContainer['text']);
    let padding = 4;
    this.svgContainer['rect'] = d3.select(this.svgContainer['gCircles'].node())
      .insert("rect", "text")
      .attr("x", bbox.x - 3*padding)
      .attr("rx", 2*padding)
      .attr("y", bbox.y - 0.5*padding)
      .attr("ry", 4*padding)
      .attr("width", bbox.width + 6*padding)
      .attr("height", bbox.height + padding)
      .style("fill", color);

    if (!this.simulation){
      this.simulation = d3
        .forceSimulation(data)
        .velocityDecay(1)
        .force("center", d3.forceCenter(this.svgContainer['width'] / 2, this.svgContainer['height'] / 2))
        .force("collide", d3.forceCollide().radius((d:spiderPathInterface) => { return d.volume/this.zoom + 10; }).iterations(20))
        .on("tick", this.tick.bind(null, this));
    }
  }

  ngAfterContentInit(){

    //TODO: убрать из JSON size
    /**
     * get data from json.
     *
     */
    d3.json("assets/json/data.json", (data:any) => {

      data.sort((x, y) => {
        return d3.ascending(x.closeness, y.closeness);
      });

      this.d3json = JSON.parse(JSON.stringify(data));
      this.spiderCall(data);

    });


  }

}
