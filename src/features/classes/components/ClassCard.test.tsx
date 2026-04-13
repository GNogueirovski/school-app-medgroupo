import React from 'react';
import { render, screen, fireEvent } from '../../../test-utils';
import { ClassCard } from './ClassCard';
import { Class } from '../types';
import { Shift } from '../../schools/types';

const mockClass: Class = {
  id: '1',
  schoolId: 'school-1',
  name: '1º A',
  shift: Shift.Morning,
  academicYear: 2024,
};

describe('ClassCard', () => {
  it('exibe o nome da turma', () => {
    render(<ClassCard classItem={mockClass} onEdit={() => {}} onDelete={() => {}} />);
    expect(screen.getByText('1º A')).toBeTruthy();
  });

  it('exibe o ano letivo', () => {
    render(<ClassCard classItem={mockClass} onEdit={() => {}} onDelete={() => {}} />);
    expect(screen.getByText('2024')).toBeTruthy();
  });

  it('exibe o badge do turno correto', () => {
    render(<ClassCard classItem={mockClass} onEdit={() => {}} onDelete={() => {}} />);
    expect(screen.getByText('Matutino')).toBeTruthy();
  });

  it('exibe badge Vespertino para turno Afternoon', () => {
    const classItem = { ...mockClass, shift: Shift.Afternoon };
    render(<ClassCard classItem={classItem} onEdit={() => {}} onDelete={() => {}} />);
    expect(screen.getByText('Vespertino')).toBeTruthy();
  });

  it('chama onEdit ao pressionar "Editar"', () => {
    const onEdit = jest.fn();
    render(<ClassCard classItem={mockClass} onEdit={onEdit} onDelete={() => {}} />);
    fireEvent.press(screen.getByTestId('edit-class-1'));
    expect(onEdit).toHaveBeenCalledTimes(1);
  });

  it('chama onDelete ao pressionar "Excluir"', () => {
    const onDelete = jest.fn();
    render(<ClassCard classItem={mockClass} onEdit={() => {}} onDelete={onDelete} />);
    fireEvent.press(screen.getByTestId('delete-class-1'));
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it('onEdit e onDelete são independentes', () => {
    const onEdit = jest.fn();
    const onDelete = jest.fn();
    render(<ClassCard classItem={mockClass} onEdit={onEdit} onDelete={onDelete} />);
    fireEvent.press(screen.getByTestId('edit-class-1'));
    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onDelete).not.toHaveBeenCalled();
  });
});
