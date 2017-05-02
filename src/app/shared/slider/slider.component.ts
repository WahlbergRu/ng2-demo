import {Component, Input, Output, EventEmitter, HostListener, ElementRef} from '@angular/core';

@Component({
  selector: 'slider',
  templateUrl: 'slider.component.html',
  styleUrls: ['slider.component.scss'],
})
export class SliderComponent {

  public isLoading: boolean = false;
  public _options: any;
  public page: string = 'slider';
  private _sliderOptions: any = {};
  private setting: any = {
    uiSliderHandle: 20
  }

  constructor(public element: ElementRef){}

  @Input() set options(options: any){
    this.isLoading = true;
    this._options = options;
    this._sliderOptions.value = [options.min, options.max];
  }

  @Output() outerData = new EventEmitter();

  public ngAfterViewChecked(): void {
    if (this.element.nativeElement.children[0]){
      //-20 потому что верстальщики пидарасы и не знают чем отличается марджин от паддинга.
      this._sliderOptions.width = this.element.nativeElement.children[0].offsetWidth;
    }
  }

  public toInt(v:any): number{
    return parseInt(v);
  }


  @HostListener('window:mouseup', ['$event'])
  onMouseup(){
    this._sliderOptions.mouseDownLeft = false;
    this._sliderOptions.mouseDownRight = false;
  }

  @HostListener('window:mousemove', ['$event'])
  onMousemove(event: MouseEvent) {
    event.preventDefault();
    if(this._sliderOptions.mouseDownLeft) {
      this.scrollHandle(event);
      this._sliderOptions.last = event;
    }
    if(this._sliderOptions.mouseDownRight) {
      this.scrollHandle(event);
      this._sliderOptions.last = event;
    }
  }

  @HostListener('mousedown', ['$event'])
  onMousedown(event) {
    if (this._sliderOptions.borderLeft === undefined) this._sliderOptions.borderLeft = 0;
    if (this._sliderOptions.borderRight === undefined && this._sliderOptions.width) this._sliderOptions.borderRight = this._sliderOptions.width-this.setting.uiSliderHandle;

    if (event.target.classList.contains('ui-slider-handle-left')){
      this._sliderOptions.leftTemp = event.target.parentElement.parentElement.offsetLeft;
      this._sliderOptions.leftElement = event.toElement;
      this._sliderOptions.mouseDownLeft = true;
      this._sliderOptions.last = event;
    };

    if (event.target.classList.contains('ui-slider-handle-right')){
      this._sliderOptions.leftTemp = event.target.parentElement.parentElement.offsetLeft;
      this._sliderOptions.rightElement = event.toElement;
      this._sliderOptions.mouseDownRight = true;
      this._sliderOptions.last = event;
    };
  }

  public scrollHandle(event){
    if (this._sliderOptions.mouseDownLeft === true){
      this._sliderOptions.moveLeft = -this._sliderOptions.leftTemp+event.x;
      //Краевое значение слева
      if (this._sliderOptions.moveLeft < 0) this._sliderOptions.moveLeft = 0;
      //this.setting.uiSliderHandle*2 - ширина двух скролов.
      //Краевое значение справа
      if (this._sliderOptions.moveLeft >= this._sliderOptions.borderRight-this.setting.uiSliderHandle){
        this._sliderOptions.moveLeft =  this._sliderOptions.borderRight-this.setting.uiSliderHandle;
      }
      this._sliderOptions.borderLeft=this._sliderOptions.moveLeft;
    };

    if (this._sliderOptions.mouseDownRight === true){
      this._sliderOptions.moveRight = -this._sliderOptions.leftTemp+event.x;
      //Краевое значение справа
      if (this._sliderOptions.moveRight > this._sliderOptions.width-this.setting.uiSliderHandle) this._sliderOptions.moveRight = this._sliderOptions.width-this.setting.uiSliderHandle;
      //this.setting.uiSliderHandle*2 - ширина двух скролов.
      //Краевое значение слева
      if (this._sliderOptions.moveRight <= this._sliderOptions.borderLeft+this.setting.uiSliderHandle){
        this._sliderOptions.moveRight =  this._sliderOptions.borderLeft+this.setting.uiSliderHandle
      }
      this._sliderOptions.borderRight=this._sliderOptions.moveRight;
    };

    this._sliderOptions.relativeValue = [
      (this._sliderOptions.borderLeft                               ) / (this._sliderOptions.width-2*this.setting.uiSliderHandle),
      (this._sliderOptions.borderRight - this.setting.uiSliderHandle) / (this._sliderOptions.width-2*this.setting.uiSliderHandle)
    ];

    this._sliderOptions.value = [
      this._options.min + (this._options.max-this._options.min)*this._sliderOptions.relativeValue[0],
      this._options.min + (this._options.max-this._options.min)*this._sliderOptions.relativeValue[1]
    ];

    this._sliderOptions.widthStyle = this._sliderOptions.borderRight-this._sliderOptions.borderLeft;
    this.outerData.emit(this._sliderOptions.value);
  }

}
