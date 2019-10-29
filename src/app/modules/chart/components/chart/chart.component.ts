import {AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild} from '@angular/core';
import {LineChart} from '../../../../shared/models/line-chart';
import {ICoinHistoryItem} from '../../../../shared/models/i-coin-history-item';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnChanges, AfterViewInit {
  private _chart: LineChart;

  @Input() coinsHistory: ICoinHistoryItem[];
  @Input() currency: string;

  @ViewChild('chartContainer', {static: false}) chartContainer: ElementRef;

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('coinsHistory')) {
      if (this._chart) {
        this._chart.updateChart(this.coinsHistory, this.currency);
      }
    }
  }

  ngAfterViewInit(): void {
    this._chart = new LineChart('#chart-container', this.coinsHistory, this.currency, this.chartContainer.nativeElement.offsetWidth, 300);
    this._chart.render();
  }
}
