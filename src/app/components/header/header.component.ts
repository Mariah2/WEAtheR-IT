import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { DailyForecastService } from 'src/app/services/daily-forecast/daily-forecast.service';
import HourlyForecastModel from 'src/app/models/hourly-forecast.model';
import { Observable, of } from 'rxjs';
import DailyForecastModel from 'src/app/models/daily-forecast.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatIconModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  private readonly dailyForecastService = inject(DailyForecastService);

  currentHourForecast$: Observable<HourlyForecastModel> | undefined;

  ngOnInit(): void {
    this.dailyForecastService.getDailyForecasts().subscribe({
      next: (dailyForecasts: DailyForecastModel[]) => {
        if (dailyForecasts && dailyForecasts.length > 0) {
          const currentHour = new Date().getHours();

          this.currentHourForecast$ = of(dailyForecasts[0].hourlyForecasts[currentHour]);
        }
      }
    })
  }
}
