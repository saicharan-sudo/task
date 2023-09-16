import { Component, OnInit, OnDestroy } from '@angular/core';
import { CounterDto } from 'src/app/model/counter-dto';
import { CommonService } from '../service/common.service';
import { ValidationUtils } from '../shared/Validators';
import { LOCAL_STORAGE_KEYS, LocalStorageService } from '../service/local-storage.service';

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss']
})

export class CounterComponent implements OnInit, OnDestroy {
  counterList: CounterDto[] = [];
  constructor(private _commonService: CommonService, private _localStorageService: LocalStorageService) { }
  ngOnInit(): void {
    let counterList: CounterDto[] = [];
    counterList = JSON.parse(this._localStorageService.getLocalStorage(LOCAL_STORAGE_KEYS.COUNTER));
    if (ValidationUtils.isListExists(counterList)) {
      this.counterList = counterList;
      setTimeout(() => {
        this.sendData();
      }, 100);
    }
  }
  add() {
    let counter: CounterDto = new CounterDto();
    this.counterList.push(counter);
    this.sendData();
  }
  incrementCounter(index: number) {
    if (this.counterList[index].count >= 0) {
      this.counterList[index].count++;
    } else {
      this.counterList[index].count = 0;
    }
  }
  decrementCounter(index: number) {
    if (this.counterList[index].count > 0) {
      this.counterList[index].count--;
    } else {
      this.counterList[index].count = 0;
    }
  }
  deleteCounter(index: number) {
    this.counterList.splice(index, 1);
    this.sendData();
  }
  resetButton() {
    this.counterList = [];
    this.sendData();
  }
  sendData() {
    this._commonService.setDataToSend({
      countLength: this.counterList.length
    });
  }
  ngOnDestroy(): void {
    this._localStorageService.setLocalStorage(LOCAL_STORAGE_KEYS.COUNTER, this.counterList)
  }
}
