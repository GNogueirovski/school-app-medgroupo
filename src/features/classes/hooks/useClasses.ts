import { useCallback, useEffect } from 'react';
import { useClassesContext } from '../context/ClassesContext';
import { Class } from '../types';
import { api } from '@/services/api';

type ClassPayload = Omit<Class, 'id'>;

export function useClasses(schoolId: string) {
  const { classes, loading, error, setClasses, setLoading, setError } = useClassesContext();

  const fetchClasses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get<Class[]>(`/classes?schoolId=${schoolId}`);
      setClasses(data);
    } catch {
      setError('Não foi possível carregar as turmas.');
    } finally {
      setLoading(false);
    }
  }, [schoolId, setClasses, setLoading, setError]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  return { classes, loading, error, refresh: fetchClasses };
}

export function useClassMutations() {
  const { setClasses } = useClassesContext();

  const createClass = useCallback(
    async (data: ClassPayload): Promise<void> => {
      const created = await api.post<Class>('/classes', data);
      setClasses((prev) => [...prev, created]);
    },
    [setClasses],
  );

  const updateClass = useCallback(
    async (id: string, data: ClassPayload): Promise<void> => {
      await api.put(`/classes/${id}`, data);
      setClasses((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)));
    },
    [setClasses],
  );

  const deleteClass = useCallback(
    async (id: string): Promise<void> => {
      await api.delete(`/classes/${id}`);
      setClasses((prev) => prev.filter((c) => c.id !== id));
    },
    [setClasses],
  );

  return { createClass, updateClass, deleteClass };
}
