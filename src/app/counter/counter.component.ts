import { Component, OnInit } from '@angular/core';
import { CounterDto } from 'src/model/counter-dto';
import { CommonService } from '../service/common.service';

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss']
})


export class CounterComponent implements OnInit {
  counterList: CounterDto[] = [];
  constructor(private _commonService: CommonService) { }
  ngOnInit(): void {

  }
  add() {
    let counter: CounterDto = new CounterDto();
    this.counterList.push(counter);
    this.sendData();
  }
  incrementCounter(index: number) {
    this.counterList[index].count++;
  }
  decrementCounter(index: number) {
    this.counterList[index].count--;
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
      // data: window.location.pathname,
      countLength: this.counterList.length
    });
  }
}
