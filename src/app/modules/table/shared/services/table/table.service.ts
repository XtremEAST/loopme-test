import {Injectable} from '@angular/core';
import {ExportToCsv} from 'export-to-csv';
import {CoinHistoryItem} from '../../../../../shared/models/coin-history-item';
import {COINS} from '../../../../../shared/constants/constants';

@Injectable({
  providedIn: 'root'
})
export class TableService {

  constructor() {
  }

  exportTableToCSV(data: CoinHistoryItem[], currency: string, coinId: number): void {
    const preparedData: any[] = data.map(item => {
      const date = new Date(item.timestamp);
      const day = this.getTwoDigitsNumStr(date.getDate());
      const month = this.getTwoDigitsNumStr(date.getMonth() + 1);
      const year = this.getTwoDigitsNumStr(date.getFullYear());
      const hours = this.getTwoDigitsNumStr(date.getHours());
      const minutes = this.getTwoDigitsNumStr(date.getMinutes());
      return {
        date: `${day}.${month}.${year} ${hours}:${minutes}`,
        price: item.price
      };
    });
    const coin = COINS.find(c => c.id === coinId);
    const options = {
      filename: `${coin.name}(${coin.symbol})-${currency}-report`,
      quoteStrings: '',
      showLabels: true,
      showTitle: true,
      title: coin.name,
      useKeysAsHeaders: false,
      headers: ['Date', `Price (${currency})`]
    };
    const csvExporter = new ExportToCsv(options);

    csvExporter.generateCsv(preparedData);
  }

  getTwoDigitsNumStr(num: number): string {
    return num < 10 ? '0' + num : '' + num;
  }
}
