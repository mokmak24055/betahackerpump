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

  const calculateVolatilityBands = (price, historicalPrices = []) => {
    if (!historicalPrices.length) {
      return {
        upperBand: price * 1.02,
        lowerBand: price * 0.98,
        volatility: 0.02
      };
    }

    const mean = historicalPrices.reduce((a, b) => a + b, 0) / historicalPrices.length;
    const variance = historicalPrices.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / historicalPrices.length;
    const volatility = Math.sqrt(variance) / mean;

    return {
      upperBand: price * (1 + volatility),
      lowerBand: price * (1 - volatility),
      volatility
    };
  };

  const findNearestSupportResistance = (price, crypto) => {
    const recentHighs = crypto === 'BTC' ? 
      [97800, 96400, 95200, 94100] : 
      [178.50, 175.20, 172.40, 169.80];
    
    const recentLows = crypto === 'BTC' ? 
      [93200, 94300, 95100, 95900] :
      [168.20, 170.40, 171.90, 173.60];

    const nearestResistance = recentHighs.find(level => level > price) || price * 1.02;
    const nearestSupport = recentLows.reverse().find(level => level < price) || price * 0.98;

    return { nearestSupport, nearestResistance };
  };

  const calculateStopLoss = (signal, currentPrice, crypto) => {
    const { upperBand, lowerBand, volatility } = calculateVolatilityBands(currentPrice);
    
    const { nearestSupport, nearestResistance } = findNearestSupportResistance(currentPrice, crypto);
    
    const range = Math.abs(nearestResistance - nearestSupport);
    const atrMultiplier = 1.5;

    let stopLoss;
    let riskReward;

    switch (signal) {
      case 'STRONG_BUY': {
        const supportBuffer = range * 0.3;
        stopLoss = Math.min(nearestSupport - supportBuffer, currentPrice - (range * atrMultiplier));
        riskReward = {
          ratio: '1:3',
          potential: {
            reward: (nearestResistance - currentPrice) * 1.5,
            risk: currentPrice - stopLoss
          }
        };
        break;
      }
      case 'STRONG_SELL': {
        const resistanceBuffer = range * 0.3;
        stopLoss = Math.max(nearestResistance + resistanceBuffer, currentPrice + (range * atrMultiplier));
        riskReward = {
          ratio: '1:3',
          potential: {
            reward: (currentPrice - nearestSupport) * 1.5,
            risk: stopLoss - currentPrice
          }
        };
        break;
      }
      case 'SELL': {
        const minorResistanceBuffer = range * 0.2;
        stopLoss = currentPrice + (range * (atrMultiplier * 0.7));
        stopLoss = Math.min(stopLoss, nearestResistance + minorResistanceBuffer);
        riskReward = {
          ratio: '1:2',
          potential: {
            reward: currentPrice - nearestSupport,
            risk: stopLoss - currentPrice
          }
        };
        break;
      }
      default: {
        const volatilityStop = currentPrice * (1 - volatility * 1.5);
        stopLoss = Math.max(volatilityStop, nearestSupport - (range * 0.1));
        riskReward = {
          ratio: '1:2',
          potential: {
            reward: range * 0.8,
            risk: currentPrice - stopLoss
          }
        };
      }
    }

    return {
      stopLoss: Math.round(stopLoss * 100) / 100,
      riskReward,
      technicalLevels: {
        support: nearestSupport,
        resistance: nearestResistance,
        volatilityUpper: upperBand,
        volatilityLower: lowerBand
      }
    };
  };

  const updateTrendAnalysis = async (stories) => {
    setIsAnalyzing(true);
    try {
      console.log("Starting new trend analysis calculation...");
      const analysis = await analyzeTrends(stories);
      
      const now = new Date();
      setLastUpdateTime(now);
      
      const btcPrice = 95480.50 + (Math.random() * 200 - 100);
      const btcRisk = calculateStopLoss(analysis.btcSignal, btcPrice, 'BTC');
      MAJOR_CRYPTOCURRENCIES[0].currentPrice = btcPrice;
      MAJOR_CRYPTOCURRENCIES[0].riskAnalysis = btcRisk;
      
      const solPrice = 192.35 + (Math.random() * 4 - 2);
      const solRisk = calculateStopLoss(analysis.solSignal, solPrice, 'SOL');
      MAJOR_CRYPTOCURRENCIES[1].currentPrice = solPrice;
      MAJOR_CRYPTOCURRENCIES[1].riskAnalysis = solRisk;

      setTrendAnalysis({
        ...analysis,
        btcRiskAnalysis: btcRisk,
        solRiskAnalysis: solRisk
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

  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log("Auto-refreshing analysis...");
      handleRefresh();
    }, 120000);

    return () => clearInterval(intervalId);
  }, []);

  const handleVote = (storyId) => {
    toast({
      title: "Vote Registered",
      description: "Your vote has been counted!",
    });
  };

  const sortedStories = filterAndSortStories(data?.hits, searchTerm, selectedCrypto, sortBy);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = `
      {
        "autosize": true,
        "symbol": "BINANCE:BTCUSDT",
        "interval": "D",
        "timezone": "Etc/UTC",
        "theme": "dark",
        "style": "1",
        "locale": "en",
        "enable_publishing": false,
        "backgroundColor": "rgba(0, 0, 0, 1)",
        "gridColor": "rgba(42, 46, 57, 0.4)",
        "hide_top_toolbar": false,
        "hide_legend": false,
        "save_image": false,
        "calendar": false,
        "hide_volume": false,
        "support_host": "https://www.tradingview.com"
      }`;
    
    const container = document.getElementById('tradingview-widget-btc');
    if (container) container.appendChild(script);

    const scriptSOL = document.createElement('script');
    scriptSOL.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    scriptSOL.type = 'text/javascript';
    scriptSOL.async = true;
    scriptSOL.innerHTML = `
      {
        "autosize": true,
        "symbol": "BINANCE:SOLUSDT",
        "interval": "D",
        "timezone": "Etc/UTC",
        "theme": "dark",
        "style": "1",
        "locale": "en",
        "enable_publishing": false,
        "backgroundColor": "rgba(0, 0, 0, 1)",
        "gridColor": "rgba(42, 46, 57, 0.4)",
        "hide_top_toolbar": false,
        "hide_legend": false,
        "save_image": false,
        "calendar": false,
        "hide_volume": false,
        "support_host": "https://www.tradingview.com"
      }`;
    
    const containerSOL = document.getElementById('tradingview-widget-sol');
    if (containerSOL) containerSOL.appendChild(scriptSOL);

    return () => {
      if (container) container.innerHTML = '';
      if (containerSOL) containerSOL.innerHTML = '';
    };
  }, []);

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
          
          <div className="grid grid-cols-1 gap-8">
            <div className="bg-card/30 backdrop-blur-sm p-6 rounded-lg border border-primary">
              <h3 className="text-xl font-bold text-primary mb-4">Bitcoin (BTC/USDT)</h3>
              <div id="tradingview-widget-btc" className="w-full h-[600px] rounded-lg overflow-hidden" />
              <TrendAnalysis 
                trendAnalysis={trendAnalysis}
                selectedCrypto="bitcoin"
                lastUpdate={lastUpdateTime}
              />
            </div>

            <div className="bg-card/30 backdrop-blur-sm p-6 rounded-lg border border-primary">
              <h3 className="text-xl font-bold text-primary mb-4">Solana (SOL/USDT)</h3>
              <div id="tradingview-widget-sol" className="w-full h-[600px] rounded-lg overflow-hidden" />
              <TrendAnalysis 
                trendAnalysis={trendAnalysis}
                selectedCrypto="solana"
                lastUpdate={lastUpdateTime}
              />
            </div>
          </div>
        </div>

        <Roadmap />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
