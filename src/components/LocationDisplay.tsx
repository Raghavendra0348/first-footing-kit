import { useState, useEffect } from 'react';
import { getLocationDisplay, getLocationDisplayAsync } from '@/utils/locationUtils';

interface LocationDisplayProps {
  report: any;
  className?: string;
}

export const LocationDisplay = ({ report, className = '' }: LocationDisplayProps) => {
  const [address, setAddress] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadAddress = async () => {
      // First show the fallback location
      setAddress(getLocationDisplay(report));
      
      // Then try to get better address if coordinates are available
      if ((report.location_lat && report.location_lng) || (report.location?.lat && report.location?.lng)) {
        setLoading(true);
        try {
          const betterAddress = await getLocationDisplayAsync(report);
          setAddress(betterAddress);
        } catch (error) {
          console.error('Failed to get address:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadAddress();
  }, [report]);

  return (
    <span className={`${className} ${loading ? 'opacity-75' : ''}`}>
      📍 {address}
    </span>
  );
};