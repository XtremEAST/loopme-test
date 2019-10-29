import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {COINS} from '../../../../shared/constants/constants';
import {ICoin} from '../../../../shared/models/i-coin';

@Component({
  selector: 'app-table-filter',
  templateUrl: './table-filter.component.html',
  styleUrls: ['./table-filter.component.scss']
})
export class TableFilterComponent implements OnChanges, OnInit, OnDestroy {
  tableFilterForm: FormGroup;
  allCoins = COINS;
  coins: ICoin[];

  @Input() coinsIds: number[];
  @Input() activeCoinId: number;

  @Output() idChanged = new EventEmitter<number>();

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('activeCoinId') && !changes.activeCoinId.firstChange) {
      this.tableFilterForm.patchValue({coinId: this.activeCoinId}, {emitEvent: false});
    }

    if (changes.hasOwnProperty('coinsIds') && !changes.coinsIds.firstChange) {
      this.prepareCoins();
    }
  }

  ngOnInit() {
    this.initForm();
  }

  // this is needed to automatically unsubscribe via untilDestroyed hook
  ngOnDestroy(): void {
  }

  initForm(): void {
    this.prepareCoins();
    this.tableFilterForm = new FormGroup({
      coinId: new FormControl(this.activeCoinId)
    });

    this.tableFilterForm.controls.coinId.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe(
      (value: string) => this.idChanged.emit(+value)
    );
  }

  prepareCoins(): void {
    this.coins = this.allCoins.filter(coin => this.coinsIds.includes(coin.id));
  }
}
