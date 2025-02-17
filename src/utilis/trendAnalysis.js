
import { pipeline } from '@huggingface/transformers';
import { CRYPTO_KEYWORDS } from '@/constants/crypto';

let classifier = null;

export const initializeAI = async () => {
  if (!classifier) {
    try {
      classifier = await pipeline('text-classification', 'onnx-community/distilbert-base-uncased-finetuned-sst-2-english', {
        device: 'webgpu'
      });
      console.log("AI classifier initialized successfully");
    } catch (error) {
      console.error("Error initializing AI classifier:", error);
      return null;
    }
  }
  return classifier;
};

export const analyzeTrends = async (stories) => {
  try {
    console.log("Starting trend analysis for", stories.length, "stories");
    
    // Group stories by cryptocurrency mentions
    const cryptoMentions = {};
    const sentiments = [];
    
    for (const story of stories) {
      const content = `${story.title} ${story.url || ''} ${story.story_text || ''}`.toLowerCase();
      
      // Count cryptocurrency mentions
      CRYPTO_KEYWORDS.forEach(keyword => {
        if (content.includes(keyword)) {
          cryptoMentions[keyword] = (cryptoMentions[keyword] || 0) + 1;
        }
      });

      // Basic sentiment analysis without waiting for AI
      const isPositive = content.includes('up') || content.includes('rise') || content.includes('gain');
      const isNegative = content.includes('down') || content.includes('fall') || content.includes('loss');
      
      sentiments.push({
        title: story.title,
        sentiment: isPositive ? 'POSITIVE' : (isNegative ? 'NEGATIVE' : 'NEUTRAL'),
        score: isPositive ? 1 : (isNegative ? -1 : 0)
      });
    }
    
    // Calculate trending topics
    const trendingTopics = Object.entries(cryptoMentions)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([topic, count]) => ({ topic, count }));
      
    // Calculate overall sentiment
    const overallSentiment = sentiments.reduce((acc, curr) => {
      return acc + (curr.sentiment === 'POSITIVE' ? 1 : (curr.sentiment === 'NEGATIVE' ? -1 : 0));
    }, 0) / sentiments.length;
    
    console.log("Analysis complete:", { trendingTopics, overallSentiment, sentimentCount: sentiments.length });
    
    return {
      trendingTopics,
      overallSentiment,
      sentiments
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
