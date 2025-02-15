
import React from 'react';
import { Button } from "@/components/ui/button";
import { Bot, TrendingUp } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="relative z-10 py-16 text-center">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Bot className="w-12 h-12 text-pink-500 animate-pulse" />
        <h1 className="text-6xl font-bold text-primary text-glow animate-pulse">
          HackerPump ($HACK)
        </h1>
      </div>
      <p className="text-xl mb-4 text-primary/80 max-w-2xl mx-auto">
        The first decentralized news aggregator powered by the community. Where technology meets DeFi.
      </p>
      <div className="flex gap-4 justify-center mb-8">
        <Button 
          size="lg" 
          className="bg-pink-500 hover:bg-pink-600 text-black font-bold group flex items-center"
        >
          Buy $HACK <TrendingUp className="ml-2 group-hover:translate-y-[-2px] transition-transform" />
        </Button>
      </div>
    </div>
  );
};

export default HeroSection;
