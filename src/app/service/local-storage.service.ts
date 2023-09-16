
;import { Injectable } from '@angular/core';
import { ValidationUtils } from '../shared/Validators';
export enum LOCAL_STORAGE_KEYS{
  COUNTER="counterRecords",
  WEATHER_SEARCH_HISTORY="searchHistory",
  FORCAST_HISTORY="forcastHistory",
  ACTIVE_INDEX="activeIndex"
}
@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }
  setLocalStorage(localstorageKey:LOCAL_STORAGE_KEYS,requestPayload){
    if(requestPayload && !ValidationUtils.isStringNull(localstorageKey)){      
      localStorage.setItem(localstorageKey,JSON.stringify(requestPayload))
    }
  }
  getLocalStorage(localstorageKey:LOCAL_STORAGE_KEYS){
    if(!ValidationUtils.isStringNull(localstorageKey)){
      return localStorage.getItem(localstorageKey);
    }
    return null;
  }
}
