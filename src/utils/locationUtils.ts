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

// Reverse geocoding to convert coordinates to address
export const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
  try {
    const response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=YOUR_API_KEY&pretty=1&no_annotations=1`
    );
    
    if (!response.ok) {
      throw new Error('Geocoding service unavailable');
    }
    
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      return data.results[0].formatted || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
    
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  } catch (error) {
    // Fallback to coordinates if geocoding fails
    return formatLocationText(lat, lng);
  }
};

// Enhanced location display with async address resolution
export const getLocationDisplayAsync = async (report: any): Promise<string> => {
  // First try existing address fields
  if (report.location_address && report.location_address.trim() !== '') {
    return report.location_address;
  }
  
  if (report.location?.address && report.location.address.trim() !== '') {
    return report.location.address;
  }
  
  // Try to geocode coordinates
  if (report.location_lat && report.location_lng) {
    return await reverseGeocode(report.location_lat, report.location_lng);
  }
  
  if (report.location?.lat && report.location?.lng) {
    return await reverseGeocode(report.location.lat, report.location.lng);
  }
  
  return 'Location not specified';
};