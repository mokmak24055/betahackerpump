
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, LineChart as ChartIcon } from 'lucide-react';
import MatrixBackground from '@/components/MatrixBackground';

const MAJOR_COINS = ['bitcoin', 'ethereum', 'solana', 'cardano', 'binance-coin'];

const fetchMarketData = async () => {
  const response = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${MAJOR_COINS.join(',')}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true`
  );
  if (!response.ok) throw new Error('Network response was not ok');
  return response.json();
};

const fetchHistoricalData = async (coinId) => {
  const response = await fetch(
    `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=7&interval=daily`
  );
  if (!response.ok) throw new Error('Network response was not ok');
  return response.json();
};

const MarketAnalysis = () => {
  const [selectedCoin, setSelectedCoin] = useState('bitcoin');

  const { data: marketData, isLoading: marketLoading } = useQuery({
    queryKey: ['marketData'],
    queryFn: fetchMarketData,
    refetchInterval: 60000, // Refresh every minute
  });

  const { data: historicalData, isLoading: historyLoading } = useQuery({
    queryKey: ['historicalData', selectedCoin],
    queryFn: () => fetchHistoricalData(selectedCoin),
    refetchInterval: 300000, // Refresh every 5 minutes
  });

  const chartData = historicalData?.prices?.map(([timestamp, price]) => ({
    date: new Date(timestamp).toLocaleDateString(),
    price: price.toFixed(2),
  })) || [];

  return (
    <div className="container mx-auto p-4 bg-background/80 relative z-10 min-h-screen">
      <MatrixBackground />
      
      <div className="flex items-center mb-6">
        <ChartIcon className="mr-2 text-primary" />
        <h1 className="text-4xl font-bold text-primary text-glow">Market Analysis</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {!marketLoading && marketData && MAJOR_COINS.map((coinId) => {
          const data = marketData[coinId];
          const priceChange = data?.usd_24h_change || 0;
          const isPositive = priceChange > 0;

          return (
            <Card key={coinId} className="p-4 border-primary bg-card/30 backdrop-blur-sm hover:bg-card/40 transition-all cursor-pointer"
                  onClick={() => setSelectedCoin(coinId)}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold capitalize">{coinId.replace('-', ' ')}</h3>
                  <p className="text-2xl font-bold">${data?.usd?.toLocaleString()}</p>
                </div>
                <div className={`flex items-center ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                  {isPositive ? <ArrowUpRight /> : <ArrowDownRight />}
                  <span className="ml-1">{Math.abs(priceChange).toFixed(2)}%</span>
                </div>
              </div>
