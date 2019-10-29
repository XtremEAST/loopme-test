import {ICoin} from '../models/i-coin';

export const CURRENCIES: string[] = [
  'USD',
  'EUR'
];

export const COINS: ICoin[] = [
  {
    id: 1,
    name: 'Bitcoin',
    symbol: 'BTC'
  },
  {
    id: 2,
    name: 'Ethereum',
    symbol: 'ETH'
  },
  {
    id: 6,
    name: 'Stellar',
    symbol: 'XLM'
  }
];
