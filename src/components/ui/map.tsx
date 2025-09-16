import React from 'react';
import { MapPin } from 'lucide-react';

interface MapProps {
  address: string;
  className?: string;
}

export const Map: React.FC<MapProps> = ({ address, className = "" }) => {
  // For now, show a simple map placeholder
  // In a real implementation, you would integrate with Google Maps or similar
  return (
    <div className={`bg-muted rounded-lg p-4 flex items-center justify-center min-h-[200px] ${className}`}>
      <div className="text-center">
        <MapPin className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Map view not available</p>
        <p className="text-xs text-muted-foreground mt-1">{address}</p>
      </div>
    </div>
  );
};