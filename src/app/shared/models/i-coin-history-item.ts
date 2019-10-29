import {CoinHistoryItem} from './coin-history-item';

export interface ICoinHistoryItem {
  coinId: number;
  history: CoinHistoryItem[];
}
