import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {ICoinHistoryItem} from '../../../../shared/models/i-coin-history-item';
import {CoinHistoryItem} from '../../../../shared/models/coin-history-item';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnChanges {
  coinsIds: number[];
  activeCoinId: number;
  activeItem: ICoinHistoryItem;
  activeItemHistory: CoinHistoryItem[];
  sortKey: string | null = null;
  directSort = true;

  @Input() coinsHistory: ICoinHistoryItem[];
  @Input() currency: string;

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('coinsHistory')) {
      this.coinsIds = this.prepareCoinsIds(this.coinsHistory);
      this.setActiveCoin(this.coinsIds[0]);

      if (this.sortKey) {
        this.sortResults();
      }
    }
  }

  onIdChange(id: number): void {
    this.setActiveCoin(id);
    this.sortKey = null;
    this.directSort = true;
  }

  setActiveCoin(id: number): void {
    this.activeCoinId = id;
    this.activeItem = this.coinsHistory.find(item => item.coinId === id);
    this.activeItemHistory = JSON.parse(JSON.stringify(this.activeItem.history));
  }

  prepareCoinsIds(items: ICoinHistoryItem[]): number[] {
    return items.map(item => item.coinId);
  }

  sortResultsBy(key: string): void {
    this.directSort = key === this.sortKey ? !this.directSort : true;
    this.sortKey = key;
    this.sortResults();
  }

  sortResults(): void {
    const activeItemHistory = this.activeItemHistory;

    activeItemHistory.sort((a, b): number => {
      if (!this.directSort) {
        [a, b] = [b, a];
      }

      let aValue = a[this.sortKey];
      let bValue = b[this.sortKey];

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
      }
      if (typeof bValue === 'string') {
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) {
        return -1;
      }
      if (aValue > bValue) {
        return 1;
      }
      return 0;
    });

    this.activeItemHistory = activeItemHistory;
  }
}
