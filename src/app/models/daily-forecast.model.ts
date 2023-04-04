import HourlyForecastModel from "./hourly-forecast.model";

export default interface DailyForecastModel {
    sunrise: Date;
    sunset: Date;
    hourlyForecasts: HourlyForecastModel[];
}