
import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { useNewsData } from '@/hooks/useNewsData';
import { analyzeTrends } from '@/utils/trendAnalysis';
import { filterAndSortStories } from '@/utils/newsFilters';
import { MAJOR_CRYPTOCURRENCIES } from '@/constants/crypto';
import MatrixBackground from '@/components/MatrixBackground';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import TokenStats from '@/components/TokenStats';
import SearchAndSort from '@/components/SearchAndSort';
import NewsGrid from '@/components/NewsGrid';
import Roadmap from '@/components/Roadmap';
import PageHeader from '@/components/PageHeader';
import ChartContainer from '@/components/ChartContainer';
import { fetchRealTimePrice, fetchHistoricalData } from '@/services/marketDataService';
import { calculateStopLoss } from '@/services/riskAnalysisService';

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('points');
  const [selectedCrypto, setSelectedCrypto] = useState('all');
  const [trendAnalysis, setTrendAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date());
  const [btcChartData, setBtcChartData] = useState([]);
  const [solChartData, setSolChartData] = useState([]);
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null
  });
  const [chartConfig, setChartConfig] = useState({
    btc: { domain: ['auto', 'auto'] },
    sol: { domain: ['auto', 'auto'] }
  });
  const [btcTimeframe, setBtcTimeframe] = useState('24H');
  const [solTimeframe, setSolTimeframe] = useState('24H');
  const { toast } = useToast();
  const { data, isLoading, error, refetch, isFetching } = useNewsData();

  const handleDateRangeChange = async (crypto, start, end) => {
    const symbol = crypto.toUpperCase();
    const startTime = start ? new Date(start).getTime() : null;
    const endTime = end ? new Date(end).getTime() : null;
    
    setDateRange({ startDate: start, endDate: end });
    
    const historicalData = await fetchHistoricalData(symbol, startTime, endTime);
    if (symbol === 'BTC') {
      setBtcChartData(historicalData);
    } else if (symbol === 'SOL') {
      setSolChartData(historicalData);
    }
  };

  const handleZoom = (crypto, domain) => {
    setChartConfig(prev => ({
      ...prev,
      [crypto.toLowerCase()]: { domain }
    }));
  };

  const updateTrendAnalysis = async (stories) => {
    setIsAnalyzing(true);
    try {
      console.log("Starting new trend analysis calculation...");
      const analysis = await analyzeTrends(stories);
      
      const now = new Date();
      setLastUpdateTime(now);
      
      const btcPrice = await fetchRealTimePrice('BTC');
      const btcHistorical = await fetchHistoricalData('BTC');
      if (btcPrice && btcHistorical.length > 0) {
        const btcRisk = calculateStopLoss(analysis.btcSignal, btcPrice, btcHistorical, btcTimeframe);
        MAJOR_CRYPTOCURRENCIES[0].currentPrice = btcPrice;
        MAJOR_CRYPTOCURRENCIES[0].riskAnalysis = btcRisk;
        setBtcChartData(btcHistorical);
      }
      
      const solPrice = await fetchRealTimePrice('SOL');
      const solHistorical = await fetchHistoricalData('SOL');
      if (solPrice && solHistorical.length > 0) {
        const solRisk = calculateStopLoss(analysis.solSignal, solPrice, solHistorical, solTimeframe);
        MAJOR_CRYPTOCURRENCIES[1].currentPrice = solPrice;
        MAJOR_CRYPTOCURRENCIES[1].riskAnalysis = solRisk;
        setSolChartData(solHistorical);
      }

      setTrendAnalysis({
        ...analysis,
        btcRiskAnalysis: MAJOR_CRYPTOCURRENCIES[0].riskAnalysis,
        solRiskAnalysis: MAJOR_CRYPTOCURRENCIES[1].riskAnalysis
      });
      
      toast({
        title: "Analysis Updated",
        description: `Market analysis and risk metrics updated at ${now.toLocaleTimeString()}`,
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

  const handleTimeframeChange = async (crypto, newTimeframe) => {
    if (crypto === 'BTC') {
      setBtcTimeframe(newTimeframe);
      const historicalData = await fetchHistoricalData('BTC', null, null, newTimeframe);
      setBtcChartData(historicalData);
    } else {
      setSolTimeframe(newTimeframe);
      const historicalData = await fetchHistoricalData('SOL', null, null, newTimeframe);
      setSolChartData(historicalData);
    }
    
    if (data?.hits) {
      await updateTrendAnalysis(data.hits);
    }
  };

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

  useEffect(() => {
    if (data?.hits) {
      updateTrendAnalysis(data.hits);
    }
  }, [data]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log("Auto-refreshing analysis...");
      handleRefresh();
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  const handleVote = (storyId) => {
    toast({
      title: "Vote Registered",
      description: "Your vote has been counted!",
    });
  };

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
          stories={filterAndSortStories(data?.hits, searchTerm, selectedCrypto, sortBy)}
          onVote={handleVote}
        />

        <div id="trend-analysis-container" className="mt-12 mb-16 space-y-8">
          <h2 className="text-2xl font-bold text-primary mb-4">Market Trend Analysis</h2>
          <div className="grid grid-cols-1 gap-8">
            <ChartContainer
              crypto="BTC"
              title="Bitcoin (BTC/USDT)"
              chartData={btcChartData}
              timeframe={btcTimeframe}
              onTimeframeChange={handleTimeframeChange}
              dateRange={dateRange}
              onDateRangeChange={handleDateRangeChange}
              chartConfig={chartConfig.btc}
              onZoom={handleZoom}
              trendAnalysis={trendAnalysis}
              lastUpdateTime={lastUpdateTime}
            />

            <ChartContainer
              crypto="SOL"
              title="Solana (SOL/USDT)"
              chartData={solChartData}
              timeframe={solTimeframe}
              onTimeframeChange={handleTimeframeChange}
              dateRange={dateRange}
              onDateRangeChange={handleDateRangeChange}
              chartConfig={chartConfig.sol}
              onZoom={handleZoom}
              trendAnalysis={trendAnalysis}
              lastUpdateTime={lastUpdateTime}
            />
          </div>
        </div>

        <Roadmap />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
