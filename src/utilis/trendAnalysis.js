
import { pipeline } from '@huggingface/transformers';

let classifier = null;

export const initializeAI = async () => {
  if (!classifier) {
    classifier = await pipeline('text-classification', 'onnx-community/distilbert-base-uncased-finetuned-sst-2-english', {
      device: 'webgpu'
    });
  }
  return classifier;
};

export const analyzeTrends = async (stories) => {
  const analyzer = await initializeAI();
  
  // Group stories by cryptocurrency mentions
  const cryptoMentions = {};
  const sentiments = [];
  
  for (const story of stories) {
    const content = `${story.title} ${story.url || ''} ${story.story_text || ''}`.toLowerCase();
    
    // Analyze sentiment
    const sentiment = await analyzer(story.title);
    sentiments.push({
      title: story.title,
      sentiment: sentiment[0].label,
      score: sentiment[0].score
    });
    
    // Count cryptocurrency mentions
    CRYPTO_KEYWORDS.forEach(keyword => {
      if (content.includes(keyword)) {
        cryptoMentions[keyword] = (cryptoMentions[keyword] || 0) + 1;
      }
    });
  }
  
  // Calculate trending topics
  const trendingTopics = Object.entries(cryptoMentions)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([topic, count]) => ({ topic, count }));
    
  // Calculate overall sentiment
  const overallSentiment = sentiments.reduce((acc, curr) => {
    return acc + (curr.sentiment === 'POSITIVE' ? curr.score : -curr.score);
  }, 0) / sentiments.length;
  
  return {
    trendingTopics,
    overallSentiment,
    sentiments
  };
};
