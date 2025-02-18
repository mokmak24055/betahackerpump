
// Sentiment and trend analysis agent
const analyzeText = (text) => {
  const bullishWords = new Set([
    'surge', 'rally', 'breakthrough', 'adoption', 'partnership', 'growth',
    'launch', 'upgrade', 'innovation', 'success', 'bullish', 'gain',
    'support', 'potential', 'opportunity', 'expand', 'develop', 'integrate'
  ]);

  const bearishWords = new Set([
    'crash', 'decline', 'sell', 'bearish', 'risk', 'concern', 'drop',
    'vulnerability', 'hack', 'scam', 'regulation', 'ban', 'issue',
    'problem', 'delay', 'suspend', 'halt', 'investigation'
  ]);

  const words = text.toLowerCase().split(/\s+/);
  let bullishCount = 0;
  let bearishCount = 0;
  let relevanceScore = 0;

  words.forEach(word => {
    if (bullishWords.has(word)) bullishCount++;
    if (bearishWords.has(word)) bearishCount++;
  });

  // Calculate sentiment score (-1 to 1)
  const sentimentScore = (bullishCount - bearishCount) / (bullishCount + bearishCount || 1);
  
  // Calculate relevance based on keyword density
  relevanceScore = (bullishCount + bearishCount) / words.length;

  return {
    sentiment: sentimentScore > 0.2 ? 'POSITIVE' : sentimentScore < -0.2 ? 'NEGATIVE' : 'NEUTRAL',
    score: sentimentScore,
    confidence: Math.min(100, Math.round(relevanceScore * 100 * 3)), // Scale up for better visualization
    strength: Math.abs(sentimentScore)
  };
};

const processMarketData = (data) => {
  const now = new Date();
  const recentThreshold = new Date(now - 24 * 60 * 60 * 1000); // Last 24 hours

  return data.map(item => {
    const itemDate = new Date(item.created_at);
    const recencyScore = Math.max(0, 1 - (now - itemDate) / (24 * 60 * 60 * 1000));
    
    const analysis = analyzeText(item.title + ' ' + (item.story_text || ''));
    const impactScore = (
      (item.points || 0) * 0.4 + 
      (item.num_comments || 0) * 0.3 + 
      recencyScore * 0.3
    ) * 100;

    return {
      ...item,
      analysis,
      impactScore: Math.round(impactScore),
      isRecent: itemDate > recentThreshold
    };
  });
};

const identifyTrends = (processedData) => {
  const trends = {
    sentiment: { positive: 0, neutral: 0, negative: 0 },
    overallSentiment: 0,
    momentum: 0,
    recentActivity: 0
  };

  let totalWeight = 0;

  processedData.forEach(item => {
    const weight = item.impactScore / 100;
    totalWeight += weight;

    trends.sentiment[item.analysis.sentiment.toLowerCase()]++;
    trends.overallSentiment += item.analysis.score * weight;
    
    if (item.isRecent) {
      trends.recentActivity++;
      trends.momentum += item.analysis.score * weight * 1.5; // Recent items have 50% more impact
    }
  });

  // Normalize values
  trends.overallSentiment = trends.overallSentiment / (totalWeight || 1);
  trends.momentum = trends.momentum / (totalWeight || 1);

  return trends;
};

export const runAIAnalysis = (newsData) => {
  if (!newsData || !Array.isArray(newsData)) return null;

  const processedData = processMarketData(newsData);
  const trends = identifyTrends(processedData);

  console.log('AI Analysis Results:', {
    processedItems: processedData.length,
    trends
  });

  return {
    trends,
    processedData: processedData.sort((a, b) => b.impactScore - a.impactScore)
  };
};
