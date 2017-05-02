import { Component, OnInit , EventEmitter, Output} from '@angular/core';
import { SpiderFilterService } from "./spider-filter.service";

@Component({
  selector: 'app-spider-filter',
  templateUrl: 'spider-filter.component.html',
  styleUrls: ['spider-filter.component.scss']
})
export class SpiderFilterComponent implements OnInit {

  constructor(
    private spiderFilterService: SpiderFilterService
  ) {}

  public filters: any = {};

  public filterUpdate = function(val:any, type: string){
    this.filters[type] = val;
    this.spiderFilterService.SpiderFilters = this.filters;
  };

  public mockUpSpiderFilter1: any = {
    title: 'Volume',
    min: 0,
    max: 100
  };

  public mockUpSpiderFilter2: any = {
    title: 'Closeness',
    min: 0,
    max: 100
  };

  public mockUpSpiderFilter3: any = {
    title: 'Importance',
    min: 0,
    max: 100
  };

  ngOnInit() {
  }

}
