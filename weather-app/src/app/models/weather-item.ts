export interface WeatherItem
{
  'coord': {
    'lon': 9.13,
    'lat': 47.34
  };
  'weather': [
      {
        'id': number,
        'main': string,
        'description': string,
        'icon': string
      }
    ];
  'main':
      {
      'temp': number,
      'feels_like': number,
      'temp_min': number,
      'temp_max': number,
      'pressure': number,
      'humidity': number
      };
  'timezone': number;
  'id': number;
  'name': string;
  'cod': number;
  'dt': number;
}
