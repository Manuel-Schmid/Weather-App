import { getUrlScheme } from '@angular/compiler';
import { Component, Input } from '@angular/core';
import { WeatherApiService } from './services/weather-api.service';
import { WeatherItem } from './models/weather-item';
import { Observable } from 'rxjs';
import { GoogleMapsService } from './services/google-maps.service';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { CityApiService } from './services/city-api.service';
import { City } from './models/city';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'weather-app';
  location = '';
  weatherData: WeatherItem;
  trustedUrl: SafeUrl;
  errormsg = '';
  isError: boolean;
  cities: City[];
  typeAheadCities: City[];
  typeAheadIsOn: boolean;

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

  onSearchKeyUp(event: any): void {
    this.typeAheadIsOn = true;
    this.location = event.target.value;
    // search with enter
    if (event.keyCode === 13){
      this.onSearch(this.location);
    }
    // turn typeAhead off with escape
    if (event.keyCode === 27){
      this.typeAheadOff();
    }
  }

  onSearch(location: string): void {
    this.typeAheadIsOn = false;
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
    (document.getElementById('searchInput') as HTMLInputElement).value = location;
  }

  typeAheadOff(): void {
    this.typeAheadIsOn = false;
  }

  typeAheadOn(): void {
    this.typeAheadIsOn = true;
  }

  onTypeahead(location: string): void {
      this.typeAheadCities = this.cities.filter((city: City) => {
        if (
          city.city.toLowerCase().includes(location.toLowerCase())
          ||
          this.specialLetters(city.city.toLowerCase()).includes(this.specialLetters(location.toLowerCase()))) {
          return true;
        } else {
          return false;
        }
      });
      this.typeAheadCities.sort(this.compare);
      this.typeAheadCities = this.typeAheadSorting(this.typeAheadCities, location);
  }

  compare(a, b): number{
    const cityA = a.city.toLowerCase();
    const cityB = b.city.toLowerCase();

    let comparison = 0;
    if (cityA > cityB) {
      comparison = 1;
    } else if (cityA < cityB) {
      comparison = -1;
    }
    return comparison;
  }

  typeAheadSorting(typeAheadCities: City[], location: string): City[]{
    const startingCities = typeAheadCities.filter((city: City) => {
      return city.city.toLowerCase().startsWith(location.toLowerCase());
    });
    const otherCities = typeAheadCities.filter((city: City) => {
      return city.city.toLowerCase().startsWith(location.toLowerCase()) !== true;
    });
    return [...startingCities, ...otherCities];
  }

  specialLetters(searchTerm: string): string{
      searchTerm = searchTerm.replace(/ä/g, 'ae');
      searchTerm = searchTerm.replace(/ü/g, 'ue');
      searchTerm = searchTerm.replace(/ö/g, 'oe');
      searchTerm = searchTerm.replace(/é/g, 'e');
      searchTerm = searchTerm.replace(/è/g, 'e');
      searchTerm = searchTerm.replace(/ê/g, 'e');
      searchTerm = searchTerm.replace(/à/g, 'a');
      searchTerm = searchTerm.replace(/â/g, 'a');
      searchTerm = searchTerm.replace(/ô/g, 'o');
      searchTerm = searchTerm.replace(/û/g, 'u');
      searchTerm = searchTerm.replace(/ç/g, 'c');
      searchTerm = searchTerm.replace(/î/g, 'i');
      searchTerm = searchTerm.replace(/ë/g, 'e');
      searchTerm = searchTerm.replace(/ï/g, 'i');
      searchTerm = searchTerm.replace(/sankt/g, 'st.');
      return searchTerm;
  }

  getWeather(location: string): Observable<WeatherItem>{
    return this.weatherApiService.getWeatherData(location);
  }

  getIcon(): string{
    return this.weatherApiService.getWeatherIconUrl(this.weatherData.weather[0].icon);
  }

  getMap(): string{
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

  sanitizedURL(): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.getMap());
  }
}
