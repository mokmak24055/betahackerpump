
export const calculateVolatilityBands = (historicalPrices = []) => {
  if (historicalPrices.length < 2) {
    return {
      volatility: 0.02,
      upperBand: null,
      lowerBand: null
    };
  }

  const returns = [];
  for (let i = 1; i < historicalPrices.length; i++) {
    returns.push(
      (historicalPrices[i] - historicalPrices[i - 1]) / historicalPrices[i - 1]
    );
  }

  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / returns.length;
  const volatility = Math.sqrt(variance);

  const currentPrice = historicalPrices[historicalPrices.length - 1];
  return {
    volatility,
    upperBand: currentPrice * (1 + volatility),
    lowerBand: currentPrice * (1 - volatility)
  };
};

export const calculateATR = (historicalData, period = 14) => {
  if (historicalData.length < period) return 0;

  const trueRanges = historicalData.map((candle, i) => {
    if (i === 0) return candle.high - candle.low;
    
    const previousClose = historicalData[i - 1].price;
    return Math.max(
      candle.high - candle.low,
      Math.abs(candle.high - previousClose),
      Math.abs(candle.low - previousClose)
    );
  });

  return trueRanges
    .slice(-period)
    .reduce((sum, tr) => sum + tr, 0) / period;
};

export const findNearestSupportResistance = (price, historicalData) => {
  if (!historicalData || historicalData.length === 0) return { 
    nearestSupport: price * 0.98, 
    nearestResistance: price * 1.02 
  };

  const prices = historicalData.map(d => d.price);
  const highs = historicalData.map(d => d.high);
  const lows = historicalData.map(d => d.low);
  const volumes = historicalData.map(d => d.volume);
  
  const vwap = prices.reduce((acc, price, i) => acc + price * volumes[i], 0) / 
               volumes.reduce((a, b) => a + b, 0);
  
  const swingLows = [];
  const swingHighs = [];
  const lookback = 5;

  for (let i = lookback; i < lows.length - lookback; i++) {
    const currentLow = lows[i];
    const currentHigh = highs[i];
    const leftLows = lows.slice(i - lookback, i);
    const rightLows = lows.slice(i + 1, i + lookback + 1);
    const leftHighs = highs.slice(i - lookback, i);
    const rightHighs = highs.slice(i + 1, i + lookback + 1);

    if (currentLow < Math.min(...leftLows, ...rightLows)) {
      swingLows.push({ price: currentLow, index: i });
    }
    if (currentHigh > Math.max(...leftHighs, ...rightHighs)) {
      swingHighs.push({ price: currentHigh, index: i });
    }
  }

  const recentSwingLows = swingLows
    .slice(-3)
    .map(swing => swing.price)
    .sort((a, b) => b - a);
  
  const recentSwingHighs = swingHighs
    .slice(-3)
    .map(swing => swing.price)
    .sort((a, b) => a - b);

  const atr = calculateATR(historicalData, 14);

  const potentialSupports = [
    ...recentSwingLows,
    vwap * 0.985,
    price * 0.95
  ].filter(level => level < price);

  const potentialResistances = [
    ...recentSwingHighs,
    vwap * 1.015,
    price * 1.05
  ].filter(level => level > price);

  const nearestSupport = potentialSupports.length ? 
    Math.max(...potentialSupports) : price * 0.95;
  
  const nearestResistance = potentialResistances.length ? 
    Math.min(...potentialResistances) : price * 1.05;

  return { 
    nearestSupport, 
    nearestResistance,
    atr,
    vwap 
  };
};
