import { getUrlScheme } from '@angular/compiler';
import { Component, Input } from '@angular/core';
import { WeatherApiService } from './services/weather-api.service';
import { WeatherItem } from './models/weather-item';
import { Observable } from 'rxjs';
import { GoogleMapsService } from './services/google-maps.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'weather-app';
  location = '';
  weather: Observable<WeatherItem>;
  weatherData: WeatherItem;
  trustedUrl: SafeUrl;
  errormsg = '';
  isError: boolean;

  constructor(
    private weatherApiService: WeatherApiService,
    private googleMapsService: GoogleMapsService,
    private sanitizer: DomSanitizer)
    {  }

  onInput(event: any): any {
    this.location = event.target.value;
    // search with enter
    if (event.keyCode === 13){
      this.onSearch(this.location);
    }
  }

  onSearch(location: string): any {
    this.errormsg = '';
    this.isError = false;
    this.weatherData = null;
    this.weather = this.getWeather(location);
    this.weather.subscribe(
      data => this.weatherData = data,
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
    const mm = ((currentDate.getMonth() + 1) < 10 ? '0' : '') + (currentDate.getMonth() + 1);
    const cd = `${dd}.${mm}.${currentDate.getFullYear()}  ${currentDate.getHours()}:${currentDate.getMinutes()}`;

    return cd;
  }

  sanitizedURL(): any {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.getMap());
  }
}
