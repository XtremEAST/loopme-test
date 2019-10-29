import {Component, OnDestroy, OnInit} from '@angular/core';
import {FilterService} from '../../shared/services/filter/filter.service';
import {AbstractControl, FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {untilDestroyed} from 'ngx-take-until-destroy';
import {ICoin} from '../../shared/models/i-coin';
import {COINS, CURRENCIES} from '../../shared/constants/constants';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit, OnDestroy {
  filterForm: FormGroup;
  currencies = CURRENCIES;
  coins = COINS;

  constructor(private _filterService: FilterService) {
  }

  ngOnInit() {
    this.initForm();
  }

  // is needed to automatically unsubscribe via untilDestroyed hook
  ngOnDestroy(): void {
  }

  private initForm(): void {
    const coinsCheckboxes: FormControl[] = [];
    this.coins.forEach(coin => {
      coinsCheckboxes.push(new FormControl(this._filterService.activeCoinsIds.includes(coin.id)));
    });
    this.filterForm = new FormGroup({
      currency: new FormControl(this._filterService.activeCurrency, [Validators.required]),
      coins: new FormArray(coinsCheckboxes)
    });

    this.filterForm.controls.coins.valueChanges.subscribe(
      (coinsValues: boolean[]) => {
        const checkedIds: number[] = [];
        coinsValues.forEach((value, i) => {
          if (value) {
            checkedIds.push(this.coins[i].id);
          }
        });
        this._filterService.activeCoinsIds = checkedIds;
      }
    );

    this.filterForm.controls.currency.valueChanges.subscribe(
      value => this._filterService.activeCurrency = value
    );
  }

  get coinsControls(): FormControl[] {
    return (this.filterForm.get('coins') as FormArray).controls as FormControl[];
  }

}
