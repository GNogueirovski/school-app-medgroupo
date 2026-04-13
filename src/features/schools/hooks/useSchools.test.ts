import { act, renderHook, waitFor } from '@testing-library/react-native';
import { useSchools, useSchoolMutations } from './useSchools';
import { api } from '@/services/api';
import { School, Shift } from '../types';
import { AllProviders } from '../../../test-utils';

jest.mock('@/services/api', () => ({
  api: { get: jest.fn(), post: jest.fn(), put: jest.fn(), delete: jest.fn() },
}));

const mockGet = api.get as jest.Mock;

const mockSchools: School[] = [
  { id: '1', name: 'E.E. Santos Dumont', address: 'Rua das Flores, 123', classCount: 3, shifts: [Shift.Morning] },
  { id: '2', name: 'E.M. Dom Pedro II', address: 'Av. Brasil, 456', classCount: 1, shifts: [Shift.Evening] },
];

describe('useSchools', () => {
  afterEach(() => jest.clearAllMocks());

  it('inicia com loading=true e lista vazia', async () => {
    mockGet.mockResolvedValueOnce(mockSchools);

    const { result } = renderHook(() => useSchools(), { wrapper: AllProviders });

    expect(result.current.loading).toBe(true);
    expect(result.current.schools).toEqual([]);

    await waitFor(() => expect(result.current.loading).toBe(false));
  });

  it('popula schools após fetch bem-sucedido', async () => {
    mockGet.mockResolvedValueOnce(mockSchools);

    const { result } = renderHook(() => useSchools(), { wrapper: AllProviders });

    await waitFor(() => expect(result.current.schools).toEqual(mockSchools));
    expect(result.current.error).toBeNull();
  });

  it('define error e mantém lista vazia quando fetch falha', async () => {
    mockGet.mockRejectedValueOnce(new Error('network error'));

    const { result } = renderHook(() => useSchools(), { wrapper: AllProviders });

    await waitFor(() => expect(result.current.error).toBeTruthy());
    expect(result.current.schools).toEqual([]);
    expect(result.current.loading).toBe(false);
  });

  it('chama GET /schools com o caminho correto', async () => {
    mockGet.mockResolvedValueOnce([]);

    renderHook(() => useSchools(), { wrapper: AllProviders });

    await waitFor(() => expect(mockGet).toHaveBeenCalledWith('/schools'));
  });

  it('limpa o error ao fazer refresh com sucesso', async () => {
    mockGet
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValueOnce(mockSchools);

    const { result } = renderHook(() => useSchools(), { wrapper: AllProviders });

    await waitFor(() => expect(result.current.error).toBeTruthy());

    await result.current.refresh();

    await waitFor(() => expect(result.current.error).toBeNull());
    expect(result.current.schools).toEqual(mockSchools);
  });
});

describe('useSchoolMutations', () => {
  const mockPost = api.post as jest.Mock;
  const mockPut = api.put as jest.Mock;
  const mockDelete = api.delete as jest.Mock;

  afterEach(() => jest.clearAllMocks());

  function renderBoth() {
    return renderHook(
      () => ({ list: useSchools(), mutations: useSchoolMutations() }),
      { wrapper: AllProviders },
    );
  }

  it('createSchool chama POST /schools e adiciona escola ao estado', async () => {
    mockGet.mockResolvedValueOnce([]);
    mockPost.mockResolvedValueOnce({ id: '3', name: 'Nova Escola', address: 'Rua Nova, 1' });

    const { result } = renderBoth();
    await waitFor(() => expect(result.current.list.loading).toBe(false));

    await act(async () => {
      await result.current.mutations.createSchool({ name: 'Nova Escola', address: 'Rua Nova, 1' });
    });

    expect(mockPost).toHaveBeenCalledWith('/schools', { name: 'Nova Escola', address: 'Rua Nova, 1' });
    expect(result.current.list.schools).toHaveLength(1);
    expect(result.current.list.schools[0]).toMatchObject({
      id: '3',
      name: 'Nova Escola',
      address: 'Rua Nova, 1',
      classCount: 0,
      shifts: [],
    });
  });

  it('updateSchool chama PUT /schools/:id e atualiza escola no estado', async () => {
    mockGet.mockResolvedValueOnce(mockSchools);
    mockPut.mockResolvedValueOnce({});

    const { result } = renderBoth();
    await waitFor(() => expect(result.current.list.schools).toHaveLength(2));

    await act(async () => {
      await result.current.mutations.updateSchool('1', { name: 'Escola Atualizada', address: 'Rua Nova, 99' });
    });

    expect(mockPut).toHaveBeenCalledWith('/schools/1', { name: 'Escola Atualizada', address: 'Rua Nova, 99' });
    const updated = result.current.list.schools.find((s) => s.id === '1');
    expect(updated?.name).toBe('Escola Atualizada');
    expect(updated?.address).toBe('Rua Nova, 99');
  });

  it('deleteSchool chama DELETE /schools/:id e remove escola do estado', async () => {
    mockGet.mockResolvedValueOnce(mockSchools);
    mockDelete.mockResolvedValueOnce({});

    const { result } = renderBoth();
    await waitFor(() => expect(result.current.list.schools).toHaveLength(2));

    await act(async () => {
      await result.current.mutations.deleteSchool('1');
    });

    expect(mockDelete).toHaveBeenCalledWith('/schools/1');
    expect(result.current.list.schools).toHaveLength(1);
    expect(result.current.list.schools[0].id).toBe('2');
  });

  it('createSchool lança erro quando POST falha', async () => {
    mockGet.mockResolvedValueOnce([]);
    mockPost.mockRejectedValueOnce(new Error('server error'));

    const { result } = renderBoth();
    await waitFor(() => expect(result.current.list.loading).toBe(false));

    await expect(
      act(async () => {
        await result.current.mutations.createSchool({ name: 'X', address: 'Y' });
      }),
    ).rejects.toThrow('server error');
  });
});
