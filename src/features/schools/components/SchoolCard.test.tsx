import React from 'react';
import { render, screen, fireEvent } from '../../../test-utils';
import { SchoolCard } from './SchoolCard';
import { School, Shift } from '../types';

const mockSchool: School = {
  id: '1',
  name: 'E.E. Santos Dumont',
  address: 'Rua das Flores, 123 - Centro',
  classCount: 3,
  shifts: [Shift.Morning, Shift.Afternoon],
};

describe('SchoolCard', () => {
  it('exibe o nome da escola', () => {
    render(<SchoolCard school={mockSchool} onPress={() => {}} />);
    expect(screen.getByText('E.E. Santos Dumont')).toBeTruthy();
  });

  it('exibe o endereço da escola', () => {
    render(<SchoolCard school={mockSchool} onPress={() => {}} />);
    expect(screen.getByText('Rua das Flores, 123 - Centro')).toBeTruthy();
  });

  it('exibe a contagem de turmas no plural', () => {
    render(<SchoolCard school={mockSchool} onPress={() => {}} />);
    expect(screen.getByText('3 turmas')).toBeTruthy();
  });

  it('exibe "turma" no singular quando há apenas 1', () => {
    const school = { ...mockSchool, classCount: 1 };
    render(<SchoolCard school={school} onPress={() => {}} />);
    expect(screen.getByText('1 turma')).toBeTruthy();
  });

  it('exibe um badge para cada turno', () => {
    render(<SchoolCard school={mockSchool} onPress={() => {}} />);
    expect(screen.getByText('Matutino')).toBeTruthy();
    expect(screen.getByText('Vespertino')).toBeTruthy();
  });

  it('chama onPress ao ser pressionado', () => {
    const onPress = jest.fn();
    render(<SchoolCard school={mockSchool} onPress={onPress} />);
    fireEvent.press(screen.getByTestId('school-card-1'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('não renderiza badges de turnos ausentes', () => {
    const school = { ...mockSchool, shifts: [Shift.Evening] };
    render(<SchoolCard school={school} onPress={() => {}} />);
    expect(screen.queryByText('Matutino')).toBeNull();
    expect(screen.queryByText('Vespertino')).toBeNull();
    expect(screen.getByText('Noturno')).toBeTruthy();
  });
});
