import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert } from '@/integrations/supabase/types';
import { useAuth } from '@/hooks/useAuth';

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
  citizenPhone?: string;
  location: {
    address: string;
    lat?: number;
    lng?: number;
  };
  media: string[];
  dateAcknowledged?: string;
  dateInProgress?: string;
  dateResolved?: string;
  publicNotes: Array<{ id: string; content: string; date: string; author: string }>;
  internalNotes: Array<{ id: string; content: string; date: string; author: string }>;
  assignedDepartment?: string;
}

interface ReportsContextType {
  reports: Report[];
  loading: boolean;
  error: string | null;
  addReport: (report: Omit<Report, 'id' | 'dateSubmitted'>) => Promise<string>;
  updateReport: (id: string, updates: Partial<Report>) => Promise<void>;
  getReportById: (id: string) => Report | undefined;
  addPublicNote: (reportId: string, content: string, author: string) => Promise<void>;
  addInternalNote: (reportId: string, content: string, author: string) => Promise<void>;
  uploadMedia: (file: File) => Promise<string>;
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
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

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
      citizenName: 'Anonymous',
      citizenEmail: '',
      location: {
        address: civicReport.location_address || '',
        lat: civicReport.location_lat || undefined,
        lng: civicReport.location_lng || undefined,
      },
      media: civicReport.photo_urls || [],
      publicNotes: JSON.parse(civicReport.public_notes || '[]'),
      internalNotes: JSON.parse(civicReport.staff_notes || '[]'),
      assignedDepartment: civicReport.assigned_department || undefined,
    };
  };

  // Load reports from Supabase
  const loadReports = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('civic_reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading reports:', error);
        setError('Failed to load reports');
        return;
      }

      const convertedReports = data.map(convertFromSupabase);
      setReports(convertedReports);
    } catch (error) {
      console.error('Error loading reports:', error);
      setError('Failed to load reports');
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
        photo_urls: reportData.media,
        public_notes: JSON.stringify(reportData.publicNotes || []),
        staff_notes: JSON.stringify(reportData.internalNotes || []),
        assigned_department: reportData.assignedDepartment,
        user_id: user?.id || null, // Use authenticated user ID or null for anonymous users
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
      newReport.citizenPhone = reportData.citizenPhone;
      setReports(prev => [newReport, ...prev]);
      return data.id;
    } catch (error) {
      console.error('Error adding report:', error);
      throw error;
    }
  };

  const uploadMedia = async (file: File): Promise<string> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `reports/${fileName}`;

      const { data, error } = await supabase.storage
        .from('report-media')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('report-media')
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading media:', error);
      throw error;
    }
  };

  const updateReport = async (id: string, updates: Partial<Report>): Promise<void> => {
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
        throw error;
      }

      setReports(prev => 
        prev.map(report => 
          report.id === id ? { ...report, ...updates } : report
        )
      );
    } catch (error) {
      console.error('Error updating report:', error);
      throw error;
    }
  };

  const addPublicNote = async (reportId: string, content: string, author: string): Promise<void> => {
    const report = reports.find(r => r.id === reportId);
    if (!report) return;

    const newNote = {
      id: crypto.randomUUID(),
      content,
      date: new Date().toISOString(),
      author,
    };

    const updatedNotes = [...report.publicNotes, newNote];
    await updateReport(reportId, { publicNotes: updatedNotes });
  };

  const addInternalNote = async (reportId: string, content: string, author: string): Promise<void> => {
    const report = reports.find(r => r.id === reportId);
    if (!report) return;

    const newNote = {
      id: crypto.randomUUID(),
      content,
      date: new Date().toISOString(),
      author,
    };

    const updatedNotes = [...report.internalNotes, newNote];
    await updateReport(reportId, { internalNotes: updatedNotes });
  };

  const getReportById = (id: string): Report | undefined => {
    return reports.find(report => report.id === id);
  };

  return (
    <ReportsContext.Provider value={{ 
      reports, 
      loading, 
      error,
      addReport, 
      updateReport, 
      getReportById,
      addPublicNote,
      addInternalNote,
      uploadMedia
    }}>
      {children}
    </ReportsContext.Provider>
  );
};