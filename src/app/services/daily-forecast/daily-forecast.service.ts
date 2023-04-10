import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

import ForecastResponseModel from 'src/app/models/forecast-response.model';
import DailyForecastModel from 'src/app/models/daily-forecast.model';
import HourlyForecastModel from 'src/app/models/hourly-forecast.model';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { ForecastStatus } from 'src/app/utils/forecast-status';
import GeoLocationTownModel from 'src/app/models/geo-location-town.model';


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

  setDailyForecasts(city: GeoLocationTownModel): void {
    const today = new Date();
    const startDate = today.toISOString().substring(0, 10);
    
    today.setDate(today.getDate() + 6)
    const endDate = today.toISOString().substring(0, 10);

    this.http.get<ForecastResponseModel>(`${this.forecastApiUrl}&timezone=${city.timezone}&latitude=${city.latitude}&longitude=${city.longitude}&start_date=${startDate}&end_date=${endDate}`).subscribe({
      next: (data: ForecastResponseModel) => {
        this.dailyForecastsSubject.next(this.getDailyForecastsFromData(data));
      }
    });
  }

  private getDailyForecastsFromData(data: ForecastResponseModel): DailyForecastModel[] {
    let dailyForecasts: DailyForecastModel[] = [];

    for (let i = 0; i < data.daily.sunrise.length; i++) {
      const newDailyForecast: DailyForecastModel = {
        sunrise: data.daily.sunrise[i],
        sunset: data.daily.sunset[i],
        hourlyForecasts: [],
      };

      dailyForecasts.push(newDailyForecast);
    }

    for (let i = 0; i < data.hourly.rain.length; i++) {
      const dayIndex = Math.floor(i / 24);
      const newHourlyForecast: HourlyForecastModel = {
        forecastStatus: this.getforecastStatus(
          data.hourly.cloudcover[i],
          data.hourly.rain[i],
          data.hourly.snowfall[i],
          data.hourly.time[i],
          dailyForecasts[dayIndex].sunrise,
          dailyForecasts[dayIndex].sunset),
        relativehumidity_2m: data.hourly.relativehumidity_2m[i],
        temperature_2m: Math.round(data.hourly.temperature_2m[i]),
        time: data.hourly.time[i]
      };

      dailyForecasts[dayIndex].hourlyForecasts.push(newHourlyForecast);
    }
    return dailyForecasts;
  }

  private checkIfDay(sunrise: Date, sunset: Date, time: Date): boolean {
    return sunrise < time && time < sunset;
  }

  private getforecastStatus(
    cloudcover: number,
    rain: number,
    snowfall: number,
    time: Date,
    sunrise: Date,
    sunset: Date): ForecastStatus {
    if (rain > snowfall) {
      return ForecastStatus.Rainy;
    }

    if (snowfall > rain) {
      return ForecastStatus.Snowy;
    }

    if (cloudcover >= 25 && cloudcover <= 75) {
      return this.checkIfDay(sunrise, sunset, time) ? ForecastStatus.SunnyCloudy : ForecastStatus.NightCloudy;
    }

    if (cloudcover > 75) {
      return ForecastStatus.Cloudy;
    }

    return this.checkIfDay(sunrise, sunset, time) ? ForecastStatus.Sunny : ForecastStatus.Night;
  }
}

