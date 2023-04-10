import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import GeoLocationResponseModel from '../models/geo-location-response.model';
import { Observable, of } from 'rxjs';
import DailyForecastModel from '../models/daily-forecast.model';
import { DailyForecastService } from '../services/daily-forecast/daily-forecast.service';
import { MatIconModule } from '@angular/material/icon';
import { ForecastStatus } from '../utils/forecast-status';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import GeoLocationTownModel from '../models/geo-location-town.model';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import TimezoneModel from '../models/timezone.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private readonly geoLocationApiUrl = environment.geoLocationApiUrl;
  private readonly timezoneApiUrl = environment.timezoneApiUrl;

  cityControl = new FormControl('');
  currentForecast = ForecastStatus.Sunny;
  dailyForecasts$: Observable<DailyForecastModel[]> | undefined;
  filteredOptions: Observable<GeoLocationTownModel[]> | undefined;

  constructor(
    private readonly http: HttpClient,
    private readonly dailyForecastService: DailyForecastService) { }


  ngOnInit(): void {
    this.cityControl.valueChanges.subscribe({
      next: (value: string | null) => {
        this.http.get<GeoLocationResponseModel>(`${this.geoLocationApiUrl}/search?name=${value}`).subscribe({
          next: (value: GeoLocationResponseModel) => {
            this.filteredOptions = of(value.results);
          }
        });
      }
    })

    navigator.geolocation.getCurrentPosition(position => {
      this.http.get<TimezoneModel>(`${this.timezoneApiUrl}/${position.coords.latitude},${position.coords.longitude}`).subscribe({
        next: (value: TimezoneModel) => {
          this.dailyForecastService.setDailyForecasts({
            longitude: value.longitude,
            latitude: value.latitude,
            timezone: value.timezone_id
          } as GeoLocationTownModel);
        }
      })
    });

    this.dailyForecastService.getDailyForecasts().subscribe({
      next: (dailyForecasts: DailyForecastModel[]) => {
        const currentHour = new Date().getHours();
        this.currentForecast = dailyForecasts[0]?.hourlyForecasts[currentHour].forecastStatus;

        this.dailyForecasts$ = of(dailyForecasts);
        this.scrollToNowHour();
      }
    });
  }

  scrollToNowHour(): void {
    const currentHour = new Date().getHours();
    const hourId = currentHour < 23 ? currentHour + 1 : currentHour;

    document.getElementById(`${hourId}`)?.scrollIntoView();
  }

  onSelectionChanged(event: MatAutocompleteSelectedEvent): void {
    this.dailyForecastService.setDailyForecasts(event.option.value);
  }

  displayCityName(city: GeoLocationTownModel) {
    return city && city.name ? city.name + ", " + city.country : "";
  }
}
