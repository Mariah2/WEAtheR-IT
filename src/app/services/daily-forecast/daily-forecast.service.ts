import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

import ForecastResponseModel from 'src/app/models/forecast-response.model';
import DailyForecastModel from 'src/app/models/daily-forecast.model';
import HourlyForecastModel from 'src/app/models/hourly-forecast.model';
import { Observable, BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class DailyForecastService {
  private readonly forecastApiUrl = environment.forecastApiUrl;
  private readonly dailyForecastsSubject = new BehaviorSubject<DailyForecastModel[]>([]);

  constructor(private readonly http: HttpClient) { }

  getDailyForecasts(): Observable<DailyForecastModel[]> {
    return this.dailyForecastsSubject.asObservable();
  }

  setDailyForecasts(): void {
    this.http.get<ForecastResponseModel>(`${this.forecastApiUrl}/forecast?latitude=47.18592&longitude=23.0588416&longitude=23.05&hourly=temperature_2m,relativehumidity_2m,rain,showers,snowfall,cloudcover&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum&start_date=2023-04-04&end_date=2023-04-10&timezone=Europe%2FBucharest`).subscribe({
      next: (value: ForecastResponseModel) => {
        let dailyForecasts: DailyForecastModel[] = [];

        for (let i = 0; i < value.daily.sunrise.length; i++) {
          const newDailyForecast: DailyForecastModel = {
            sunrise: value.daily.sunrise[i],
            sunset: value.daily.sunset[i],
            hourlyForecasts: [],
          };

          dailyForecasts.push(newDailyForecast);
        }

        for (let i = 0; i < value.hourly.rain.length; i++) {
          const newHourlyForecast: HourlyForecastModel = {
            cloudcover: value.hourly.cloudcover[i],
            rain: value.hourly.rain[i],
            relativehumidity_2m: value.hourly.relativehumidity_2m[i],
            showers: value.hourly.showers[i],
            snowfall: value.hourly.snowfall[i],
            temperature_2m: Math.round(value.hourly.temperature_2m[i]),
            time: value.hourly.time[i]
          };

          dailyForecasts[Math.floor(i / 24)].hourlyForecasts.push(newHourlyForecast);
        }

        this.dailyForecastsSubject.next(dailyForecasts);
      }
    });
 }
}

