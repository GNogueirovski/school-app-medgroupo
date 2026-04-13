import React from 'react';
import { render, screen, fireEvent } from '../../../test-utils';
import { ClassList } from './ClassList';
import { Class } from '../types';
import { Shift } from '../../schools/types';

const mockClasses: Class[] = [
  { id: '1', schoolId: 'school-1', name: '1º A', shift: Shift.Morning, academicYear: 2024 },
  { id: '2', schoolId: 'school-1', name: '2º B', shift: Shift.Evening, academicYear: 2024 },
];

describe('ClassList', () => {
  it('renderiza um card para cada turma', () => {
    render(<ClassList classes={mockClasses} onEdit={() => {}} onDelete={() => {}} />);
    expect(screen.getByText('1º A')).toBeTruthy();
    expect(screen.getByText('2º B')).toBeTruthy();
  });

  it('renderiza EmptyState quando lista está vazia', () => {
    render(<ClassList classes={[]} onEdit={() => {}} onDelete={() => {}} />);
    expect(screen.queryByTestId(/class-card/)).toBeNull();
    expect(screen.getByTestId('empty-state')).toBeTruthy();
    expect(screen.getByText('Nenhuma turma cadastrada ainda.')).toBeTruthy();
  });

  it('exibe CTA de EmptyState quando onAddClass é fornecido', () => {
    const onAddClass = jest.fn();
    render(<ClassList classes={[]} onEdit={() => {}} onDelete={() => {}} onAddClass={onAddClass} />);
    fireEvent.press(screen.getByTestId('empty-state-cta'));
    expect(onAddClass).toHaveBeenCalledTimes(1);
  });

  it('chama onEdit com a turma correta', () => {
    const onEdit = jest.fn();
    render(<ClassList classes={mockClasses} onEdit={onEdit} onDelete={() => {}} />);
    fireEvent.press(screen.getByTestId('edit-class-1'));
    expect(onEdit).toHaveBeenCalledWith(mockClasses[0]);
  });

  it('chama onDelete com a turma correta', () => {
    const onDelete = jest.fn();
    render(<ClassList classes={mockClasses} onEdit={() => {}} onDelete={onDelete} />);
    fireEvent.press(screen.getByTestId('delete-class-2'));
    expect(onDelete).toHaveBeenCalledWith(mockClasses[1]);
  });
});
