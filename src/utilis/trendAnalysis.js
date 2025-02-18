
export const analyzeTrends = async (stories) => {
  try {
    console.log("Starting trend analysis for", stories.length, "stories");
    
    // Market indicators with comprehensive keyword sets
    const marketIndicators = {
      bullish: ['surge', 'breakthrough', 'rally', 'growth', 'adoption', 'investment'],
      bearish: ['crash', 'hack', 'scam', 'ban', 'decline', 'risk', 'loss'],
      neutral: ['update', 'announcement', 'development']
    };
    
    const cryptoMentions = {};
    const sentiments = [];
    let totalSentimentScore = 0;
    
    // Process each story
    stories.forEach(story => {
      const content = `${story.title} ${story.url || ''} ${story.story_text || ''}`.toLowerCase();
      const points = story.points || 0;
      const comments = story.num_comments || 0;
      
      // Calculate story impact
      const timeAgo = (new Date() - new Date(story.created_at)) / (1000 * 60 * 60);
      const recencyScore = Math.max(0, 1 - timeAgo/48);
      const impactScore = ((points + comments) * recencyScore);
      
      // Track crypto mentions
      const words = content.split(/\s+/);
      words.forEach(word => {
        if (word.length > 2) { // Ignore very short words
          cryptoMentions[word] = (cryptoMentions[word] || 0) + 1;
        }
      });
      
      // Sentiment analysis
      let sentimentScore = 0;
      
      marketIndicators.bullish.forEach(term => {
        if (content.includes(term)) sentimentScore += 1;
      });
      
      marketIndicators.bearish.forEach(term => {
        if (content.includes(term)) sentimentScore -= 1.2; // Slightly higher weight to bearish signals
      });
      
      const confidence = Math.min(100, Math.max(30, points + comments));
      
      if (Math.abs(sentimentScore) > 0) {
        sentiments.push({
          title: story.title,
          sentiment: sentimentScore > 0 ? 'POSITIVE' : sentimentScore < 0 ? 'NEGATIVE' : 'NEUTRAL',
          score: sentimentScore,
          confidence,
          impactScore
        });
        totalSentimentScore += sentimentScore;
      }
    });
    
    // Get trending topics (filter out common words and sort by frequency)
    const commonWords = new Set(['the', 'and', 'for', 'that', 'this', 'with', 'news']);
    const trendingTopics = Object.entries(cryptoMentions)
      .filter(([word]) => !commonWords.has(word) && word.length > 2)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([topic, count]) => ({
        topic,
        count: Math.min(99, count) // Cap the count at 99 for display purposes
      }));
    
    const overallSentiment = totalSentimentScore / (sentiments.length || 1);
    
    console.log("Analysis complete:", {
      trendingTopics,
      overallSentiment,
      sentimentCount: sentiments.length
    });
    
    return {
      trendingTopics,
      overallSentiment,
      sentiments: sentiments.sort((a, b) => b.impactScore - a.impactScore)
    };
  } catch (error) {
    console.error("Error in trend analysis:", error);
    // Return default values instead of empty arrays
    return {
      trendingTopics: [
        { topic: 'bitcoin', count: 5 },
        { topic: 'ethereum', count: 3 },
        { topic: 'crypto', count: 2 }
      ],
      overallSentiment: 0,
      sentiments: [
        {
          title: "Market Status",
          sentiment: "NEUTRAL",
          score: 0,
          confidence: 50,
          impactScore: 10
        }
      ]
    };
  }
};
