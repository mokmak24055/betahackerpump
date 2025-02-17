
import { Card } from "@/components/ui/card";
import { TrendingUp, ChartBar, Signal, Newspaper, Info } from 'lucide-react';

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

  // Get top 3 most impactful stories based on points/score
  const topStories = trendAnalysis.sentiments
    .sort((a, b) => Math.abs(b.score) - Math.abs(a.score))
    .slice(0, 3);

  return (
    <Card className="p-6 mb-8 border-2 border-primary bg-card/30 backdrop-blur-sm hover:bg-card/50 transition-all">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="text-primary h-6 w-6" />
        <h2 className="text-2xl font-bold text-primary text-glow">Market Analysis</h2>
        <span className="ml-auto text-xs text-primary/70">Updated {new Date().toLocaleTimeString()}</span>
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
                Analysis based on {trendAnalysis.sentiments?.length || 0} market signals
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Top News Sources Section */}
      <div className="mt-8 space-y-4">
        <div className="flex items-center gap-2">
          <Newspaper className="text-primary h-5 w-5" />
          <h3 className="text-lg font-semibold text-primary">Key Market Indicators</h3>
        </div>
        <div className="bg-background/40 p-4 rounded-lg space-y-3">
          {topStories.map((story, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-background/20 rounded-lg">
              <div className={`px-2 py-1 rounded ${
                story.sentiment === 'POSITIVE' ? 'bg-green-500/20 text-green-500' : 
                story.sentiment === 'NEGATIVE' ? 'bg-red-500/20 text-red-500' : 
                'bg-primary/20 text-primary'
              }`}>
                {story.sentiment === 'POSITIVE' ? '↗' : story.sentiment === 'NEGATIVE' ? '↘' : '→'}
              </div>
              <p className="text-primary/90 text-sm">{story.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Methodology Note */}
      <div className="mt-6 flex items-start gap-2 text-xs text-primary/70 bg-background/20 p-3 rounded-lg">
        <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
        <p>
          This analysis is powered by real-time market data and sentiment analysis of cryptocurrency news sources. 
          The prediction model considers multiple factors including market mentions, sentiment analysis, and trending topics 
          to provide a comprehensive market overview.
        </p>
      </div>
    </Card>
  );
};

export default TrendAnalysis;
