
import { MAJOR_CRYPTOCURRENCIES } from '@/constants/crypto';

export const filterAndSortStories = (stories, searchTerm, selectedCrypto, sortBy) => {
  if (!stories) return [];

  const filteredStories = stories.filter(story => {
    const content = `${story.title} ${story.url || ''} ${story.story_text || ''}`.toLowerCase();
    
    if (selectedCrypto !== 'all') {
      const cryptoInfo = MAJOR_CRYPTOCURRENCIES.find(c => c.id === selectedCrypto);
      if (!cryptoInfo?.keywords.some(keyword => content.includes(keyword))) {
        return false;
      }
    }
    
    return story.title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const sortedStories = [...filteredStories].sort((a, b) => {
    switch (sortBy) {
      case 'points':
        return b.points - a.points;
      case 'date':
        return new Date(b.created_at) - new Date(a.created_at);
      case 'comments':
        return (b.num_comments || 0) - (a.num_comments || 0);
      default:
        return 0;
    }
  });

  return sortedStories.slice(0, 12);
};
