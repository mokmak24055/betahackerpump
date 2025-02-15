
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Users, Brain } from 'lucide-react';

const TokenStats = () => {
  const stats = [
    { label: "Market Cap", value: "", icon: TrendingUp },
    { label: "Holders", value: "", icon: Brain },
    { label: "24h Volume", value: "", icon: Users },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
      {stats.map((stat) => (
        <Card key={stat.label} className="bg-card/90 border-primary backdrop-blur-sm hover:shadow-pink-500/20 transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex flex-col items-center">
              <stat.icon className="w-6 h-6 text-pink-500 mb-2" />
              <h3 className="text-sm text-primary/70 mb-1">{stat.label}</h3>
              <p className="text-2xl font-bold text-primary">{stat.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TokenStats;
