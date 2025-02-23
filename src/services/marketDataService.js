
import { format } from 'date-fns';

export const fetchRealTimePrice = async (symbol) => {
  try {
    const response = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}USDT`);
    const data = await response.json();
    return parseFloat(data.price);
  } catch (error) {
    console.error(`Error fetching ${symbol} price:`, error);
    return null;
  }
};

export const formatCandleData = (candle, timeframe) => ({
  timestamp: format(new Date(candle[0]), timeframe === '24H' ? 'yyyy-MM-dd HH:mm' : 'MM/dd HH:mm'),
  price: parseFloat(candle[4]),
  open: parseFloat(candle[1]),
  high: parseFloat(candle[2]),
  low: parseFloat(candle[3]),
  volume: parseFloat(candle[5]),
  raw_timestamp: candle[0],
});

export const fetchHistoricalData = async (symbol, startTime = null, endTime = null, timeframe = '24H') => {
  try {
    const baseUrl = `https://api.binance.com/api/v3/klines?symbol=${symbol}USDT`;
    
    let interval, limit;
    switch (timeframe) {
      case '1H':
        interval = '1m';
        limit = 60;
        break;
      case '24H':
        interval = '1h';
        limit = 24;
        break;
      case '7D':
        interval = '4h';
        limit = 42;
        break;
      case '30D':
        interval = '1d';
        limit = 30;
        break;
      default:
        interval = '1h';
        limit = 24;
    }
    
    if (!startTime && !endTime) {
      const url = `${baseUrl}&interval=${interval}&limit=${limit}`;
      const response = await fetch(url);
      const data = await response.json();
      return data.map(candle => formatCandleData(candle, timeframe));
    }

    const url = `${baseUrl}&interval=${interval}&startTime=${startTime}&endTime=${endTime}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.map(candle => formatCandleData(candle, timeframe));
  } catch (error) {
    console.error(`Error fetching ${symbol} historical data:`, error);
    return [];
  }
};
