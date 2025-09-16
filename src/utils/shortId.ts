export const generateShortId = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const getShortId = (fullId: string): string => {
  // Extract first 6 characters of UUID for display
  return fullId.substring(0, 6).toUpperCase();
};