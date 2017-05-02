import { Component, Directive, ElementRef } from '@angular/core';
import { SpiderFilterService } from "./filters/spider-filter/spider-filter.service";



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  providers: [SpiderFilterService],
})
export class AppComponent {

  constructor(public spiderFilterService: SpiderFilterService){ }

  public filters:any;

}
