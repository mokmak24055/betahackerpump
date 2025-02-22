
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
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date());
  const { toast } = useToast();

  const { 
    data, 
    isLoading, 
    error,
    refetch,
    isFetching 
  } = useNewsData();

  const updateTrendAnalysis = async (stories) => {
    setIsAnalyzing(true);
    try {
      console.log("Starting new trend analysis calculation...");
      const analysis = await analyzeTrends(stories);
      console.log("New trend analysis complete:", analysis);
      setTrendAnalysis(analysis);
      
      // Update crypto prices and simulate market movements
      const now = new Date();
      setLastUpdateTime(now);
      
      MAJOR_CRYPTOCURRENCIES[0].currentPrice = 95480.50 + (Math.random() * 200 - 100);
      MAJOR_CRYPTOCURRENCIES[1].currentPrice = 192.35 + (Math.random() * 4 - 2);
      
      // Show toast notification for updates
      toast({
        title: "Signals Updated",
        description: `Trading signals refreshed at ${now.toLocaleTimeString()}`,
      });
    } catch (error) {
      console.error("Error updating trend analysis:", error);
      toast({
        title: "Analysis Error",
        description: "Failed to update market analysis",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Initial analysis when data is loaded
  useEffect(() => {
    if (data?.hits) {
      updateTrendAnalysis(data.hits);
    }
  }, [data]);

  // Function to handle manual refresh
  const handleRefresh = async () => {
    try {
      const result = await refetch();
      if (result.data?.hits) {
        await updateTrendAnalysis(result.data.hits);
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast({
        title: "Refresh Error",
        description: "Failed to refresh market data",
        variant: "destructive",
      });
    }
  };

  // Auto-refresh every 2 minutes
  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log("Auto-refreshing trading signals...");
      handleRefresh();
    }, 120000); // 2 minutes

    return () => clearInterval(intervalId);
  }, []);

  // Additional refresh on significant news updates
  useEffect(() => {
    if (data?.hits && lastUpdateTime) {
      const newStories = data.hits.filter(story => 
        new Date(story.created_at) > lastUpdateTime
      );

      if (newStories.length > 0) {
        console.log("New stories detected, updating analysis...");
        updateTrendAnalysis(data.hits);
      }
    }
  }, [data, lastUpdateTime]);

  const handleVote = (storyId) => {
    toast({
      title: "Vote Registered",
      description: "Your vote has been counted!",
    });
  };

  const sortedStories = filterAndSortStories(data?.hits, searchTerm, selectedCrypto, sortBy);

  return (
    <div className="min-h-screen relative">
      <MatrixBackground />
      <div className="container mx-auto p-4 relative z-10">
        <PageHeader onRefresh={handleRefresh} isLoading={isFetching || isAnalyzing} />
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

        <div id="trend-analysis-container" className="mt-12 mb-16 space-y-8">
          <h2 className="text-2xl font-bold text-primary mb-4">Market Trend Analysis</h2>
          <TrendAnalysis 
            trendAnalysis={trendAnalysis} 
            selectedCrypto="bitcoin"
            lastUpdate={lastUpdateTime}
          />
          <TrendAnalysis 
            trendAnalysis={trendAnalysis} 
            selectedCrypto="solana"
            lastUpdate={lastUpdateTime}
          />
        </div>

        <Roadmap />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
