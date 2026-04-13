import { renderHook, act } from '@testing-library/react-native';
import { useSchoolActions } from './useSchoolActions';

const mockToastShow = jest.fn();
const mockCreateSchool = jest.fn();
const mockUpdateSchool = jest.fn();
const mockDeleteSchool = jest.fn();

jest.mock('@gluestack-ui/themed', () => ({
  ...jest.requireActual('@gluestack-ui/themed'),
  useToast: () => ({ show: mockToastShow }),
}));

jest.mock('./useSchools', () => ({
  useSchoolMutations: () => ({
    createSchool: mockCreateSchool,
    updateSchool: mockUpdateSchool,
    deleteSchool: mockDeleteSchool,
  }),
}));

describe('useSchoolActions', () => {
  afterEach(() => jest.clearAllMocks());

  it('create chama createSchool e depois toast.show', async () => {
    mockCreateSchool.mockResolvedValueOnce(undefined);
    const { result } = renderHook(() => useSchoolActions());

    await act(async () => {
      await result.current.create({ name: 'Escola X', address: 'Rua A, 1' });
    });

    expect(mockCreateSchool).toHaveBeenCalledWith({ name: 'Escola X', address: 'Rua A, 1' });
    expect(mockToastShow).toHaveBeenCalledTimes(1);
    expect(mockToastShow).toHaveBeenCalledWith(expect.objectContaining({ placement: 'bottom' }));
  });

  it('create não chama toast.show quando createSchool falha', async () => {
    mockCreateSchool.mockRejectedValueOnce(new Error('fail'));
    const { result } = renderHook(() => useSchoolActions());

    await expect(
      act(async () => {
        await result.current.create({ name: 'X', address: 'Y' });
      }),
    ).rejects.toThrow('fail');

    expect(mockToastShow).not.toHaveBeenCalled();
  });

  it('update chama updateSchool e depois toast.show', async () => {
    mockUpdateSchool.mockResolvedValueOnce(undefined);
    const { result } = renderHook(() => useSchoolActions());

    await act(async () => {
      await result.current.update('1', { name: 'Atualizada', address: 'Rua B, 2' });
    });

    expect(mockUpdateSchool).toHaveBeenCalledWith('1', { name: 'Atualizada', address: 'Rua B, 2' });
    expect(mockToastShow).toHaveBeenCalledTimes(1);
  });

  it('remove chama deleteSchool e depois toast.show', async () => {
    mockDeleteSchool.mockResolvedValueOnce(undefined);
    const { result } = renderHook(() => useSchoolActions());

    await act(async () => {
      await result.current.remove('1');
    });

    expect(mockDeleteSchool).toHaveBeenCalledWith('1');
    expect(mockToastShow).toHaveBeenCalledTimes(1);
  });
});
