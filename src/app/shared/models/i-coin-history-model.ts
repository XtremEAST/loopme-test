import {ICoinHistoryItemModel} from './i-coin-history-item-model';

export interface ICoinHistoryModel {
  status: string;
  data: {
    change: number;
    history: ICoinHistoryItemModel[]
  };
}
