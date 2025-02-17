
import React from 'react';
import { Button } from "@/components/ui/button";
import { TrendingUp, Bot, Twitter } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="relative z-10 py-16 text-center">
      <div className="flex justify-center mb-4">
        <a 
          href="https://x.com/HackerPump" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center bg-primary/10 hover:bg-primary/20 rounded-full p-2 transition-colors"
        >
          <Twitter className="w-6 h-6 text-primary" />
        </a>
      </div>
      <div className="flex items-center justify-center gap-2 mb-4">
        <Bot className="w-12 h-12 text-pink-500 animate-pulse" />
        <h1 className="text-6xl font-bold text-primary text-glow animate-pulse">
          HackerPump ($HACK)
        </h1>
      </div>
      <p className="text-xl mb-4 text-primary/80 max-w-2xl mx-auto">
        The first AI-powered decentralized news aggregator and sentiment analysis platform. 
        Where artificial intelligence meets DeFi to reshape the future of information.
      </p>
      <div className="flex gap-4 justify-center mb-8">
        <Button 
          size="lg" 
          className="bg-pink-500 hover:bg-pink-600 text-black font-bold group flex items-center"
        >
          $HACK LAUNCH SOON! <TrendingUp className="ml-2 group-hover:translate-y-[-2px] transition-transform" />
        </Button>
      </div>
      <div className="flex flex-wrap justify-center gap-4 text-primary/70 text-sm">
        <span>Community-Driven</span>
        <span>•</span>
        <span>DeFi-Integrated</span>
      </div>
    </div>
  );
};

export default HeroSection;
