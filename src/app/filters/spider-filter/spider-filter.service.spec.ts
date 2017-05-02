import { TestBed, inject } from '@angular/core/testing';

import { SpiderFilterService } from './spider-filter.service';

describe('SpiderFilterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SpiderFilterService]
    });
  });

  it('should ...', inject([SpiderFilterService], (service: SpiderFilterService) => {
    expect(service).toBeTruthy();
  }));
});
