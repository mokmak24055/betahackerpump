
import NewsCard from '@/components/NewsCard';

const NewsGrid = ({ isLoading, error, stories, onVote }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(9)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="h-48 bg-card/50 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-destructive bg-destructive/20 p-4 rounded-lg backdrop-blur-sm">
        Error: {error.message}
      </div>
    );
  }

  if (stories.length === 0) {
    return (
      <div className="text-center p-8 bg-card/30 rounded-lg backdrop-blur-sm">
        <p className="text-primary text-lg">No crypto-related stories found at the moment.</p>
        <p className="text-primary/70">Please try refreshing or check back later.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {stories.map((story) => (
        <NewsCard 
          key={story.objectID} 
          story={story} 
          onVote={onVote}
        />
      ))}
    </div>
  );
};

export default NewsGrid;
