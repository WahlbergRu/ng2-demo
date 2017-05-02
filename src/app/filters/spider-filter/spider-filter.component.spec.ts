import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpiderFilterComponent } from './spider-filter.component';

describe('SpiderFilterComponent', () => {
  let component: SpiderFilterComponent;
  let fixture: ComponentFixture<SpiderFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpiderFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpiderFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
