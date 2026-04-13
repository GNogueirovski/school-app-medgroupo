import { renderHook, act } from '@testing-library/react-native';
import { useClassActions } from './useClassActions';
import { Shift } from '@/features/schools/types';

const mockToastShow = jest.fn();
const mockCreateClass = jest.fn();
const mockUpdateClass = jest.fn();
const mockDeleteClass = jest.fn();

jest.mock('@gluestack-ui/themed', () => ({
  ...jest.requireActual('@gluestack-ui/themed'),
  useToast: () => ({ show: mockToastShow }),
}));

jest.mock('./useClasses', () => ({
  useClassMutations: () => ({
    createClass: mockCreateClass,
    updateClass: mockUpdateClass,
    deleteClass: mockDeleteClass,
  }),
}));

const classPayload = { schoolId: '1', name: '1º A', shift: Shift.Morning, academicYear: 2024 };

describe('useClassActions', () => {
  afterEach(() => jest.clearAllMocks());

  it('create chama createClass e depois toast.show', async () => {
    mockCreateClass.mockResolvedValueOnce(undefined);
    const { result } = renderHook(() => useClassActions());

    await act(async () => {
      await result.current.create(classPayload);
    });

    expect(mockCreateClass).toHaveBeenCalledWith(classPayload);
    expect(mockToastShow).toHaveBeenCalledTimes(1);
    expect(mockToastShow).toHaveBeenCalledWith(expect.objectContaining({ placement: 'bottom' }));
  });

  it('create não chama toast.show quando createClass falha', async () => {
    mockCreateClass.mockRejectedValueOnce(new Error('fail'));
    const { result } = renderHook(() => useClassActions());

    await expect(
      act(async () => {
        await result.current.create(classPayload);
      }),
    ).rejects.toThrow('fail');

    expect(mockToastShow).not.toHaveBeenCalled();
  });

  it('update chama updateClass e depois toast.show', async () => {
    mockUpdateClass.mockResolvedValueOnce(undefined);
    const { result } = renderHook(() => useClassActions());

    await act(async () => {
      await result.current.update('1', classPayload);
    });

    expect(mockUpdateClass).toHaveBeenCalledWith('1', classPayload);
    expect(mockToastShow).toHaveBeenCalledTimes(1);
  });

  it('remove chama deleteClass e depois toast.show', async () => {
    mockDeleteClass.mockResolvedValueOnce(undefined);
    const { result } = renderHook(() => useClassActions());

    await act(async () => {
      await result.current.remove('1');
    });

    expect(mockDeleteClass).toHaveBeenCalledWith('1');
    expect(mockToastShow).toHaveBeenCalledTimes(1);
  });
});
