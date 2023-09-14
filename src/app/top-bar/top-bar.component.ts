import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonService } from '../service/common.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent implements OnInit, OnDestroy {
  constructor(private _commonService: CommonService) { }
  counterLength: number;
  ngOnInit(): void {

    if (this._commonService.dataReceivedEvent) {

      this.getData();
    }
  }
  unsubscribe$: Subject<boolean> = new Subject();

  getData() {
    this._commonService.dataReceivedEvent
      .pipe(takeUntil(this.unsubscribe$))

      .subscribe((result) => {
        this.counterLength = result.countLength
      });
  }
  ngOnDestroy() {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }
}
