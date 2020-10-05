import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { WeatherItem } from '../models/weather-item';


@Injectable({
  providedIn: 'root'
})
export class WeatherApiService {

  constructor(private http: HttpClient) {  }

  getWeatherData(location: string): Observable<WeatherItem> {
  return this.http.get<WeatherItem>(`http://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&lang=de&appid=45f4dd45e0f724512ba044c5a2caf4bc`);
  }

  getWeatherIconUrl(icon: string): string{
    return `http://openweathermap.org/img/wn/${icon}@2x.png`;
  }
}

