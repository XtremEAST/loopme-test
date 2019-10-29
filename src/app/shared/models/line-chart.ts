import * as d3 from 'd3';
import {CoinHistoryItem} from './coin-history-item';
import {ICoinHistoryItem} from './i-coin-history-item';
import {COINS} from '../constants/constants';
import {ICoin} from './i-coin';

export class LineChart {
  private _svg;
  private _x;
  private _y;
  private _color;
  private _lines;

  private _idSelector: string;
  private _data: ICoinHistoryItem[];
  private _dataIds: number[];
  private _coins: ICoin[];
  private _currency: string;
  private _width: number;
  private _height: number;
  private _outerWidth: number;
  private _outerHeight: number;
  private _margin = {top: 10, right: 40, bottom: 35, left: 40};

  constructor(idSelector: string, data: ICoinHistoryItem[], currency: string, width = 500, height = 500) {
    this._idSelector = idSelector;
    this._outerWidth = width;
    this._outerHeight = height;
    this._width = this._outerWidth - this._margin.left - this._margin.right;
    this._height = this._outerHeight - this._margin.top - this._margin.bottom;

    this.initData(data, currency);
  }

  initData(data: ICoinHistoryItem[], currency: string): void {
    this._data = data;
    this._currency = currency;
    this._dataIds = this._data.map(item => item.coinId);
    this._dataIds = this._data.map(item => item.coinId);
    this._coins = COINS.filter(coin => this._dataIds.includes(coin.id));
  }

  private createChart(idSelector: string): void {
    this._svg = d3.select(idSelector)
      .append('svg')
      .attr('width', this._outerWidth)
      .attr('height', this._outerHeight)
      .append('g')
      .attr('transform', 'translate(' + this._margin.left + ',' + this._margin.top + ')');
  }

  private createScales(): void {
    this._color = d3.scaleOrdinal()
      .domain(d3.extent(this._dataIds))
      .range(d3.schemeCategory10);

    this._x = d3.scaleUtc()
      .domain(d3.extent(this.mergeHistory(), d => d.timestamp))
      .range([0, this._width]);

    this._y = d3.scaleLinear()
      .domain(d3.extent(this.mergeHistory(), d => d.price))
      .nice()
      .range([this._height, 0]);
  }

  private addScalesToChart(): void {
    this._svg
      .append('g')
      .attr('transform', 'translate(0,' + this._height + ')')
      .call(d3.axisBottom(this._x).ticks(5, '%b %d, %y'));

    this._svg
      .append('g')
      .call(d3.axisLeft(this._y))
      .call(g => g.select('.tick:last-of-type text').clone()
        .attr('x', 3)
        .attr('text-anchor', 'start')
        .attr('font-weight', 'bold')
        .text(`Price, ${this._currency}`));
  }

  private addLinesToChart(): void {
    const line = d3.line()
      .defined(d => !isNaN(d.price))
      .x(d => this._x(d.timestamp))
      .y(d => this._y(d.price));

    this._lines = this._svg
      .append('g')
      .selectAll('path')
      .data(this._data)
      .enter()
      .append('path')
      .attr('class', 'line')
      .style('mix-blend-mode', 'multiply')
      .attr('fill', 'none')
      .attr('d', d => line(d.history))
      .attr('stroke', d => this._color(d.coinId))
      .attr('stroke-width', 1)
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round');
  }

  addLegendsToChart(): void {
    this._svg.selectAll('legendDots')
      .data(this._dataIds)
      .enter()
      .append('circle')
      .attr('cx', (d, i) => i * 110)
      .attr('cy', this._height + 27)
      .attr('r', 6)
      .style('fill', (d) => {
        return this._color(d);
      });

    this._svg.selectAll('legendLabels')
      .data(this._coins.map(coin => `${coin.name} (${coin.symbol})`))
      .enter()
      .append('text')
      .attr('x', (d, i) => i * 110 + 8)
      .attr('y', this._height + 27)
      .text((d) => {
        return d;
      })
      .attr('text-anchor', 'left')
      .attr('font-size', '12px')
      .style('alignment-baseline', 'middle');
  }

  private mergeHistory(): CoinHistoryItem[] {
    const dataHistory = this._data.map(item => item.history);
    return d3.merge(dataHistory);
  }

  render(): void {
    this.createChart(this._idSelector);
    this.createScales();
    this.addScalesToChart();
    this.addLinesToChart();
    this.addLegendsToChart();
  }

  updateChart(data: ICoinHistoryItem[], currency: string): void {
    this._svg.html('');

    this.initData(data, currency);
    this.createScales();
    this.addScalesToChart();
    this.addLinesToChart();
    this.addLegendsToChart();
  }
}
