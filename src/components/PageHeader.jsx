
import { useEffect, useState, useCallback } from 'react';
import { Terminal, RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const PageHeader = ({ onRefresh, isLoading }) => {
  const [typingEffect, setTypingEffect] = useState('');
  const { toast } = useToast();

  const animateText = useCallback(() => {
    const text = "HackerPump Terminal";
    let startTime = null;
    let frame = 0;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const newFrame = Math.floor(progress / 100); // Control speed here

      if (newFrame > frame) {
        frame = newFrame;
        if (frame <= text.length) {
          setTypingEffect(text.substring(0, frame));
          requestAnimationFrame(animate);
        }
      } else {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    animateText();
  }, [animateText]);

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
        {typingEffect}<span className="animate-pulse">_</span>
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
