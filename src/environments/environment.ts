// This file can be replaced during build by using the fileReplacements array.
// ng build replaces environment.ts with environment.prod.ts.
// The list of file replacements can be found in angular.json.

export const environment = {
    production: false,
    forecastApiUrl: "https://api.open-meteo.com/v1/forecast?hourly=temperature_2m,relativehumidity_2m,rain,showers,snowfall,cloudcover&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum",
    geoLocationApiUrl: "https://geocoding-api.open-meteo.com/v1",
    timezoneApiUrl: "https://api.wheretheiss.at/v1/coordinates",
  };
  
  /*
   * For easier debugging in development mode, you can import the following file
   * to ignore zone related error stack frames such as zone.run, zoneDelegate.invokeTask.
   *
   * This import should be commented out in production mode because it will have a negative impact
   * on performance if an error is thrown.
   */
  // import 'zone.js/plugins/zone-error';  // Included with Angular CLI.