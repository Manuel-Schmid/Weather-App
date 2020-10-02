import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { City } from '../models/city';

@Injectable({
  providedIn: 'root'
})
export class CityApiService {

  constructor(private http: HttpClient) { }

  getCities(): Observable<City[]>{
    return this.http.get<City[]>('https://api.jsonbin.io/b/5f76e76165b18913fc58897b');
  }
}
