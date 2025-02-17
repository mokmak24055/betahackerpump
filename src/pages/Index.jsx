
import { useState, useEffect } from 'react';
import MatrixBackground from '@/components/MatrixBackground';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import TokenStats from '@/components/TokenStats';
import SearchAndSort from '@/components/SearchAndSort';
import TrendAnalysis from '@/components/TrendAnalysis';
import NewsGrid from '@/components/NewsGrid';
import Roadmap from '@/components/Roadmap';
import PageHeader from '@/components/PageHeader';
import { useToast } from "@/components/ui/use-toast";
import { useNewsData } from '@/hooks/useNewsData';
import { analyzeTrends } from '@/utils/trendAnalysis';
import { filterAndSortStories } from '@/utils/newsFilters';
import { MAJOR_CRYPTOCURRENCIES } from '@/constants/crypto';

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('points');
  const [selectedCrypto, setSelectedCrypto] = useState('all');
  const [trendAnalysis, setTrendAnalysis] = useState(null);
  const { toast } = useToast();

  const { 
    data, 
    isLoading, 
    error,
    refetch,
    isFetching 
  } = useNewsData();

  useEffect(() => {
    if (data?.hits) {
      console.log("News data received:", data.hits.length, "stories"); // Debug log
      analyzeTrends(data.hits).then(analysis => {
        console.log("Trend analysis result:", analysis); // Debug log
        setTrendAnalysis(analysis);
      });
    }
  }, [data]);

  const handleVote = (storyId) => {
    toast({
      title: "Vote Registered",
      description: "Your vote has been counted!",
    });
  };

  const sortedStories = filterAndSortStories(data?.hits, searchTerm, selectedCrypto, sortBy);

  return (
    <>
      <div className="container mx-auto p-4 bg-background/80 relative z-10 min-h-screen">
        <MatrixBackground />
        <PageHeader onRefresh={refetch} isLoading={isFetching} />
        <HeroSection />
        <TokenStats />
        
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

        {/* Added debug comment and made the container more visible */}
        <div id="trend-analysis-container" className="mt-12 mb-16 border-4 border-primary p-4">
          <h2 className="text-2xl font-bold text-primary mb-4">Market Trend Analysis</h2>
          <TrendAnalysis trendAnalysis={trendAnalysis} />
        </div>

        <Roadmap />
      </div>
      <Footer />
    </>
  );
};

export default Index;
