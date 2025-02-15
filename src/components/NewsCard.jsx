
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, ThumbsUp, MessageCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from "@/components/ui/use-toast";

const NewsCard = ({ story, onVote }) => {
  const { toast } = useToast();

  const handleVote = () => {
    onVote(story.objectID);
    toast({
      title: "Vote Registered!",
      description: "Thank you for participating in the community.",
    });
  };

  return (
    <Card className="bg-card/90 border-primary hover:shadow-lg hover:shadow-pink-500/50 transition-all duration-300 ease-in-out backdrop-blur-sm group">
      <CardHeader className="group-hover:text-pink-500 transition-colors duration-300">
        <CardTitle className="text-lg text-primary group-hover:text-pink-500 transition-colors duration-300">
          <a href={story.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
            {story.title}
          </a>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>{format(new Date(story.created_at), 'MMM d, yyyy')}</span>
          </div>
          <div className="flex items-center space-x-2">
            <MessageCircle className="h-4 w-4" />
            <span>{story.num_comments || 0} comments</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleVote}
              className="text-primary hover:text-pink-500"
            >
              <ThumbsUp className="h-4 w-4 mr-1" />
              {story.points}
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            asChild
            className="border-primary text-primary hover:bg-pink-500 hover:text-black hover:border-pink-500 transition-colors duration-300"
          >
            <a href={story.url} target="_blank" rel="noopener noreferrer">
              Visit <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NewsCard;
