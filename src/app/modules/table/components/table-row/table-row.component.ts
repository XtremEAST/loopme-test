import {Component, Input} from '@angular/core';
import {CoinHistoryItem} from '../../../../shared/models/coin-history-item';

@Component({
  selector: '[app-table-row]',
  templateUrl: './table-row.component.html',
  styleUrls: ['./table-row.component.scss']
})
export class TableRowComponent {
  @Input() item: CoinHistoryItem;

  constructor() { }
}
