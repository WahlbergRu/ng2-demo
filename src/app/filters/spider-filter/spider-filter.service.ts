import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class SpiderFilterService {

  /**
   * service for filters with observable
   */
  private _SpiderFilters:any = new Subject<any>();
  spiderFilters$ = this._SpiderFilters.asObservable();

  public set SpiderFilters(value: any){
    this._SpiderFilters.next(value);
  }

  public get SpiderFilters():any{
    return this._SpiderFilters;
  }


}
