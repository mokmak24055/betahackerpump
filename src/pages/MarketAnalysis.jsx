
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
