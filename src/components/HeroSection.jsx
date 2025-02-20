
import React from 'react';
import { Button } from "@/components/ui/button";
import { Bot, Twitter, Github, Brain } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="relative z-10 py-16 text-center">
      <div className="flex justify-center mb-6 gap-2">
        <a 
          href="https://x.com/HackerPump" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <Button 
            size="lg"
            variant="ghost"
            className="text-primary hover:bg-transparent"
          >
            <Twitter className="w-8 h-8" />
          </Button>
        </a>
        <a 
          href="https://github.com/mokmak24055/betahackerpump.git" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <Button 
            size="lg"
            variant="ghost"
            className="text-primary hover:bg-transparent"
          >
            <Github className="w-8 h-8" />
          </Button>
        </a>
      </div>
      <div className="flex items-center justify-center gap-2 mb-4">
        <Bot className="w-12 h-12 text-pink-500 animate-pulse" />
        <h1 className="text-[60px] font-bold text-primary whitespace-nowrap text-glow animate-pulse tracking-tight leading-none">
          HackerPump ($HACK)
        </h1>
      </div>
      <div className="text-xl mb-8 max-w-3xl mx-auto font-light leading-relaxed tracking-wide backdrop-blur-sm p-8 rounded-lg border border-primary/10 space-y-4">
        <p className="text-pink-500 font-medium">
          The first AI-powered, decentralized news aggregator and sentiment analysis platform.
        </p>
        <div className="text-primary/90 text-left space-y-2">
          <p>🔹 Harnessing AI to deliver real-time market insights</p>
          <p>🔹 Integrating DeFi to reshape the future of information</p>
          <p>🔹 Empowering users with data-driven decision-making</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 max-w-2xl mx-auto text-primary/70">
        <div className="bg-card/30 p-4 rounded-lg backdrop-blur-sm border border-primary/20">
          <Brain className="w-6 h-6 text-pink-500 mb-2 mx-auto" />
          <h3 className="font-semibold mb-1">AI-Powered Analysis</h3>
          <p className="text-sm">Real-time sentiment analysis and trend prediction for crypto markets</p>
        </div>
        <div className="bg-card/30 p-4 rounded-lg backdrop-blur-sm border border-primary/20">
          <Bot className="w-6 h-6 text-pink-500 mb-2 mx-auto" />
          <h3 className="font-semibold mb-1">Smart Trading Signals</h3>
          <p className="text-sm">AI-generated trading insights based on news sentiment</p>
        </div>
      </div>
      <div className="flex gap-4 justify-center mb-8">
        <a 
          href="https://x.com/HackerPump"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button 
            size="lg" 
            className="bg-pink-500 hover:bg-pink-600 text-black font-bold group flex items-center whitespace-nowrap leading-none"
          >
            $HACK LAUNCH SOON!
          </Button>
        </a>
      </div>
      <div className="flex flex-wrap justify-center gap-4 text-primary/70 text-sm">
        <span className="flex items-center whitespace-nowrap">
          <Brain className="w-4 h-4 mr-1" /> AI-Powered
        </span>
        <span>•</span>
        <span className="whitespace-nowrap">Community-Driven</span>
        <span>•</span>
        <span className="whitespace-nowrap">DeFi-Integrated</span>
      </div>
    </div>
  );
};

export default HeroSection;
