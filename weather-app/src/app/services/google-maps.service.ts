import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { WeatherItem } from '../models/weather-item';

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsService {

  constructor(private http: HttpClient) {  }

  getMapUrl(lat: number, lon: number): string{
    return `https://maps.google.com/maps?q=${lat},${lon}&z=15&output=embed`;
  }
}

