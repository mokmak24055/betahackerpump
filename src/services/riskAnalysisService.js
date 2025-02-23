
import { calculateVolatilityBands, findNearestSupportResistance } from '../utils/technicalAnalysis';

export const calculateStopLoss = (signal, currentPrice, historicalData, timeframe) => {
  const prices = historicalData.map(d => d.price);
  const { volatility } = calculateVolatilityBands(prices);
  const { nearestSupport, nearestResistance, atr, vwap } = findNearestSupportResistance(currentPrice, historicalData);
  
  const range = Math.abs(nearestResistance - nearestSupport);
  const atrMultiplier = timeframe === '24H' ? 2.5 : 2;
  
  let stopLoss;
  let riskReward;
  let priceTargets;

  switch (signal) {
    case 'STRONG_BUY': {
      const supportBuffer = Math.max(atr * 1.5, range * 0.1);
      stopLoss = Math.min(
        nearestSupport - supportBuffer,
        currentPrice - (atr * atrMultiplier)
      );

      priceTargets = {
        target1: currentPrice + (atr * 2),
        target2: nearestResistance + (range * 0.5),
        target3: nearestResistance + range
      };

      riskReward = {
        ratio: '1:3',
        potential: {
          reward: priceTargets.target2 - currentPrice,
          risk: currentPrice - stopLoss
        }
      };
      break;
    }
    case 'STRONG_SELL': {
      const resistanceBuffer = Math.max(atr * 1.5, range * 0.1);
      stopLoss = Math.max(
        nearestResistance + resistanceBuffer,
        currentPrice + (atr * atrMultiplier)
      );

      priceTargets = {
        target1: currentPrice - (atr * 2),
        target2: nearestSupport - (range * 0.5),
        target3: nearestSupport - range
      };

      riskReward = {
        ratio: '1:3',
        potential: {
          reward: currentPrice - priceTargets.target2,
          risk: stopLoss - currentPrice
        }
      };
      break;
    }
    default: {
      const volatilityStop = currentPrice * (1 - volatility * 2);
      stopLoss = Math.max(
        volatilityStop,
        nearestSupport - (atr * 1.5)
      );
      
      priceTargets = {
        target1: currentPrice + (atr * 1.5),
        target2: vwap + (range * 0.3),
        target3: nearestResistance
      };

      riskReward = {
        ratio: '1:2',
        potential: {
          reward: range * 0.8,
          risk: currentPrice - stopLoss
        }
      };
    }
  }

  return {
    stopLoss: Math.round(stopLoss * 100) / 100,
    priceTargets: {
      target1: Math.round(priceTargets.target1 * 100) / 100,
      target2: Math.round(priceTargets.target2 * 100) / 100,
      target3: Math.round(priceTargets.target3 * 100) / 100
    },
    riskReward,
    technicalLevels: {
      support: nearestSupport,
      resistance: nearestResistance,
      vwap: vwap,
      atr: atr
    }
  };
};
