
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
      // Update crypto prices (in a real app, this would fetch from an API)
      const now = new Date();
      MAJOR_CRYPTOCURRENCIES[0].currentPrice = 95480.50 + (Math.random() * 200 - 100);
      MAJOR_CRYPTOCURRENCIES[1].currentPrice = 192.35 + (Math.random() * 4 - 2);
      
      toast({
        title: "Analysis Updated",
        description: `Market trend analysis refreshed at ${now.toLocaleTimeString()}`,
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

  useEffect(() => {
    if (data?.hits) {
      updateTrendAnalysis(data.hits);
    }
  }, [data]);

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

  // Auto-refresh the analysis every 5 minutes
  useEffect(() => {
    const intervalId = setInterval(() => {
      handleRefresh();
    }, 300000); // 5 minutes

    return () => clearInterval(intervalId);
  }, []);

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
          <TrendAnalysis trendAnalysis={trendAnalysis} selectedCrypto="bitcoin" />
          <TrendAnalysis trendAnalysis={trendAnalysis} selectedCrypto="solana" />
        </div>

        <Roadmap />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
