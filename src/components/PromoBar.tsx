import { useState } from 'react';
import { X, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const PromoBar = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-promo text-white px-4 py-2 text-sm relative">
      <div className="container mx-auto flex items-center justify-center space-x-2">
        <Zap className="w-4 h-4" />
        <span className="font-medium">🚀 Discover the new CivicReport - AI-powered issue tracking for citizens</span>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-white hover:bg-white/20 ml-4"
        >
          View Features
        </Button>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/20 rounded transition-colors"
        aria-label="Dismiss announcement"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};