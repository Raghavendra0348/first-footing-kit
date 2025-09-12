import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert } from '@/integrations/supabase/types';

type CivicReport = Tables<'civic_reports'>;

interface Report {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  dateSubmitted: string;
  citizenName: string;
  citizenEmail: string;
  location: {
    address: string;
    lat?: number;
    lng?: number;
  };
  photos: string[];
  publicNotes: Array<{ id: string; content: string; date: string; author: string }>;
  internalNotes: Array<{ id: string; content: string; date: string; author: string }>;
  assignedDepartment?: string;
}

interface ReportsContextType {
  reports: Report[];
  loading: boolean;
  addReport: (report: Omit<Report, 'id' | 'dateSubmitted'>) => Promise<string>;
  updateReport: (id: string, updates: Partial<Report>) => void;
  getReportById: (id: string) => Report | undefined;
}

const ReportsContext = createContext<ReportsContextType | undefined>(undefined);

export const useReports = () => {
  const context = useContext(ReportsContext);
  if (!context) {
    throw new Error('useReports must be used within a ReportsProvider');
  }
  return context;
};

export const ReportsProvider = ({ children }: { children: ReactNode }) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  // Convert Supabase data to our Report format
  const convertFromSupabase = (civicReport: CivicReport): Report => {
    return {
      id: civicReport.id,
      title: civicReport.title,
      description: civicReport.description,
      category: civicReport.category,
      priority: civicReport.priority,
      status: civicReport.status,
      dateSubmitted: civicReport.created_at,
      citizenName: 'Anonymous', // We'll enhance this when auth is added
      citizenEmail: '',
      location: {
        address: civicReport.location_address || '',
        lat: civicReport.location_lat || undefined,
        lng: civicReport.location_lng || undefined,
      },
      photos: civicReport.photo_urls || [],
      publicNotes: JSON.parse(civicReport.public_notes || '[]'),
      internalNotes: JSON.parse(civicReport.staff_notes || '[]'),
      assignedDepartment: civicReport.assigned_department || undefined,
    };
  };

  // Load reports from Supabase
  const loadReports = async () => {
    try {
      const { data, error } = await supabase
        .from('civic_reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading reports:', error);
        return;
      }

      const convertedReports = data.map(convertFromSupabase);
      setReports(convertedReports);
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const addReport = async (reportData: Omit<Report, 'id' | 'dateSubmitted'>): Promise<string> => {
    try {
      const insertData: TablesInsert<'civic_reports'> = {
        title: reportData.title,
        description: reportData.description,
        category: reportData.category,
        priority: reportData.priority,
        location_address: reportData.location.address,
        location_lat: reportData.location.lat,
        location_lng: reportData.location.lng,
        photo_urls: reportData.photos,
        public_notes: JSON.stringify(reportData.publicNotes || []),
        staff_notes: JSON.stringify(reportData.internalNotes || []),
        assigned_department: reportData.assignedDepartment,
        user_id: crypto.randomUUID(), // Generate a UUID for anonymous users
        status: 'submitted',
      };

      const { data, error } = await supabase
        .from('civic_reports')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('Error adding report:', error);
        throw error;
      }

      const newReport = convertFromSupabase(data);
      // Update with the actual citizen info from the form data
      newReport.citizenName = reportData.citizenName;
      newReport.citizenEmail = reportData.citizenEmail;
      setReports(prev => [newReport, ...prev]);
      return data.id;
    } catch (error) {
      console.error('Error adding report:', error);
      throw error;
    }
  };

  const updateReport = async (id: string, updates: Partial<Report>) => {
    try {
      const updateData: any = {};
      
      if (updates.title) updateData.title = updates.title;
      if (updates.description) updateData.description = updates.description;
      if (updates.status) updateData.status = updates.status;
      if (updates.priority) updateData.priority = updates.priority;
      if (updates.assignedDepartment) updateData.assigned_department = updates.assignedDepartment;
      if (updates.publicNotes) updateData.public_notes = JSON.stringify(updates.publicNotes);
      if (updates.internalNotes) updateData.staff_notes = JSON.stringify(updates.internalNotes);
      
      const { error } = await supabase
        .from('civic_reports')
        .update(updateData)
        .eq('id', id);

      if (error) {
        console.error('Error updating report:', error);
        return;
      }

      setReports(prev => 
        prev.map(report => 
          report.id === id ? { ...report, ...updates } : report
        )
      );
    } catch (error) {
      console.error('Error updating report:', error);
    }
  };

  const getReportById = (id: string): Report | undefined => {
    return reports.find(report => report.id === id);
  };

  return (
    <ReportsContext.Provider value={{ reports, loading, addReport, updateReport, getReportById }}>
      {children}
    </ReportsContext.Provider>
  );
};