
import { useEffect, useState } from 'react';
import { Terminal, RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const PageHeader = ({ onRefresh, isLoading }) => {
  const [typingEffect, setTypingEffect] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const text = "HackerPump Terminal";
    let currentText = '';
    let currentIndex = 0;

    const typingInterval = setInterval(() => {
      if (currentIndex <= text.length) {
        currentText = text.slice(0, currentIndex);
        setTypingEffect(currentText);
        currentIndex++;
      } else {
        // Reset typing effect when complete
        clearInterval(typingInterval);
        // Ensure the full text is displayed
        setTypingEffect(text);
      }
    }, 100);

    // Cleanup interval on component unmount
    return () => {
      clearInterval(typingInterval);
      setTypingEffect(text); // Ensure full text is shown when unmounting
    };
  }, []); // Empty dependency array ensures effect runs only once on mount

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
