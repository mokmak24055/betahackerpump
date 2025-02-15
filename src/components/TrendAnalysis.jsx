
import { Card } from "@/components/ui/card";
import { TrendingUp } from 'lucide-react';

const TrendAnalysis = ({ trendAnalysis }) => {
  if (!trendAnalysis) return null;

  return (
    <Card className="p-6 mb-6 border-primary bg-card/30 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="text-primary" />
        <h2 className="text-xl font-bold text-primary">Trending Analysis</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Top Trending Topics</h3>
          <ul className="space-y-2">
            {trendAnalysis.trendingTopics.map(({ topic, count }) => (
              <li key={topic} className="flex justify-between items-center">
                <span className="text-primary capitalize">{topic}</span>
                <span className="text-sm text-primary/70">{count} mentions</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Market Sentiment</h3>
          <div className="flex items-center gap-2">
            <div className={`text-2xl ${trendAnalysis.overallSentiment > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {trendAnalysis.overallSentiment > 0 ? '📈' : '📉'}
            </div>
            <span className="text-primary">
              {trendAnalysis.overallSentiment > 0 ? 'Bullish' : 'Bearish'}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TrendAnalysis;
