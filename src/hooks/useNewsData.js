
import { useQuery } from '@tanstack/react-query';
import { NEWS_SOURCES, CRYPTO_KEYWORDS } from '@/constants/crypto';

const fetchTopStories = async () => {
  const sourceUrl = NEWS_SOURCES[Math.floor(Math.random() * NEWS_SOURCES.length)];
  
  const response = await fetch(sourceUrl);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json();
  
  return {
    ...data,
    hits: data.hits
      .filter(story => {
        const content = `${story.title} ${story.url || ''} ${story.story_text || ''}`.toLowerCase();
        return CRYPTO_KEYWORDS.some(keyword => content.includes(keyword));
      })
      .map(story => ({
        ...story,
        fetchedAt: new Date().toISOString()
      }))
  };
};

export const useNewsData = () => {
  return useQuery({
    queryKey: ['cryptoStories'],
    queryFn: fetchTopStories,
    refetchInterval: 300000,
    staleTime: 60000,
  });
};
