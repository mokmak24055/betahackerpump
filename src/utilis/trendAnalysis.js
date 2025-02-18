
import { runAIAnalysis } from './aiAgent';
import { CRYPTO_KEYWORDS } from '@/constants/crypto';

export const analyzeTrends = async (stories) => {
  try {
    console.log("Starting trend analysis for", stories.length, "stories");
    
    const result = runAIAnalysis(stories);
    if (!result) return {
      trendingTopics: [],
      overallSentiment: 0,
      sentiments: []
    };

    const { trends, processedData } = result;
    
    // Group stories by cryptocurrency mentions
    const cryptoMentions = {};
    CRYPTO_KEYWORDS.forEach(keyword => {
      const count = processedData.filter(story => {
        const content = `${story.title} ${story.url || ''} ${story.story_text || ''}`.toLowerCase();
        return content.includes(keyword);
      }).length;
      if (count > 0) cryptoMentions[keyword] = count;
    });
    
    // Calculate trending topics
    const trendingTopics = Object.entries(cryptoMentions)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([topic, count]) => ({ topic, count }));
    
    // Map processed data to sentiments format
    const sentiments = processedData.map(item => ({
      title: item.title,
      sentiment: item.analysis.sentiment,
      score: item.analysis.score,
      confidence: item.analysis.confidence,
      impactScore: item.impactScore
    }));
    
    console.log("Analysis complete:", { 
      trendingTopics, 
      overallSentiment: trends.overallSentiment,
      totalSentiments: sentiments.length 
    });
    
    return {
      trendingTopics,
      overallSentiment: trends.overallSentiment,
      sentiments: sentiments.sort((a, b) => b.confidence - a.confidence)
    };
  } catch (error) {
    console.error("Error in trend analysis:", error);
    return {
      trendingTopics: [],
      overallSentiment: 0,
      sentiments: []
    };
  }
};
