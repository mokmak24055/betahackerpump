
import React from 'react';
import { format } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CustomCalendar } from "@/components/ui/custom-calendar";
import TrendAnalysis from '@/components/TrendAnalysis';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/80 p-2 rounded border border-primary">
        <p className="text-primary">Time: {label}</p>
        <p className="text-primary">Price: ${Number(payload[0].value).toLocaleString()}</p>
        {payload[0].payload.volume && (
          <p className="text-primary">Volume: {Number(payload[0].payload.volume).toLocaleString()}</p>
        )}
      </div>
    );
  }
  return null;
};

const ChartContainer = ({
  crypto,
  title,
  chartData,
  timeframe,
  onTimeframeChange,
  dateRange,
  onDateRangeChange,
  chartConfig,
  onZoom,
  trendAnalysis,
  lastUpdateTime
}) => {
  return (
    <div className="bg-black/40 backdrop-blur-sm p-6 rounded-lg border border-primary relative overflow-hidden">
      <div className="relative z-10">
        <h3 className="text-xl font-bold text-primary mb-4">{title}</h3>
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-primary" />
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`border-primary text-primary hover:text-primary hover:bg-primary/10 ${
                    !dateRange.startDate && "text-muted-foreground"
                  }`}
                >
                  Date Range
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-background/95 backdrop-blur-sm border-primary" align="start">
                <div className="flex gap-4 p-3">
                  <div className="space-y-2">
                    <p className="text-primary text-sm">Start Date</p>
                    <CustomCalendar
                      mode="single"
                      selected={dateRange.startDate ? new Date(dateRange.startDate) : undefined}
                      onSelect={(date) => onDateRangeChange(crypto, date?.toISOString(), dateRange.endDate)}
                      initialFocus
                      className="bg-background/95 rounded-md"
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="text-primary text-sm">End Date</p>
                    <CustomCalendar
                      mode="single"
                      selected={dateRange.endDate ? new Date(dateRange.endDate) : undefined}
                      onSelect={(date) => onDateRangeChange(crypto, dateRange.startDate, date?.toISOString())}
                      className="bg-background/95 rounded-md"
                      fromDate={dateRange.startDate ? new Date(dateRange.startDate) : undefined}
                    />
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          
          <Select
            value={timeframe}
            onValueChange={(value) => onTimeframeChange(crypto, value)}
          >
            <SelectTrigger className="w-[100px] border-primary text-primary">
              <SelectValue>{timeframe}</SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-background/95 backdrop-blur-sm border-primary">
              <SelectItem value="1H" className="text-primary hover:bg-primary/10">1H</SelectItem>
              <SelectItem value="24H" className="text-primary hover:bg-primary/10">24H</SelectItem>
              <SelectItem value="7D" className="text-primary hover:bg-primary/10">7D</SelectItem>
              <SelectItem value="30D" className="text-primary hover:bg-primary/10">30D</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-full h-[600px] rounded-lg overflow-hidden">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={chartData}
              onMouseDown={(e) => e && e.activeLabel && onZoom(crypto, [e.activeLabel, null])}
            >
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="timestamp"
                stroke="#00ff00"
                domain={chartConfig?.domain || ['auto', 'auto']}
                allowDataOverflow
              />
              <YAxis 
                stroke="#00ff00"
                domain={['auto', 'auto']}
                tickFormatter={(value) => `$${Number(value).toLocaleString()}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="#00ff00" 
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
              {trendAnalysis?.[`${crypto.toLowerCase()}RiskAnalysis`]?.technicalLevels && (
                <>
                  <ReferenceLine 
                    y={trendAnalysis[`${crypto.toLowerCase()}RiskAnalysis`].technicalLevels.resistance} 
                    stroke="#ff0000" 
                    strokeDasharray="3 3"
                    label={{ value: "Resistance", fill: "#ff0000", position: "right" }}
                  />
                  <ReferenceLine 
                    y={trendAnalysis[`${crypto.toLowerCase()}RiskAnalysis`].technicalLevels.support} 
                    stroke="#00ff00" 
                    strokeDasharray="3 3"
                    label={{ value: "Support", fill: "#00ff00", position: "right" }}
                  />
                  <ReferenceLine 
                    y={trendAnalysis[`${crypto.toLowerCase()}RiskAnalysis`].stopLoss} 
                    stroke="#ff6b6b" 
                    strokeDasharray="5 5"
                    label={{ value: "Stop Loss", fill: "#ff6b6b", position: "left" }}
                  />
                </>
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
        <TrendAnalysis 
          trendAnalysis={trendAnalysis}
          selectedCrypto={crypto.toLowerCase()}
          lastUpdate={lastUpdateTime}
        />
      </div>
    </div>
  );
};

export default ChartContainer;
