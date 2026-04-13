import { act, renderHook, waitFor } from '@testing-library/react-native';
import { useClasses, useClassMutations } from './useClasses';
import { api } from '@/services/api';
import { Class } from '../types';
import { Shift } from '../../schools/types';
import { AllProviders } from '../../../test-utils';

jest.mock('@/services/api', () => ({
  api: { get: jest.fn(), post: jest.fn(), put: jest.fn(), delete: jest.fn() },
}));

const mockGet = api.get as jest.Mock;

const mockClasses: Class[] = [
  { id: '1', schoolId: '1', name: '1º A', shift: Shift.Morning, academicYear: 2024 },
  { id: '2', schoolId: '1', name: '2º B', shift: Shift.Afternoon, academicYear: 2024 },
];

describe('useClasses', () => {
  afterEach(() => jest.clearAllMocks());

  it('inicia com loading=true e lista vazia', async () => {
    mockGet.mockResolvedValueOnce(mockClasses);

    const { result } = renderHook(() => useClasses('school-1'), { wrapper: AllProviders });

    expect(result.current.loading).toBe(true);
    expect(result.current.classes).toEqual([]);

    await waitFor(() => expect(result.current.loading).toBe(false));
  });

  it('popula classes após fetch bem-sucedido', async () => {
    mockGet.mockResolvedValueOnce(mockClasses);

    const { result } = renderHook(() => useClasses('school-1'), { wrapper: AllProviders });

    await waitFor(() => expect(result.current.classes).toEqual(mockClasses));
    expect(result.current.error).toBeNull();
  });

  it('define error quando fetch falha', async () => {
    mockGet.mockRejectedValueOnce(new Error('network error'));

    const { result } = renderHook(() => useClasses('school-1'), { wrapper: AllProviders });

    await waitFor(() => expect(result.current.error).toBeTruthy());
    expect(result.current.classes).toEqual([]);
    expect(result.current.loading).toBe(false);
  });

  it('chama GET com o schoolId correto na query string', async () => {
    mockGet.mockResolvedValueOnce([]);

    renderHook(() => useClasses('school-1'), { wrapper: AllProviders });

    await waitFor(() => expect(mockGet).toHaveBeenCalledWith('/classes?schoolId=school-1'));
  });

  it('refaz o fetch quando schoolId muda', async () => {
    mockGet.mockResolvedValue([]);

    const { rerender } = renderHook(({ id }: { id: string }) => useClasses(id), {
      wrapper: AllProviders,
      initialProps: { id: 'school-1' },
    });

    await waitFor(() => expect(mockGet).toHaveBeenCalledWith('/classes?schoolId=school-1'));

    rerender({ id: 'school-2' });

    await waitFor(() => expect(mockGet).toHaveBeenCalledWith('/classes?schoolId=school-2'));
  });
});

describe('useClassMutations', () => {
  const mockPost = api.post as jest.Mock;
  const mockPut = api.put as jest.Mock;
  const mockDelete = api.delete as jest.Mock;

  afterEach(() => jest.clearAllMocks());

  const newClass: Class = { id: '3', schoolId: '1', name: '3º A', shift: Shift.Evening, academicYear: 2024 };

  function renderBoth() {
    return renderHook(
      () => ({ list: useClasses('school-1'), mutations: useClassMutations() }),
      { wrapper: AllProviders },
    );
  }

  it('createClass chama POST /classes e adiciona turma ao estado', async () => {
    mockGet.mockResolvedValueOnce([]);
    mockPost.mockResolvedValueOnce(newClass);

    const { result } = renderBoth();
    await waitFor(() => expect(result.current.list.loading).toBe(false));

    await act(async () => {
      await result.current.mutations.createClass({
        schoolId: '1',
        name: '3º A',
        shift: Shift.Evening,
        academicYear: 2024,
      });
    });

    expect(mockPost).toHaveBeenCalledWith('/classes', {
      schoolId: '1',
      name: '3º A',
      shift: Shift.Evening,
      academicYear: 2024,
    });
    expect(result.current.list.classes).toHaveLength(1);
    expect(result.current.list.classes[0]).toEqual(newClass);
  });

  it('updateClass chama PUT /classes/:id e atualiza turma no estado', async () => {
    mockGet.mockResolvedValueOnce(mockClasses);
    mockPut.mockResolvedValueOnce({});

    const { result } = renderBoth();
    await waitFor(() => expect(result.current.list.classes).toHaveLength(2));

    await act(async () => {
      await result.current.mutations.updateClass('1', {
        schoolId: '1',
        name: '1º B',
        shift: Shift.Evening,
        academicYear: 2025,
      });
    });

    expect(mockPut).toHaveBeenCalledWith('/classes/1', {
      schoolId: '1',
      name: '1º B',
      shift: Shift.Evening,
      academicYear: 2025,
    });
    const updated = result.current.list.classes.find((c) => c.id === '1');
    expect(updated?.name).toBe('1º B');
    expect(updated?.shift).toBe(Shift.Evening);
    expect(updated?.academicYear).toBe(2025);
  });

  it('deleteClass chama DELETE /classes/:id e remove turma do estado', async () => {
    mockGet.mockResolvedValueOnce(mockClasses);
    mockDelete.mockResolvedValueOnce({});

    const { result } = renderBoth();
    await waitFor(() => expect(result.current.list.classes).toHaveLength(2));

    await act(async () => {
      await result.current.mutations.deleteClass('1');
    });

    expect(mockDelete).toHaveBeenCalledWith('/classes/1');
    expect(result.current.list.classes).toHaveLength(1);
    expect(result.current.list.classes[0].id).toBe('2');
  });

  it('deleteClass lança erro quando DELETE falha', async () => {
    mockGet.mockResolvedValueOnce(mockClasses);
    mockDelete.mockRejectedValueOnce(new Error('server error'));

    const { result } = renderBoth();
    await waitFor(() => expect(result.current.list.classes).toHaveLength(2));

    await expect(
      act(async () => {
        await result.current.mutations.deleteClass('1');
      }),
    ).rejects.toThrow('server error');
  });
});
