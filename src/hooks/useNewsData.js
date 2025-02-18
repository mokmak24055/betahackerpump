
import { useQuery } from '@tanstack/react-query';
import { NEWS_SOURCES, CRYPTO_KEYWORDS } from '@/constants/crypto';

const fetchTopStories = async () => {
  try {
    // Fetch from multiple sources concurrently
    const sourcePromises = NEWS_SOURCES.map(async (sourceUrl) => {
      const response = await fetch(sourceUrl);
      if (!response.ok) {
        console.warn(`Failed to fetch from ${sourceUrl}`);
        return { hits: [] };
      }
      return response.json();
    });

    const results = await Promise.all(sourcePromises);
    
    // Combine and deduplicate stories based on title
    const seenTitles = new Set();
    const allStories = results.flatMap(result => result.hits || [])
      .filter(story => {
        if (!story.title) return false;
        
        // Check for duplicates
        const normalized = story.title.toLowerCase();
        if (seenTitles.has(normalized)) return false;
        seenTitles.add(normalized);
        
        // Filter for crypto-related content
        const content = `${story.title} ${story.url || ''} ${story.story_text || ''}`.toLowerCase();
        return CRYPTO_KEYWORDS.some(keyword => content.includes(keyword));
      })
      .map(story => ({
        ...story,
        fetchedAt: new Date().toISOString()
      }));

    return {
      hits: allStories
    };
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
};

export const useNewsData = () => {
  return useQuery({
    queryKey: ['cryptoStories'],
    queryFn: fetchTopStories,
    refetchInterval: 300000,
    staleTime: 60000,
  });
};
