import {Injectable} from '@angular/core';
import {CoinHistoryItem} from '../../models/coin-history-item';
import {ICoinHistoryItemModel} from '../../models/i-coin-history-item-model';
import {HttpService} from '../http/http.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {filter, first, map} from 'rxjs/operators';
import {ICoinHistoryItem} from '../../models/i-coin-history-item';
import {ICoinHistoryModel} from '../../models/i-coin-history-model';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private _coinsHistory = new BehaviorSubject<ICoinHistoryItem[]>([]);

  constructor(private httpService: HttpService) {
  }

  get coinsHistory$(): BehaviorSubject<ICoinHistoryItem[]> {
    return this._coinsHistory;
  }

  get coinsHistory(): ICoinHistoryItem[] {
    return this._coinsHistory.getValue();
  }

  set coinsHistory(history: ICoinHistoryItem[]) {
    this._coinsHistory.next(history);
  }

  prepareCoinHistoryItems(coinModels: ICoinHistoryItemModel[]): CoinHistoryItem[] {
    return coinModels.map(coinModel => new CoinHistoryItem(coinModel.timestamp, coinModel.price));
  }

  getHistory(coinsIds: number[], currency: string): void {
    const history: ICoinHistoryItem[] = [];
    if (coinsIds.length) {
      const lastCoinId: number = coinsIds[coinsIds.length - 1];
      coinsIds.forEach((coinId) => {
        this.getCoinHistory(coinId, currency).subscribe(
          (results: ICoinHistoryItemModel[]) => {
            history.push({
              coinId,
              history: this.prepareCoinHistoryItems(results)
            });

            if (coinId === lastCoinId) {
              this.coinsHistory = history;
            }
          },
          err => console.log(err)
        );
      });
    } else {
      this.coinsHistory = history;
    }
  }

  getCoinHistory(coinId: number, currency: string): Observable<ICoinHistoryItemModel[]> {
    return this.httpService.apiRequest('get', `coin/${coinId}/history/30d?base=${currency}`).pipe(
      first(),
      filter((response: ICoinHistoryModel) => response.status === 'success'),
      map(response => response.data.history)
    );
  }
}
