
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Terminal, RefreshCw } from 'lucide-react';
import MatrixBackground from '@/components/MatrixBackground';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import TokenStats from '@/components/TokenStats';
import SearchAndSort from '@/components/SearchAndSort';
import TrendAnalysis from '@/components/TrendAnalysis';
import NewsGrid from '@/components/NewsGrid';
import Roadmap from '@/components/Roadmap';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { analyzeTrends } from '@/utils/trendAnalysis';

export const CRYPTO_KEYWORDS = [
  'crypto', 'bitcoin', 'ethereum', 'blockchain', 'web3', 'defi', 'nft',
  'cryptocurrency', 'btc', 'eth', 'token', 'dao', 'mining', 'binance',
  'coinbase', 'metamask', 'wallet', 'dex', 'exchange'
];

export const MAJOR_CRYPTOCURRENCIES = [
  { id: 'bitcoin', keywords: ['bitcoin', 'btc'] },
  { id: 'ethereum', keywords: ['ethereum', 'eth'] },
  { id: 'binance', keywords: ['binance', 'bnb'] },
  { id: 'solana', keywords: ['solana', 'sol'] },
  { id: 'cardano', keywords: ['cardano', 'ada'] }
];

const NEWS_SOURCES = [
  'https://hn.algolia.com/api/v1/search_by_date?query=crypto&tags=story&hitsPerPage=100',
  'https://hn.algolia.com/api/v1/search?tags=story&query=bitcoin&hitsPerPage=100',
  'https://hn.algolia.com/api/v1/search?tags=story&query=blockchain&hitsPerPage=100'
];

const fetchTopStories = async () => {
  // Randomly select a source
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
      // Add a timestamp to track when the story was fetched
      .map(story => ({
        ...story,
        fetchedAt: new Date().toISOString()
      }))
  };
};

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('points');
  const [selectedCrypto, setSelectedCrypto] = useState('all');
  const [typingEffect, setTypingEffect] = useState('');
  const [trendAnalysis, setTrendAnalysis] = useState(null);
  const { toast } = useToast();

  const { 
    data, 
    isLoading, 
    error,
    refetch,
    isFetching 
  } = useQuery({
    queryKey: ['cryptoStories'],
    queryFn: fetchTopStories,
    refetchInterval: 300000, // Auto-refresh every 5 minutes
    staleTime: 60000, // Consider data stale after 1 minute
  });

  useEffect(() => {
    const text = "HackerPump Terminal";
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < text.length) {
        setTypingEffect((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 100);

    return () => clearInterval(typingInterval);
  }, []);

  useEffect(() => {
    if (data?.hits) {
      analyzeTrends(data.hits).then(analysis => {
        setTrendAnalysis(analysis);
      });
    }
  }, [data]);

  const handleRefresh = async () => {
    // Invalidate the current query cache to force a fresh fetch
    await refetch({ cancelRefetch: true });
    
    toast({
      title: "Refreshing Stories",
      description: "Fetching the latest crypto news and trends...",
    });
  };

  const handleVote = (storyId) => {
    toast({
      title: "Vote Registered",
      description: "Your vote has been counted!",
    });
  };

  const sortStories = (stories) => {
    return [...stories].sort((a, b) => {
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
  };

  const filteredStories = data?.hits
    .filter(story => {
      const content = `${story.title} ${story.url || ''} ${story.story_text || ''}`.toLowerCase();
      
      if (selectedCrypto !== 'all') {
        const cryptoInfo = MAJOR_CRYPTOCURRENCIES.find(c => c.id === selectedCrypto);
        if (!cryptoInfo?.keywords.some(keyword => content.includes(keyword))) {
          return false;
        }
      }
      
      return story.title.toLowerCase().includes(searchTerm.toLowerCase());
    }) || [];

  const sortedStories = sortStories(filteredStories);

  return (
    <>
      <div className="container mx-auto p-4 bg-background/80 relative z-10 min-h-screen">
        <MatrixBackground />
        
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-bold text-primary text-glow flex items-center">
            <Terminal className="mr-2" />
            {typingEffect}<span className="animate-pulse">_</span>
          </h1>
          <Button
            onClick={handleRefresh}
            disabled={isFetching}
            variant="outline"
            className="border-primary text-primary hover:bg-primary/10"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
            {isFetching ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>

        <HeroSection />
        <TokenStats />
        <TrendAnalysis trendAnalysis={trendAnalysis} />
        
        <SearchAndSort 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          sortBy={sortBy}
          onSortChange={setSortBy}
          selectedCrypto={selectedCrypto}
          onCryptoChange={setSelectedCrypto}
          cryptocurrencies={MAJOR_CRYPTOCURRENCIES}
        />

        <NewsGrid 
          isLoading={isLoading}
          error={error}
          stories={sortedStories}
          onVote={handleVote}
        />

        <Roadmap />
      </div>
      <Footer />
    </>
  );
};

export default Index; 
