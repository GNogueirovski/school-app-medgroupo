import React from 'react';
import { render, screen, fireEvent } from '../../../test-utils';
import { SchoolList } from './SchoolList';
import { School, Shift } from '../types';

const mockSchools: School[] = [
  {
    id: '1',
    name: 'E.E. Santos Dumont',
    address: 'Rua das Flores, 123',
    classCount: 3,
    shifts: [Shift.Morning, Shift.Afternoon],
  },
  {
    id: '2',
    name: 'E.M. Dom Pedro II',
    address: 'Av. Brasil, 456',
    classCount: 1,
    shifts: [Shift.Evening],
  },
];

describe('SchoolList', () => {
  it('renderiza um card para cada escola', () => {
    render(<SchoolList schools={mockSchools} onSchoolPress={() => {}} />);
    expect(screen.getByText('E.E. Santos Dumont')).toBeTruthy();
    expect(screen.getByText('E.M. Dom Pedro II')).toBeTruthy();
  });

  it('renderiza EmptyState quando lista está vazia', () => {
    render(<SchoolList schools={[]} onSchoolPress={() => {}} />);
    expect(screen.queryByTestId(/school-card/)).toBeNull();
    expect(screen.getByTestId('empty-state')).toBeTruthy();
    expect(screen.getByText('Nenhuma escola cadastrada ainda.')).toBeTruthy();
  });

  it('exibe CTA de EmptyState quando onAddSchool é fornecido', () => {
    const onAddSchool = jest.fn();
    render(<SchoolList schools={[]} onSchoolPress={() => {}} onAddSchool={onAddSchool} />);
    fireEvent.press(screen.getByTestId('empty-state-cta'));
    expect(onAddSchool).toHaveBeenCalledTimes(1);
  });

  it('chama onSchoolPress com a escola correta ao pressionar o card', () => {
    const onSchoolPress = jest.fn();
    render(<SchoolList schools={mockSchools} onSchoolPress={onSchoolPress} />);
    fireEvent.press(screen.getByTestId('school-card-1'));
    expect(onSchoolPress).toHaveBeenCalledWith(mockSchools[0]);
  });

  it('chama onSchoolPress com a escola correta para o segundo item', () => {
    const onSchoolPress = jest.fn();
    render(<SchoolList schools={mockSchools} onSchoolPress={onSchoolPress} />);
    fireEvent.press(screen.getByTestId('school-card-2'));
    expect(onSchoolPress).toHaveBeenCalledWith(mockSchools[1]);
  });
});
