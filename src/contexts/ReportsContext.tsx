import React, { createContext, useContext, useState, ReactNode } from 'react';
import { mockReports, Report } from '@/data/mockData';

interface ReportsContextType {
  reports: Report[];
  addReport: (report: Omit<Report, 'id' | 'dateSubmitted'>) => string;
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
  const [reports, setReports] = useState<Report[]>(mockReports);

  const addReport = (reportData: Omit<Report, 'id' | 'dateSubmitted'>): string => {
    const newId = `RPT-2024-${String(reports.length + 1).padStart(3, '0')}`;
    const newReport: Report = {
      ...reportData,
      id: newId,
      dateSubmitted: new Date().toISOString(),
      status: 'submitted',
      publicNotes: [],
      internalNotes: []
    };
    
    setReports(prev => [newReport, ...prev]);
    return newId;
  };

  const updateReport = (id: string, updates: Partial<Report>) => {
    setReports(prev => 
      prev.map(report => 
        report.id === id ? { ...report, ...updates } : report
      )
    );
  };

  const getReportById = (id: string): Report | undefined => {
    return reports.find(report => report.id === id);
  };

  return (
    <ReportsContext.Provider value={{ reports, addReport, updateReport, getReportById }}>
      {children}
    </ReportsContext.Provider>
  );
};