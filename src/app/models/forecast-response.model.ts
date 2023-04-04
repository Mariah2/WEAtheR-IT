export default interface ForecastResponseModel {
    daily: {
        sunrise: Date[],
        sunset: Date[]
    }
    hourly: {
        cloudcover: number[],
        rain: number[],
        relativehumidity_2m: number[],
        showers: number[],
        snowfall: number[],
        temperature_2m: number[],
        time: Date[]
    }
}