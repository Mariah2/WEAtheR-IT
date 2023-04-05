import { ForecastStatus } from "../utils/forecast-status";

export default interface HourlyForecastModel {
    forecastStatus: ForecastStatus; 
    relativehumidity_2m: number;
    temperature_2m: number;
    time: Date;
}