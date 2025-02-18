
import { useEffect, useState, useCallback } from 'react';
import { Terminal, RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const PageHeader = ({ onRefresh, isLoading }) => {
  const [typingEffect, setTypingEffect] = useState('');
  const { toast } = useToast();

  const startTypingAnimation = useCallback(() => {
    const text = "HackerPump Terminal";
    let currentIndex = 0;
    setTypingEffect('');

    const interval = setInterval(() => {
      if (currentIndex === text.length) {
        clearInterval(interval);
        return;
      }

      setTypingEffect(text.slice(0, currentIndex + 1));
      currentIndex++;
    }, 100);

    return interval;
  }, []);

  useEffect(() => {
    const interval = startTypingAnimation();
    
    return () => {
      clearInterval(interval);
      setTypingEffect('');
    };
  }, [startTypingAnimation]);

  const handleRefresh = async () => {
    await onRefresh();
    toast({
      title: "Refreshing Stories",
      description: "Fetching the latest crypto news and trends...",
    });
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-4xl font-bold text-primary text-glow flex items-center">
        <Terminal className="mr-2" />
        <span>{typingEffect}</span>
        <span className="animate-pulse ml-[2px]">_</span>
      </h1>
      <Button
        onClick={handleRefresh}
        disabled={isLoading}
        variant="outline"
        className="border-primary text-primary hover:bg-primary/10"
      >
        <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        {isLoading ? 'Refreshing...' : 'Refresh'}
      </Button>
    </div>
  );
};

export default PageHeader;
