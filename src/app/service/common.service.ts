import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CountryDto } from '../model/country-dto';
import { Observable, throwError } from 'rxjs';
import {  CountryWeatherDto } from '../model/country-weather';
import { CountryDaysWeatherDto } from '../model/country-days-weather-dto';

export interface CommunicationData {
  // data?: string;
  countLength?: number
}
@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private http: HttpClient, private router: Router) { }
  baseUrl = environment.baseUrl;
  APIKey='d4594364698122bfd1c4b3eb5f2ff19f';

  // ********API Url's*********
  apiUrls = {
    searchLocationForCoordinates: '/geo/1.0/direct?q=',//?q={city name},{state code},{country code}&limit={limit}&appid={API key}'
    findWetherByCoordinates:'data/2.5/weather',//?lat=44.34&lon=10.99&appid={API key}'
    searchCountryByName:"data/2.5/weather?q=",//'&appid={API key}"
    upComingFiveDaysWeather:'/data/2.5/forecast/daily?q=',//{city name}&appid={API key}'
    sevenDays:"/data/2.5/onecall?lat="
    //=38.7267&lon=-9.1403
    //&exclude=current,hourly,minutely,alerts&units=metric&appid={API key}
  };
  private $data = new Subject<CommunicationData>();

  public dataReceivedEvent = this.$data.asObservable();
  public setDataToSend(data: CommunicationData): void {
    this.$data.next(data);
    console.log(this.$data);
  }
  searchCountryLocation(countryName:string):Observable<CountryWeatherDto>{
   // return this.http.get(this.baseUrl+this.apiUrls.searchLocation+countryName+',&limit=1&appid='+this.APIKey)
   return this.http.get<CountryWeatherDto>(this.baseUrl + this.apiUrls.searchCountryByName+countryName+'&appid='+this.APIKey)
  }
  findWeather(country:/*CountryWeatherDto*/any): Observable<CountryWeatherDto>{
    return this.http.get<CountryWeatherDto>(this.baseUrl+this.apiUrls.findWetherByCoordinates+'?lat='+country.lat+'&lon='+country.lon+
    '&appid='+this.APIKey)
  }
  findUpComingFiveDaysWeather(country:CountryWeatherDto):Observable<CountryDaysWeatherDto>{
    console.log(country);
    
    // return this.http.get<CountryWeatherDto>(this.baseUrl + this.apiUrls.upComingFiveDaysWeather+country.name+'&cnt=3&appid='+this.APIKey)
    return this.http.get<CountryDaysWeatherDto>(this.baseUrl+this.apiUrls.sevenDays+country.coord.lat+'&lon='+country.coord.lon
    +'&exclude=current,hourly,minutely,alerts&units=metric&appid='+this.APIKey)
  }
  toCelsius(kelvin):number {
    if(Number.isFinite(kelvin)) { // Checking if kelvin is a number.
        const KELVIN_CELSIUS_DIFF = 273.15; // maybe unnecessary here, but it is good practice to avoid magic numbers.
        let celsius = kelvin - KELVIN_CELSIUS_DIFF;
        return +celsius.toFixed(0); // could also be just return kelvin - KELVIN_CELSIUS_DIFF;
    } return 0;
}
}
