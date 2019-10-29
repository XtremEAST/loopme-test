import {Component, OnDestroy, OnInit} from '@angular/core';
import {AppService} from '../../shared/services/app/app.service';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {FilterService} from '../../shared/services/filter/filter.service';
import {ICoinHistoryItem} from '../../shared/models/i-coin-history-item';
import {merge} from 'rxjs';
import {skip} from 'rxjs/operators';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit, OnDestroy {
  coinsHistory: ICoinHistoryItem[];
  tabs: string[];
  activeTab: string;

  constructor(private _appService: AppService,
              private _filterService: FilterService) {
    this.tabs = [
      'chart',
      'table'
    ];
    this.activeTab = this.tabs[0];
  }

  ngOnInit() {
    this._appService.coinsHistory$.pipe(
      untilDestroyed(this)
    ).subscribe(
      (coinsHistory: ICoinHistoryItem[]) => this.coinsHistory = coinsHistory
    );

    merge(
      this._filterService.activeCoinsIds$,
      this._filterService.activeCurrency$
    ).pipe(
      untilDestroyed(this),
      skip(2)
    ).subscribe(
      () => this.getHistory()
    );

    this.getHistory();
  }

  // this is needed to automatically unsubscribe via untilDestroyed hook
  ngOnDestroy(): void {
  }

  selectTab(tab: string): void {
    this.activeTab = tab;
  }

  getHistory(): void {
    this._appService.getHistory(this._filterService.activeCoinsIds, this._filterService.activeCurrency);
  }

  get activeCurrency(): string {
    return this._filterService.activeCurrency;
  }
}
