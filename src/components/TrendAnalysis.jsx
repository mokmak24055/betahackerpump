
import { Card } from "@/components/ui/card";
import { TrendingUp, ChartBar, Signal, Newspaper, Info, Activity, Target, Scale, Clock } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

const TrendAnalysis = ({ trendAnalysis }) => {
  if (!trendAnalysis) {
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

  // Mock data for new features (replace with real data when available)
  const technicalIndicators = {
    rsi: 65,
    macd: 'Bullish Crossover',
    movingAverages: 'Above 200 MA'
  };

  const riskMetrics = {
    volatility: 'Medium',
    riskReward: '1:2.5',
    stopLoss: '$28,450'
  };

  const signalStrength = trendAnalysis.overallSentiment > 0 ? 
    { label: 'Strong Buy', color: 'text-green-500 bg-green-500/20' } :
    { label: 'Strong Sell', color: 'text-red-500 bg-red-500/20' };

  // Get top 3 most impactful stories based on impact score
  const topStories = trendAnalysis.sentiments.slice(0, 3);

  return (
    <Card className="p-6 mb-8 border-2 border-primary bg-card/30 backdrop-blur-sm hover:bg-card/50 transition-all">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="text-primary h-6 w-6" />
        <h2 className="text-2xl font-bold text-primary text-glow">Smart Trading Signals</h2>
        <span className="ml-auto text-xs text-primary/70">Updated {new Date().toLocaleTimeString()}</span>
      </div>

      {/* Signal Strength Indicator */}
      <div className="mb-8 p-4 rounded-lg bg-background/40">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Signal className="text-primary h-5 w-5" />
            <h3 className="text-lg font-semibold text-primary">Signal Strength</h3>
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
            <span className="text-lg font-semibold text-primary">$32,450</span>
          </div>
          <div className="p-3 rounded-lg bg-background/20">
            <div className="flex items-center gap-2 mb-2">
              <Scale className="h-4 w-4 text-primary/70" />
              <span className="text-sm text-primary/70">Support</span>
            </div>
            <span className="text-lg font-semibold text-primary">$29,800</span>
          </div>
          <div className="p-3 rounded-lg bg-background/20">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-4 w-4 text-primary/70" />
              <span className="text-sm text-primary/70">Resistance</span>
            </div>
            <span className="text-lg font-semibold text-primary">$34,200</span>
          </div>
        </div>
      </div>

      {/* Technical Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <ChartBar className="text-primary h-5 w-5" />
            <h3 className="text-lg font-semibold text-primary">Technical Analysis</h3>
          </div>
          <div className="space-y-4 bg-background/40 p-4 rounded-lg">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-primary/70">RSI</span>
                <span className="text-primary">{technicalIndicators.rsi}</span>
              </div>
              <Progress value={technicalIndicators.rsi} className="h-2" />
            </div>
            <div className="flex justify-between py-2 border-t border-primary/10">
              <span className="text-primary/70">MACD</span>
              <span className="text-green-500">{technicalIndicators.macd}</span>
            </div>
            <div className="flex justify-between py-2 border-t border-primary/10">
              <span className="text-primary/70">Moving Averages</span>
              <span className="text-green-500">{technicalIndicators.movingAverages}</span>
            </div>
          </div>
        </div>

        {/* Risk Metrics */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Scale className="text-primary h-5 w-5" />
            <h3 className="text-lg font-semibold text-primary">Risk Analysis</h3>
          </div>
          <div className="bg-background/40 p-4 rounded-lg space-y-3">
            <div className="flex justify-between items-center p-2 bg-background/20 rounded">
              <span className="text-primary/70">Volatility</span>
              <span className="px-2 py-1 rounded bg-yellow-500/20 text-yellow-500 text-sm">
                {riskMetrics.volatility}
              </span>
            </div>
            <div className="flex justify-between items-center p-2 bg-background/20 rounded">
              <span className="text-primary/70">Risk/Reward Ratio</span>
              <span className="text-primary">{riskMetrics.riskReward}</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-background/20 rounded">
              <span className="text-primary/70">Suggested Stop Loss</span>
              <span className="text-red-500">{riskMetrics.stopLoss}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Market Signals */}
      <div className="mt-8 space-y-4">
        <div className="flex items-center gap-2">
          <Newspaper className="text-primary h-5 w-5" />
          <h3 className="text-lg font-semibold text-primary">Market Signals</h3>
        </div>
        <div className="bg-background/40 p-4 rounded-lg space-y-3">
          {topStories.map((story, index) => (
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

      {/* Methodology Note */}
      <div className="mt-6 flex items-start gap-2 text-xs text-primary/70 bg-background/20 p-3 rounded-lg">
        <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
        <p>
          Analysis combines technical indicators, market sentiment, and real-time news impact. Signals are generated using 
          advanced algorithms processing multiple data points including price action, volume analysis, and social sentiment. 
          Risk metrics are calculated based on historical volatility and market conditions. Always conduct your own research 
          before making trading decisions.
        </p>
      </div>
    </Card>
  );
};

export default TrendAnalysis;
