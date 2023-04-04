import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import GeoLocationResponseModel from '../models/geo-location-response.model';
import { Observable, of } from 'rxjs';
import DailyForecastModel from '../models/daily-forecast.model';
import { DailyForecastService } from '../services/daily-forecast/daily-forecast.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private readonly geoLocationApiUrl = environment.geoLocationApiUrl;
  private readonly ipApiUrl = environment.ipApiUrl;

  dailyForecasts$: Observable<DailyForecastModel[]> | undefined;

  constructor(
    private readonly http: HttpClient,
    private readonly dailyForecastService: DailyForecastService) { }

  ngOnInit(): void {
    this.dailyForecastService.setDailyForecasts();

    this.http.get<GeoLocationResponseModel>(`${this.geoLocationApiUrl}/search?name=zalau`).subscribe({
      next: (values: GeoLocationResponseModel) => {
        console.log(values);
        console.log(navigator.geolocation.getCurrentPosition((loc) => {
          console.log(loc);
        }));
      }
    });

    this.dailyForecastService.getDailyForecasts().subscribe({
      next: (dailyForecasts: DailyForecastModel[]) => {
        this.dailyForecasts$ = of(dailyForecasts);
        this.scrollToNowHour();
      }
    });
  }
  
  scrollToNowHour(): void {
    const date = new Date();
    const currentHour = date.getHours();
    const nowHour = currentHour < 23 ? currentHour + 1 : currentHour;

    document.getElementById(`${nowHour}`)?.scrollIntoView();
  }
}
