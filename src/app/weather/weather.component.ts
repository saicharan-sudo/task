import { Component, OnInit } from '@angular/core';
import { CommonService } from '../service/common.service';
import { CountryDto } from '../model/country-dto';
import { CountryWeatherDto } from '../model/country-weather';
import { CountryDaysWeatherDto } from '../model/country-days-weather-dto';
import { ToastrService } from 'ngx-toastr';
import { ValidationUtils } from '../shared/Validators';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
export class WeatherComponent implements OnInit {

  ngOnInit(): void {
    let x: any[] = [];
    x.unshift({ text: 'a' });
    x.unshift({ text: 'b' });
    x.unshift({ text: 'c' });
    x.unshift({ text: 'd' });
    x.unshift({ text: 'e' });
    x.unshift({ text: 'f' });
    x.unshift({ text: 'g' });
    x.unshift({ text: 'h' });
    if (x.length >= 8) {
      x.splice(x.length - 1, 1);

    } else {
    }
    x.unshift({ text: 'ab' });
    console.log(x);

    console.log(x.length);

  }

  constructor(public _commonService: CommonService, private _toastrService: ToastrService) { }
  searchCountry: string;
  searchHistory: CountryWeatherDto[] = [];
  // wetherOfCountryData: CountryWeatherDto;
  fiveDaysResponse: CountryDaysWeatherDto;
  isLoading: boolean = false;
  searchCountryByName() {
    let existed = this.searchHistory.findIndex(obj => obj.name.toLowerCase().trim() == this.searchCountry.toLowerCase().trim());
    if (existed != -1) {
      this._toastrService.show("entered city already exist", "Info");
      return;
    }
    if (ValidationUtils.isStringNull(this.searchCountry)) {
      this._toastrService.error("Please enter the country or city name to search", "Info");
      return;
    }
    this.isLoading = true;
    this._commonService.searchCountryLocation(this.searchCountry)
      .subscribe({
        next: (res) => {
          if (ValidationUtils.isObjectExists(res)) {
            let wetherOfCountryData: CountryWeatherDto;
            wetherOfCountryData = res;
            wetherOfCountryData.calculatedCelcius = this._commonService.toCelsius(res.main.temp);
            // this.wetherOfCountryData = wetherOfCountryData;
            if (this.searchHistory.length >= 8) {
              this.searchHistory.splice(this.searchHistory.length - 1, 1);
            }
            this.searchHistory.unshift(wetherOfCountryData);
            this._toastrService.success("Records Found", "Success");
          } else {
            this._toastrService.success("Something went wrong", "Info");
          }
          this.isLoading = false;
        },     // nextHandler
        error: (error) => {
          console.log(error);
          this.isLoading = false;
          this._toastrService.error(error?.error?.message, "Error");
        },    // errorHandler 
        //complete: () => { ... }, // completeHandler
      });

  }
  activeIndex: number;
  fetchWeatherHistoryOfFiveDays(country: CountryWeatherDto, index: number) {
    this.isLoading = true;
    this._commonService.findUpComingFiveDaysWeather(country)
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          this.activeIndex = index;
          if (ValidationUtils.isObjectExists(res)) {
            let response = res;
            response.daily.forEach((obj) => {
              obj.convertedDate = new Date(obj.dt *1000 ).toLocaleDateString("en", {
                day: "numeric",
              });
              obj.convertedDay = new Date(obj.dt * 1000).toLocaleDateString("en", {
                weekday: "short",
              });

            })
            this.fiveDaysResponse = response;
            this._toastrService.success("Records Found For Five Days Forcast", "Success");
          } else {
            this._toastrService.success("Something went wrong", "Info");
          }

        },     // nextHandler
        error: (error) => {
          this.isLoading = false;
          console.log(error);
          this._toastrService.error(error?.error?.message, "Error");

        },    // errorHandler 
        //complete: () => { ... }, // completeHandler
      });
  }
  fetchWeatherHistory(country: CountryWeatherDto) {
    this.isLoading = true;
    this._commonService.findWeather(country)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.isLoading = false;
          // this.searchHistory.push(res[0]);
          let wetherOfCountryData: CountryWeatherDto;
          wetherOfCountryData = res;
          wetherOfCountryData.calculatedCelcius = this._commonService.toCelsius(res.main.temp);
          // this.wetherOfCountryData = wetherOfCountryData;
        },     // nextHandler
        error: (error) => {
          console.log(error);
          this.isLoading = false;
        },    // errorHandler 
        //complete: () => { ... }, // completeHandler
      });
  }
  refreshWeather(country: CountryWeatherDto, index: number) {
    this.isLoading = true;
    this._commonService.searchCountryLocation(country.name)
      .subscribe({
        next: (res) => {
          if (ValidationUtils.isObjectExists(res)) {
            let wetherOfCountryData: CountryWeatherDto;
            wetherOfCountryData = res;
            // this.wetherOfCountryData = wetherOfCountryData;
            wetherOfCountryData.calculatedCelcius = this._commonService.toCelsius(wetherOfCountryData.main.temp);
            this.searchHistory[index] = wetherOfCountryData;
            this._toastrService.success("Updated Successfully", "Success");
          } else {
            this._toastrService.success("Something went wrong", "Info");
          }
          this.isLoading = false;
        },     // nextHandler
        error: (error) => {
          console.log(error);
          this.isLoading = false;
          this._toastrService.error(error?.error?.message, "Error");
        }
      });
  }
  removeHistory(index: number) {
    this.searchHistory.splice(index, 1);
    this.fiveDaysResponse = null;
    this._toastrService.success("History Updated Successfully", "Success");
  }
  clearHistory() {
    if (this.searchHistory?.length > 0) {
      this.searchHistory = [];
      this.fiveDaysResponse = null;
      this._toastrService.success("History Cleared Successfully", "Success");
    } else if (this.searchHistory?.length == 0) {
      this._toastrService.info("Nothing to clear", "Info");
    }
  }
  getConvertedFormatedDate(d:number){
    return new Date(d);
  }
}


