import { getUrlScheme } from '@angular/compiler';
import { Component, Input } from '@angular/core';
import { WeatherApiService } from './services/weather-api.service';
import { WeatherItem } from './models/weather-item';
import { debounceTime, distinctUntilChanged, map, switchMap, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { GoogleMapsService } from './services/google-maps.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CityApiService } from './services/city-api.service';
import { City } from './models/city';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'weather-app';
  public location = '';
  weatherData: WeatherItem;
  trustedUrl: SafeUrl;
  errormsg = '';
  isError: boolean;
  cities: City[];
  typeaheadCities: City[];

  /*
  search = (text$: Observable<string>) => {
    return text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2
        ? []
        : this.cityNames.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
      );
  }
  */

  constructor(
    private weatherApiService: WeatherApiService,
    private googleMapsService: GoogleMapsService,
    private cityApiService: CityApiService,
    private sanitizer: DomSanitizer
    )
    {
      cityApiService.getCities().subscribe((cities: City[]) => {
        this.cities = cities;
      });
    }

  onSearch(location: string): any {
    this.errormsg = '';
    this.isError = false;
    this.weatherData = null;
    this.getWeather(location).subscribe(
      (weather: WeatherItem) => this.weatherData = weather,
      error => {
        this.isError = true;
        if (location === '') {
          this.errormsg = `Please enter a valid city name.`;
        } else {
          this.errormsg = `There is no city called "${location}" in our database.`;
        }
      }
    );
  }

  onSearchKeyUp(event: any): any {
    this.location = event.target.value;
    // search with enter
    if (event.keyCode === 13){
      this.onSearch(this.location);
    }
  }

  onTypeahead(location: string): void {
      console.log('typeahead', location);
      this.typeaheadCities = this.cities.filter((city: City) => {
        if (city.city.toLowerCase().includes(location.toLowerCase()) || city.admin.toLowerCase().includes(location.toLowerCase())) {
          return true;
        } else {
          return false;
        }
      });
  }

  /*
  getCityNames(): void {
    const cities = this.cities;
    let cityNames = [];
    for (let i = 0; i < cities.length; i++) {
      cityNames.push(cities[i].city);
    }
    this.cityNames = cityNames;
    console.log(this.cityNames);
  }
  */

  getWeather(location: string): Observable<WeatherItem>{
    return this.weatherApiService.getWeatherData(location);
  }

  getIcon(): any{
    return this.weatherApiService.getWeatherIconUrl(this.weatherData.weather[0].icon);
  }

  getMap(): any{
    return this.googleMapsService.getMapUrl(this.weatherData.coord.lat, this.weatherData.coord.lon);
  }

  getDate(): string{
    const date = new Date();
    const localTime = date.getTime();
    const localOffset = date.getTimezoneOffset() * 60000;
    const utc = localTime + localOffset;
    const offset = this.weatherData.timezone / 3600;
    const currentTime = utc + (3600000 * offset);
    const currentDate = new Date(currentTime);
    const dd = (currentDate.getDate() < 10 ? '0' : '') + currentDate.getDate();
    const MM = ((currentDate.getMonth() + 1) < 10 ? '0' : '') + (currentDate.getMonth() + 1);
    const hh = (currentDate.getHours() < 10 ? '0' : '') + currentDate.getHours();
    const mm = (currentDate.getMinutes() < 10 ? '0' : '') + currentDate.getMinutes();
    const cd = `${dd}.${MM}.${currentDate.getFullYear()} ${hh}:${currentDate.getMinutes()}`;

    return cd;
  }

  sanitizedURL(): any {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.getMap());
  }
}
