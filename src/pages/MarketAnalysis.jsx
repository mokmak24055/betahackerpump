
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpRight, ArrowDownRight, LineChart as ChartIcon } from 'lucide-react';
import { format } from 'date-fns';
import MatrixBackground from '@/components/MatrixBackground';

const MAJOR_COINS = ['bitcoin', 'ethereum', 'solana', 'cardano', 'binancecoin'];
const COINGECKO_IDS = {
  'bitcoin': 'bitcoin',
  'ethereum': 'ethereum',
  'solana': 'solana',
  'cardano': 'cardano',
  'binancecoin': 'binancecoin'
};
const TIME_FRAMES = [
  { label: '1H', value: '1', days: '0.0417' }, // 1 hour in days
  { label: '24H', value: '24', days: '1' },
];

const fetchMarketData = async () => {
  const response = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${Object.values(COINGECKO_IDS).join(',')}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true`
  );
  if (!response.ok) throw new Error('Network response was not ok');
  return response.json();
};

const fetchHistoricalData = async (coinId, timeframe) => {
  const selectedTimeFrame = TIME_FRAMES.find(tf => tf.value === timeframe);
  const days = selectedTimeFrame?.days || '1';
  
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${COINGECKO_IDS[coinId]}/market_chart?vs_currency=usd&days=${days}`
    );
    
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    
    return { prices: data.prices };
  } catch (error) {
    console.error('Error fetching historical data:', error);
    throw error;
  }
};

const formatChartDate = (timestamp, timeframe) => {
  const date = new Date(timestamp);
  return timeframe === '1' ? format(date, 'HH:mm') : format(date, 'MM/dd HH:mm');
};

const MarketAnalysis = () => {
  const [selectedCoin, setSelectedCoin] = useState('bitcoin');
  const [timeFrame, setTimeFrame] = useState('24');

  const { data: marketData, isLoading: marketLoading } = useQuery({
    queryKey: ['marketData'],
    queryFn: fetchMarketData,
    refetchInterval: 30000,
  });

  const { data: historicalData, isLoading: historyLoading } = useQuery({
    queryKey: ['historicalData', selectedCoin, timeFrame],
    queryFn: () => fetchHistoricalData(selectedCoin, timeFrame),
    refetchInterval: timeFrame === '1' ? 60000 : 300000,
  });

  const chartData = historicalData?.prices?.map(([timestamp, price]) => ({
    date: formatChartDate(timestamp, timeFrame),
    price: price.toFixed(2),
    timestamp,
  })) || [];

  const handleCoinSelect = (coinId) => {
    setSelectedCoin(coinId);
  };

  const handleTimeFrameChange = (newTimeFrame) => {
    setTimeFrame(newTimeFrame);
  };

  return (
    <div className="container mx-auto p-4 bg-background/80 relative z-10 min-h-screen">
      <MatrixBackground />
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <ChartIcon className="mr-2 text-primary" />
          <h1 className="text-4xl font-bold text-primary text-glow">Market Analysis</h1>
        </div>
        <Select value={timeFrame} onValueChange={handleTimeFrameChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            {TIME_FRAMES.map(({ label, value }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {!marketLoading && marketData && MAJOR_COINS.map((coinId) => {
          const data = marketData[coinId];
          const priceChange = data?.usd_24h_change || 0;
          const isPositive = priceChange > 0;

          return (
            <Card 
              key={coinId} 
              className={`p-4 border-primary bg-card/30 backdrop-blur-sm hover:bg-card/40 transition-all cursor-pointer ${
                selectedCoin === coinId ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => handleCoinSelect(coinId)}
            >
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
              <p className="text-sm text-primary/70 mt-2">
                Market Cap: ${(data?.usd_market_cap / 1e9).toFixed(2)}B
              </p>
            </Card>
          );
        })}
      </div>

      <Card className="p-6 border-primary bg-card/30 backdrop-blur-sm">
        <Tabs defaultValue="price" className="w-full">
          <TabsList>
            <TabsTrigger value="price">Price Chart</TabsTrigger>
            <TabsTrigger value="stats">Market Stats</TabsTrigger>
          </TabsList>
          
          <TabsContent value="price">
            <div className="h-[400px] mt-4">
              {historyLoading ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-primary">Loading chart data...</p>
                </div>
              ) : chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      dataKey="date"
                      tick={{ fill: '#00ff00' }}
                      tickFormatter={(value) => value}
                    />
                    <YAxis 
                      tick={{ fill: '#00ff00' }}
                      domain={['auto', 'auto']}
                      tickFormatter={(value) => `$${Number(value).toLocaleString()}`}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                      labelFormatter={(label) => `Time: ${label}`}
                      formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Price']}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="price" 
                      name={`${selectedCoin.charAt(0).toUpperCase() + selectedCoin.slice(1)} Price`}
                      stroke="#00ff00" 
                      dot={false}
                      strokeWidth={2}
                      activeDot={{ r: 4, fill: '#00ff00' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-primary">No data available</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="stats">
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Price Statistics ({selectedCoin.charAt(0).toUpperCase() + selectedCoin.slice(1)})</h3>
                {!historyLoading && chartData.length > 0 ? (
                  <>
                    <p>Current Price: ${Number(chartData[chartData.length - 1].price).toLocaleString()}</p>
                    <p>Period High: ${Math.max(...chartData.map(d => Number(d.price))).toLocaleString()}</p>
                    <p>Period Low: ${Math.min(...chartData.map(d => Number(d.price))).toLocaleString()}</p>
                  </>
                ) : (
                  <p>Loading statistics...</p>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default MarketAnalysis;
