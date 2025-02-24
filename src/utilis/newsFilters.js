
export const filterAndSortStories = (stories = [], searchTerm = '', selectedCrypto = 'all', sortBy = 'points') => {
  if (!Array.isArray(stories)) {
    return [];
  }

  let filtered = [...stories];

  // Filter by search term
  if (searchTerm) {
    const searchLower = searchTerm.toLowerCase();
    filtered = filtered.filter(story =>
      story.title.toLowerCase().includes(searchLower) ||
      story.source.toLowerCase().includes(searchLower)
    );
  }

  // Filter by selected cryptocurrency
  if (selectedCrypto !== 'all') {
    filtered = filtered.filter(story => {
      const storyLower = story.title.toLowerCase();
      switch (selectedCrypto) {
        case 'bitcoin':
          return storyLower.includes('bitcoin') || storyLower.includes('btc');
        case 'solana':
          return storyLower.includes('solana') || storyLower.includes('sol');
        default:
          return true;
      }
    });
  }

  // Sort stories
  return filtered.sort((a, b) => {
    switch (sortBy) {
      case 'points':
        return b.points - a.points;
      case 'comments':
        return b.num_comments - a.num_comments;
      case 'date':
        return new Date(b.created_at) - new Date(a.created_at);
      default:
        return b.points - a.points;
    }
  });
};
