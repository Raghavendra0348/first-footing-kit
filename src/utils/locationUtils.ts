// Utility functions for handling location display

export const formatLocationText = (lat: number, lng: number, address?: string): string => {
  if (address && address.trim() !== '') {
    return address;
  }
  
  // Convert coordinates to a more readable format
  const latDir = lat >= 0 ? 'N' : 'S';
  const lngDir = lng >= 0 ? 'E' : 'W';
  
  const latAbs = Math.abs(lat).toFixed(4);
  const lngAbs = Math.abs(lng).toFixed(4);
  
  return `${latAbs}°${latDir}, ${lngAbs}°${lngDir}`;
};

export const getLocationDisplay = (report: any): string => {
  if (report.location_address && report.location_address.trim() !== '') {
    return report.location_address;
  }
  
  if (report.location?.address && report.location.address.trim() !== '') {
    return report.location.address;
  }
  
  if (report.location_lat && report.location_lng) {
    return formatLocationText(report.location_lat, report.location_lng);
  }
  
  if (report.location?.lat && report.location?.lng) {
    return formatLocationText(report.location.lat, report.location.lng);
  }
  
  return 'Location not specified';
};

export const generateShortId = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};