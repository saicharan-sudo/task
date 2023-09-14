export class CountryDaysWeatherDto {
    lat: number
    lon: number
    timezone: string
    timezone_offset: number
    daily: Daily[]
  }
  
  export class Daily {
    dt: number
    sunrise: number
    sunset: number
    moonrise: number
    moonset: number
    moon_phase: number
    temp: Temp
    feels_like: FeelsLike
    pressure: number
    humidity: number
    dew_point: number
    wind_speed: number
    wind_deg: number
    wind_gust: number
    weather: Weather[]
    clouds: number
    pop: number
    uvi: number
    rain?: number;
    convertedDate:string;
  }
  
  export class Temp {
    day: number
    min: number
    max: number
    night: number
    eve: number
    morn: number
  }
  
  export class FeelsLike {
    day: number
    night: number
    eve: number
    morn: number
  }
  
  export class Weather {
    id: number
    main: string
    description: string
    icon: string
  }
  