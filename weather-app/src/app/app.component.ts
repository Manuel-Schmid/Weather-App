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

  constructor(
    private weatherApiService: WeatherApiService,
    private googleMapsService: GoogleMapsService,
    private sanitizer: DomSanitizer)
    {  }

  onInput(event: any): any {
    this.location = event.target.value;
  }

  onSearch(location: string): void {
    this.weather = this.getWeather(location);
    this.weather.subscribe(data => this.weatherData = data);
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
    const cd = currentDate.toLocaleString(); /* [], {hour: '2-digit', minute: '2-digit'} */
    return cd;
  }

  sanitizedURL(): any {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.getMap());
  }
}
