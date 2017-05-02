import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { SpiderComponent } from './charts/spider/spider.component';
import { SpiderFilterComponent } from './filters/spider-filter/spider-filter.component';
import { SliderComponent } from './shared/slider/slider.component';

@NgModule({
  declarations: [
    AppComponent,
    SpiderComponent,
    SpiderFilterComponent,
    SliderComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
