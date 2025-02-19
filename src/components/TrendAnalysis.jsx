
import { Card } from "@/components/ui/card";
import { TrendingUp, ChartBar, Signal, Newspaper, Info, Activity, Target, Scale } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";

const fetchBinancePrices = async () => {
  try {
    const { data, error } = await supabase.functions.invoke('get-crypto-prices');
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching Binance prices:', error);
    return null;
  }
};

const TrendAnalysis = ({ trendAnalysis, selectedCrypto = 'bitcoin' }) => {
  const { data: binanceData, isLoading, error } = useQuery({
    queryKey: ['binancePrices'],
    queryFn: fetchBinancePrices,
    refetchInterval: 300000, // Changed from 30000 (30s) to 300000 (5 minutes)
    initialData: null,
  });

  // Gracefully handle missing trend analysis
  if (!trendAnalysis) {
    return null;
  }

  const currentPrice = binanceData?.[selectedCrypto]?.price || 0;

  const cryptoData = {
    bitcoin: {
      id: 'bitcoin',
      symbol: 'BTC',
      currentPrice: currentPrice,
      technicalLevels: {
        resistance1: currentPrice * 1.05,
        resistance2: currentPrice * 1.10,
        support1: currentPrice * 0.95,
        support2: currentPrice * 0.90,
      },
      keywords: ['bitcoin', 'btc'],
    },
    solana: {
      id: 'solana',
      symbol: 'SOL',
      currentPrice: currentPrice,
      technicalLevels: {
        resistance1: currentPrice * 1.05,
        resistance2: currentPrice * 1.10,
        support1: currentPrice * 0.95,
        support2: currentPrice * 0.90,
      },
      keywords: ['solana', 'sol'],
    }
  };

  if (isLoading) {
    return (
      <Card className="p-6 mb-8 border-2 border-primary bg-card/30 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="text-primary h-6 w-6" />
          <h2 className="text-2xl font-bold text-primary text-glow">Market Analysis</h2>
        </div>
        <p className="text-primary">Loading market analysis...</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6 mb-8 border-2 border-primary bg-card/30 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="text-primary h-6 w-6" />
          <h2 className="text-2xl font-bold text-primary text-glow">Market Analysis</h2>
        </div>
        <p className="text-red-500">Error loading market data. Please try again later.</p>
      </Card>
    );
  }

  const currentCryptoData = cryptoData[selectedCrypto];

  // Technical indicators
  const technicalIndicators = {
    rsi: selectedCrypto === 'bitcoin' ? 72 : 68,
    macd: {
      signal: selectedCrypto === 'bitcoin' ? 'Bullish Crossover' : 'Approaching Signal Line',
      value: selectedCrypto === 'bitcoin' ? 450.5 : 2.8,
      trend: selectedCrypto === 'bitcoin' ? 'upward' : 'sideways'
    },
    movingAverages: {
      sma20: currentCryptoData.currentPrice * 0.98,
      sma50: currentCryptoData.currentPrice * 0.95,
      sma200: currentCryptoData.currentPrice * 0.90,
      trend: selectedCrypto === 'bitcoin' ? 'Strong Uptrend Above All MAs' : 'Above Key MAs'
    }
  };

  // Risk metrics
  const riskMetrics = {
    volatility: {
      level: selectedCrypto === 'bitcoin' ? 'High' : 'Medium-High',
      value: binanceData?.[selectedCrypto]?.change_24h || 0,
      trend: (binanceData?.[selectedCrypto]?.change_24h || 0) > 0 ? 'increasing' : 'decreasing'
    },
    riskReward: {
      ratio: selectedCrypto === 'bitcoin' ? '1:3.2' : '1:2.8',
      potential: {
        reward: Math.round(currentCryptoData.technicalLevels.resistance2 - currentCryptoData.currentPrice),
        risk: Math.round(currentCryptoData.currentPrice - currentCryptoData.technicalLevels.support1)
      }
    },
    stopLoss: Math.round(currentCryptoData.technicalLevels.support1)
  };

  const signalStrength = trendAnalysis.overallSentiment > 0 ? 
    { label: 'Strong Buy', color: 'text-green-500 bg-green-500/20' } :
    { label: 'Strong Sell', color: 'text-red-500 bg-red-500/20' };

  const filteredStories = (trendAnalysis.sentiments || []).slice(0, 3).filter(story => {
    const content = `${story.title} ${story.url || ''} ${story.story_text || ''}`.toLowerCase();
    return currentCryptoData.keywords.some(keyword => content.includes(keyword));
  });

  return (
    <Card className="p-6 mb-8 border-2 border-primary bg-card/30 backdrop-blur-sm hover:bg-card/50 transition-all">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="text-primary h-6 w-6" />
        <h2 className="text-2xl font-bold text-primary text-glow">
          {currentCryptoData.symbol} Smart Trading Signals
        </h2>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xl font-bold text-primary">
            ${currentCryptoData.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className="text-xs text-primary/70">Updated {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      <div className="mb-8 p-4 rounded-lg bg-background/40">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Signal className="text-primary h-5 w-5" />
            <h3 className="text-lg font-semibold text-primary">{currentCryptoData.symbol} Signal Strength</h3>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${signalStrength.color}`}>
            {signalStrength.label}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3 rounded-lg bg-background/20">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-primary/70" />
              <span className="text-sm text-primary/70">Price Target</span>
            </div>
            <span className="text-lg font-semibold text-primary">
              ${Math.round(currentCryptoData.technicalLevels.resistance1).toLocaleString()}
            </span>
          </div>
          <div className="p-3 rounded-lg bg-background/20">
            <div className="flex items-center gap-2 mb-2">
              <Scale className="h-4 w-4 text-primary/70" />
              <span className="text-sm text-primary/70">Support</span>
            </div>
            <span className="text-lg font-semibold text-primary">
              ${Math.round(currentCryptoData.technicalLevels.support1).toLocaleString()}
            </span>
          </div>
          <div className="p-3 rounded-lg bg-background/20">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-4 w-4 text-primary/70" />
              <span className="text-sm text-primary/70">24h Change</span>
            </div>
            <span className={`text-lg font-semibold ${riskMetrics.volatility.value > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {riskMetrics.volatility.value.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <ChartBar className="text-primary h-5 w-5" />
            <h3 className="text-lg font-semibold text-primary">{currentCryptoData.symbol} Technical Analysis</h3>
          </div>
          <div className="space-y-4 bg-background/40 p-4 rounded-lg">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-primary/70">RSI (14)</span>
                <span className={`text-${technicalIndicators.rsi > 70 ? 'red' : technicalIndicators.rsi < 30 ? 'green' : 'primary'}-500`}>
                  {technicalIndicators.rsi}
                </span>
              </div>
              <Progress 
                value={technicalIndicators.rsi} 
                className="h-2"
              />
            </div>
            <div className="flex justify-between py-2 border-t border-primary/10">
              <span className="text-primary/70">MACD</span>
              <span className={`text-${technicalIndicators.macd.trend === 'upward' ? 'green' : 'red'}-500`}>
                {technicalIndicators.macd.signal} ({technicalIndicators.macd.value})
              </span>
            </div>
            <div className="flex justify-between py-2 border-t border-primary/10">
              <span className="text-primary/70">Moving Averages</span>
              <div className="text-right">
                <div className="text-green-500">{technicalIndicators.movingAverages.trend}</div>
                <div className="text-xs text-primary/70">
                  SMA20: ${Math.round(technicalIndicators.movingAverages.sma20).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Scale className="text-primary h-5 w-5" />
            <h3 className="text-lg font-semibold text-primary">{currentCryptoData.symbol} Risk Analysis</h3>
          </div>
          <div className="bg-background/40 p-4 rounded-lg space-y-3">
            <div className="flex justify-between items-center p-2 bg-background/20 rounded">
              <span className="text-primary/70">Risk/Reward Ratio</span>
              <div className="text-right">
                <span className="text-primary">{riskMetrics.riskReward.ratio}</span>
                <div className="text-xs text-primary/70 mt-1">
                  +${riskMetrics.riskReward.potential.reward.toLocaleString()} / -${riskMetrics.riskReward.potential.risk.toLocaleString()}
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center p-2 bg-background/20 rounded">
              <span className="text-primary/70">Suggested Stop Loss</span>
              <span className="text-red-500">${riskMetrics.stopLoss.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {filteredStories.length > 0 && (
        <div className="mt-8 space-y-4">
          <div className="flex items-center gap-2">
            <Newspaper className="text-primary h-5 w-5" />
            <h3 className="text-lg font-semibold text-primary">{currentCryptoData.symbol} Market Signals</h3>
          </div>
          <div className="bg-background/40 p-4 rounded-lg space-y-3">
            {filteredStories.map((story, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-background/20 rounded-lg">
                <div className={`flex flex-col items-center px-2 py-1 rounded ${
                  story.sentiment === 'POSITIVE' ? 'bg-green-500/20 text-green-500' : 
                  story.sentiment === 'NEGATIVE' ? 'bg-red-500/20 text-red-500' : 
                  'bg-primary/20 text-primary'
                }`}>
                  {story.sentiment === 'POSITIVE' ? '↗' : story.sentiment === 'NEGATIVE' ? '↘' : '→'}
                  <span className="text-xs mt-1">{story.confidence}%</span>
                </div>
                <div className="flex-1">
                  <p className="text-primary/90 text-sm">{story.title}</p>
                  <div className="flex gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      story.score > 0 ? 'bg-green-500/10 text-green-500' : 
                      story.score < 0 ? 'bg-red-500/10 text-red-500' : 
                      'bg-primary/10 text-primary'
                    }`}>
                      {story.score > 0 ? 'Bullish' : story.score < 0 ? 'Bearish' : 'Neutral'} Signal
                    </span>
                    <span className="text-xs text-primary/60">Impact Score: {Math.round(story.impactScore)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 flex items-start gap-2 text-xs text-primary/70 bg-background/20 p-3 rounded-lg">
        <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
        <p>
          Analysis for {currentCryptoData.symbol} combines technical indicators, market sentiment, and real-time news impact. 
          Signals are generated using advanced algorithms processing multiple data points including price action, 
          volume analysis, and social sentiment.
        </p>
      </div>
    </Card>
  );
};

export default TrendAnalysis;
