import { TestBed } from '@angular/core/testing';

import { DailyForecastService } from './daily-forecast.service';

describe('DailyForecastService', () => {
  let service: DailyForecastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DailyForecastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
