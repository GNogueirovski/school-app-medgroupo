import React, { createContext, useContext, useState } from 'react';
import { Class } from '../types';

interface ClassesState {
  classes: Class[];
  loading: boolean;
  error: string | null;
}

interface ClassesContextValue extends ClassesState {
  setClasses: React.Dispatch<React.SetStateAction<Class[]>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

const ClassesContext = createContext<ClassesContextValue | null>(null);

export function ClassesProvider({ children }: { children: React.ReactNode }) {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <ClassesContext.Provider value={{ classes, loading, error, setClasses, setLoading, setError }}>
      {children}
    </ClassesContext.Provider>
  );
}

export function useClassesContext(): ClassesContextValue {
  const ctx = useContext(ClassesContext);
  if (!ctx) throw new Error('useClassesContext must be used inside ClassesProvider');
  return ctx;
}
