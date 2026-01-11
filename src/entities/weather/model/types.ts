export interface CurrentWeather {
    name: string;
    main: {
      temp: number;
      temp_min: number;
      temp_max: number;
    };
  }
  
  export interface HourlyWeatherItem {
    dt: number;
    main: {
      temp: number;
    };
  }
  