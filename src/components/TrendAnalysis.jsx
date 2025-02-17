
import { Card } from "@/components/ui/card";
import { TrendingUp, ChartBar, Signal } from 'lucide-react';

const TrendAnalysis = ({ trendAnalysis }) => {
  console.log("TrendAnalysis props:", trendAnalysis); // Debug log

  // Add a fallback UI when there's no data
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

  return (
    <Card className="p-6 mb-8 border-2 border-primary bg-card/30 backdrop-blur-sm hover:bg-card/50 transition-all">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="text-primary h-6 w-6" />
        <h2 className="text-2xl font-bold text-primary text-glow">Market Analysis</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <ChartBar className="text-primary h-5 w-5" />
            <h3 className="text-lg font-semibold text-primary">Top Trending Topics</h3>
          </div>
          <ul className="space-y-3">
            {trendAnalysis.trendingTopics?.map(({ topic, count }) => (
              <li key={topic} className="flex justify-between items-center bg-background/40 p-3 rounded-lg">
                <span className="text-primary capitalize font-medium">{topic}</span>
                <span className="text-sm bg-primary/20 text-primary px-3 py-1 rounded-full">
                  {count} mentions
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Signal className="text-primary h-5 w-5" />
            <h3 className="text-lg font-semibold text-primary">Market Sentiment</h3>
          </div>
          <div className="bg-background/40 p-6 rounded-lg flex flex-col items-center gap-4">
            <div className={`text-4xl ${trendAnalysis.overallSentiment > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {trendAnalysis.overallSentiment > 0 ? '📈' : '📉'}
            </div>
            <div className="text-center">
              <span className={`text-xl font-bold ${trendAnalysis.overallSentiment > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {trendAnalysis.overallSentiment > 0 ? 'Bullish' : 'Bearish'}
              </span>
              <p className="text-primary/70 mt-2">
                Based on {trendAnalysis.sentiments?.length || 0} recent stories
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TrendAnalysis;
