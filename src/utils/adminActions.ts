import { supabase } from '@/integrations/supabase/client';

export const getAddressFromLocation = async (location_address?: string, location_lat?: number, location_lng?: number): Promise<string> => {
  // If we have an address, use it
  if (location_address && location_address.trim() !== '') {
    return location_address;
  }
  
  // If we have coordinates, convert them to address
  if (location_lat && location_lng) {
    try {
      // Use OpenCage Geocoding API for demo (free tier)
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${location_lat}+${location_lng}&key=demo&limit=1`
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          return data.results[0].formatted;
        }
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }
    
    // Fallback to coordinate display
    return `${location_lat.toFixed(4)}, ${location_lng.toFixed(4)}`;
  }
  
  return 'Location not specified';
};

export const sendEmailToCitizen = async (reportId: string, citizenEmail: string, subject: string, message: string) => {
  try {
    // This would integrate with an email service like Resend
    console.log('Sending email to:', citizenEmail);
    console.log('Subject:', subject);
    console.log('Message:', message);
    
    // For demo purposes, just show success
    return { success: true };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error };
  }
};

export const generateReportPDF = async (reportId: string) => {
  try {
    // This would generate a PDF report
    console.log('Generating PDF for report:', reportId);
    
    // For demo purposes, just download a simple text file
    const reportData = await supabase
      .from('civic_reports')
      .select('*')
      .eq('id', reportId)
      .single();
    
    if (reportData.data) {
      const content = `Report ID: ${reportId}\nTitle: ${reportData.data.title}\nDescription: ${reportData.data.description}\nStatus: ${reportData.data.status}`;
      const blob = new Blob([content], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report-${reportId.substring(0, 6)}.txt`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
    
    return { success: true };
  } catch (error) {
    console.error('PDF generation error:', error);
    return { success: false, error };
  }
};