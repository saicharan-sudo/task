import { Component } from '@angular/core';
import { CommonService } from '../service/common.service';
import { CountryDto } from '../model/country-dto';
import {  CountryWeatherDto } from '../model/country-weather';
import { CountryDaysWeatherDto } from '../model/country-days-weather-dto';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
export class WeatherComponent {

  constructor(public _commonService:CommonService){}
  searchCountry:string;
  searchHistory:CountryWeatherDto[]=[];
  wetherOfCountryData:CountryWeatherDto;
  fiveDaysResponse:CountryDaysWeatherDto;
  searchCountryByName(){
    this._commonService.searchCountryLocation(this.searchCountry)
    .subscribe({
      next: (res) => { 
        console.log(res);
        let wetherOfCountryData:CountryWeatherDto;
        wetherOfCountryData = res;
        wetherOfCountryData.calculatedCelcius = this._commonService.toCelsius(res.main.temp);
        this.wetherOfCountryData = wetherOfCountryData;
        this.searchHistory.push(this.wetherOfCountryData);
       },     // nextHandler
      error: (error) => { 
        console.log(error);
        
       },    // errorHandler 
      //complete: () => { ... }, // completeHandler
  });
    
  }
  fetchWeatherHistoryOfFiveDays(country:CountryWeatherDto){
    this._commonService.findUpComingFiveDaysWeather(country)
    .subscribe({
      next: (res) => { 
        console.log(res);
        let response=res;
        response.daily.forEach((obj)=>{
          obj.convertedDate = new Date(obj.dt * 1000).toLocaleDateString("en", {
            weekday: "long",
          });

        })
        this.fiveDaysResponse = response;

       },     // nextHandler
      error: (error) => { 
        console.log(error);
        
       },    // errorHandler 
      //complete: () => { ... }, // completeHandler
  });
  }
  fetchWeatherHistory(country:CountryWeatherDto){
    this._commonService.findWeather(country)
    .subscribe({    
      next: (res) => { 
        console.log(res);
        // this.searchHistory.push(res[0]);
        let wetherOfCountryData:CountryWeatherDto;
        wetherOfCountryData = res;
        wetherOfCountryData.calculatedCelcius = this._commonService.toCelsius(res.main.temp);
        this.wetherOfCountryData = wetherOfCountryData;
       },     // nextHandler
      error: (error) => { 
        console.log(error);
        
       },    // errorHandler 
      //complete: () => { ... }, // completeHandler
  });
  }
}


