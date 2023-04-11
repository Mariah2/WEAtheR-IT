import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';

import { DailyForecastService } from 'src/app/services/daily-forecast/daily-forecast.service';
import HourlyForecastModel from 'src/app/models/hourly-forecast.model';
import DailyForecastModel from 'src/app/models/daily-forecast.model';
import GeoLocationCityModel from 'src/app/models/geo-location-town.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatToolbarModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  private readonly dailyForecastService = inject(DailyForecastService);

  currentHourForecast$: Observable<HourlyForecastModel> | undefined;
  favoriteCities$: Observable<GeoLocationCityModel[]> | undefined;

  ngOnInit(): void {
    this.dailyForecastService.getDailyForecasts().subscribe({
      next: (dailyForecasts: DailyForecastModel[]) => {
        if (dailyForecasts && dailyForecasts.length > 0) {
          const currentHour = new Date().getHours();

          this.currentHourForecast$ = of(dailyForecasts[0].hourlyForecasts[currentHour]);
        }
      }
    })

    this.dailyForecastService.getFavoriteCitites().subscribe({
      next: (favoriteCities: GeoLocationCityModel[]) => {
        this.favoriteCities$ = of(favoriteCities);
      }
    });
  }

  removeCity(city: GeoLocationCityModel) {
    this.dailyForecastService.removeFromFavorites(city);
  }

  selectCity(city: GeoLocationCityModel) {
    this.dailyForecastService.setDailyForecasts(city);
  }
}
