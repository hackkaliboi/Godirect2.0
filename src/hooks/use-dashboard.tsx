
import { useState, createContext, useContext, ReactNode } from 'react';

type DashboardContextType = {
  activePage: string;
  setActivePage: (page: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
};

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [activePage, setActivePage] = useState<string>('dashboard');
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <DashboardContext.Provider value={{ 
      activePage, 
      setActivePage,
      loading,
      setLoading
    }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  
  return context;
};
