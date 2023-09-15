import { Component, OnInit ,OnDestroy} from '@angular/core';
import { CommonService } from '../service/common.service';
import { CountryDto } from '../model/country-dto';
import { CountryWeatherDto } from '../model/country-weather';
import { CountryDaysWeatherDto } from '../model/country-days-weather-dto';
import { ToastrService } from 'ngx-toastr';
import { ValidationUtils } from '../shared/Validators';
import { LOCAL_STORAGE_KEYS, LocalStorageService } from '../service/local-storage.service';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
export class WeatherComponent implements OnInit,OnDestroy {

  ngOnInit(): void {
   let searchHistory: CountryWeatherDto[] = [];
   let fiveDaysResponse: CountryDaysWeatherDto;
   let activeIndex:number;
   searchHistory = this._localStorageService.getLocalStorage(LOCAL_STORAGE_KEYS.WEATHER_SEARCH_HISTORY) ? JSON.parse(this._localStorageService.getLocalStorage(LOCAL_STORAGE_KEYS.WEATHER_SEARCH_HISTORY)):[];
   fiveDaysResponse = this._localStorageService.getLocalStorage(LOCAL_STORAGE_KEYS.FORCAST_HISTORY) ? JSON.parse(this._localStorageService.getLocalStorage(LOCAL_STORAGE_KEYS.FORCAST_HISTORY)):null;
   activeIndex = this._localStorageService.getLocalStorage(LOCAL_STORAGE_KEYS.ACTIVE_INDEX) ? JSON.parse(this._localStorageService.getLocalStorage(LOCAL_STORAGE_KEYS.ACTIVE_INDEX)):null;
   this.searchHistory = searchHistory;
   this.fiveDaysResponse = fiveDaysResponse;
   this.activeIndex = activeIndex;  

  }

  constructor(public _commonService: CommonService, private _toastrService: ToastrService,
    private _localStorageService:LocalStorageService
    ) { }
  searchCountry: string;
  searchHistory: CountryWeatherDto[] = [];
  // wetherOfCountryData: CountryWeatherDto;
  fiveDaysResponse: CountryDaysWeatherDto;
  isLoading: boolean = false;
  searchCountryByName() {
    if(this.searchHistory?.length>0){
      let existed = this.searchHistory.findIndex(obj => obj.name.toLowerCase().trim() == this.searchCountry.toLowerCase().trim());
      if (existed != -1) {
        this._toastrService.show("entered city already exist", "Info");
        return;
      }

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
            this.searchHistory.unshift(wetherOfCountryData);
            if (this.searchHistory?.length >= 8) {
              this.searchHistory.splice(this.searchHistory.length - 1, 1);
            }
            this.activeIndex=null;
          this.fiveDaysResponse = null;
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
  ngOnDestroy(): void {
    this._localStorageService.setLocalStorage(LOCAL_STORAGE_KEYS.WEATHER_SEARCH_HISTORY,this.searchHistory);
    this._localStorageService.setLocalStorage(LOCAL_STORAGE_KEYS.FORCAST_HISTORY,this.fiveDaysResponse);
    this._localStorageService.setLocalStorage(LOCAL_STORAGE_KEYS.ACTIVE_INDEX,this.activeIndex);

  }
}


