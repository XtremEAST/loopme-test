import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {ICoinHistoryItemModel} from '../../models/i-coin-history-item-model';
import {ICoin} from '../../models/i-coin';
import {COINS, CURRENCIES} from '../../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  private _activeCoinsIds = new BehaviorSubject<number[]>([COINS[0].id]);
  private _activeCurrency = new BehaviorSubject<string>(CURRENCIES[0]);

  constructor() {
  }

  get activeCoinsIds$(): BehaviorSubject<number[]> {
    return this._activeCoinsIds;
  }

  get activeCoinsIds(): number[] {
    return this._activeCoinsIds.getValue();
  }

  set activeCoinsIds(ids: number[]) {
    this._activeCoinsIds.next(ids);
  }

  get activeCurrency$(): BehaviorSubject<string> {
    return this._activeCurrency;
  }

  get activeCurrency(): string {
    return this._activeCurrency.getValue();
  }

  set activeCurrency(currency: string) {
    this._activeCurrency.next(currency);
  }
}
