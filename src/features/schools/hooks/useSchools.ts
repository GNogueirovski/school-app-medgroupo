import { useCallback, useEffect } from 'react';
import { useSchoolsContext } from '../context/SchoolsContext';
import { School } from '../types';
import { api } from '@/services/api';

type SchoolPayload = { name: string; address: string };

export function useSchoolById(id: string): School | undefined {
  const { schools } = useSchoolsContext();
  return schools.find((s) => s.id === id);
}

export function useSchools() {
  const { schools, loading, error, setSchools, setLoading, setError } = useSchoolsContext();

  const fetchSchools = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get<School[]>('/schools');
      setSchools(data);
    } catch {
      setError('Não foi possível carregar as escolas.');
    } finally {
      setLoading(false);
    }
  }, [setSchools, setLoading, setError]);

  useEffect(() => {
    fetchSchools();
  }, [fetchSchools]);

  return { schools, loading, error, refresh: fetchSchools };
}

export function useSchoolMutations() {
  const { setSchools } = useSchoolsContext();

  const createSchool = useCallback(
    async (data: SchoolPayload): Promise<void> => {
      const created = await api.post<{ id: string; name: string; address: string }>('/schools', data);
      setSchools((prev) => [...prev, { ...created, classCount: 0, shifts: [] }]);
    },
    [setSchools],
  );

  const updateSchool = useCallback(
    async (id: string, data: SchoolPayload): Promise<void> => {
      await api.put(`/schools/${id}`, data);
      setSchools((prev) => prev.map((s) => (s.id === id ? { ...s, ...data } : s)));
    },
    [setSchools],
  );

  const deleteSchool = useCallback(
    async (id: string): Promise<void> => {
      await api.delete(`/schools/${id}`);
      setSchools((prev) => prev.filter((s) => s.id !== id));
    },
    [setSchools],
  );

  return { createSchool, updateSchool, deleteSchool };
}
