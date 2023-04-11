import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { environment } from 'src/environments/environment';
import { DailyForecastService } from '../services/daily-forecast/daily-forecast.service';
import { ForecastStatus } from '../utils/forecast-status';
import DailyForecastModel from '../models/daily-forecast.model';
import GeoLocationResponseModel from '../models/geo-location-response.model';
import GeoLocationCityModel from '../models/geo-location-town.model';
import TimezoneModel from '../models/timezone.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly dailyForecastService = inject(DailyForecastService);

  private readonly geoLocationApiUrl = environment.geoLocationApiUrl;
  private readonly timezoneApiUrl = environment.timezoneApiUrl;

  cityControl = new FormControl('');
  currentForecast = ForecastStatus.Sunny;
  selectedCity: GeoLocationCityModel | null = null;
  dailyForecasts$: Observable<DailyForecastModel[]> | undefined;
  filteredOptions: Observable<GeoLocationCityModel[]> | undefined;

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
          } as GeoLocationCityModel);
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

  addToFavorites() {
    if (this.selectedCity) {
      this.dailyForecastService.addToFavorites(this.selectedCity);
    } else {
      console.error("No city selected!");
    }
  }

  displayCityName(city: GeoLocationCityModel) {
    return city && city.name ? city.name + ", " + city.country : "";
  }

  onSelectionChanged(event: MatAutocompleteSelectedEvent): void {
    this.dailyForecastService.setDailyForecasts(event.option.value);
    this.selectedCity = event.option.value;
  }

  scrollToNowHour(): void {
    const currentHour = new Date().getHours();
    const hourId = currentHour < 23 ? currentHour + 1 : currentHour;

    document.getElementById(`${hourId}`)?.scrollIntoView();
  }
}
