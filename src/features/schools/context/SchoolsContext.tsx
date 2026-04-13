import React, { createContext, useContext, useState } from 'react';
import { School } from '../types';

interface SchoolsState {
  schools: School[];
  loading: boolean;
  error: string | null;
}

interface SchoolsContextValue extends SchoolsState {
  setSchools: React.Dispatch<React.SetStateAction<School[]>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

const SchoolsContext = createContext<SchoolsContextValue | null>(null);

export function SchoolsProvider({ children }: { children: React.ReactNode }) {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <SchoolsContext.Provider value={{ schools, loading, error, setSchools, setLoading, setError }}>
      {children}
    </SchoolsContext.Provider>
  );
}

export function useSchoolsContext(): SchoolsContextValue {
  const ctx = useContext(SchoolsContext);
  if (!ctx) throw new Error('useSchoolsContext must be used inside SchoolsProvider');
  return ctx;
}
