import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
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

  // ********API Url's*********
  apiUrls = {
    sendOtp: '/api/v1/user/send-otp',
    validateOtp: '/api/v1/user/validate-otp',
    getBasicDetails: "/api/v1/user/get-basic-details",
    logOut: "/api/v1/user/log-out"
  };
  private $data = new Subject<CommunicationData>();

  public dataReceivedEvent = this.$data.asObservable();
  public setDataToSend(data: CommunicationData): void {
    this.$data.next(data);
    console.log(this.$data);
  }
}
