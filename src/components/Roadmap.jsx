
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Bot, Cpu } from 'lucide-react';

const Roadmap = () => {
  const phases = [
    {
      phase: "Phase 1: Foundation",
      icon: Brain,
      items: [
        "Website Launch",
        "Community Building",
        "Initial Marketing Campaign"
      ]
    },
    {
      phase: "Phase 2: Growth",
      icon: Bot,
      items: [
        "Token Launch",
        "Partnership Announcements",
        "Community Events"
      ]
    },
    {
      phase: "Phase 3: Expansion",
      icon: Cpu,
      items: [
        "AI-Powered DeFi Integration",
        "Predictive Market Analysis",
        "Mobile App Development"
      ]
    }
  ];

  return (
    <section className="py-16 container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-primary text-glow mb-4">AI-Driven Roadmap</h2>
        <p className="text-primary/70 max-w-2xl mx-auto">
          Our strategic vision for revolutionizing decentralized news and market analysis through artificial intelligence
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {phases.map((phase, index) => (
          <Card key={phase.phase} className="bg-card/90 border-primary/20 backdrop-blur-sm hover:shadow-pink-500/20 transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-pink-500 to-transparent"></div>
            <CardHeader className="relative">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 bg-pink-500/10 rounded-full">
                  <phase.icon className="w-8 h-8 text-pink-500" />
                </div>
              </div>
              <CardTitle className="text-2xl text-primary text-center">
                {phase.phase}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {phase.items.map((item, itemIndex) => (
                  <li key={item} className="text-primary/80 flex items-start gap-3">
                    <span className="w-2 h-2 mt-2 bg-pink-500 rounded-full flex-shrink-0"></span>
                    <span className="flex-1">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default Roadmap;
