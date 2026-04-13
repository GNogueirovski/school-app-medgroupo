import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../../test-utils';
import { ClassForm } from './ClassForm';
import { Shift } from '@/features/schools/types';

const mockSubmit = jest.fn();
const mockCancel = jest.fn();

function renderForm(initialValues?: { name: string; shift: Shift; academicYear: number }) {
  return render(
    <ClassForm
      schoolId="school-1"
      initialValues={initialValues}
      onSubmit={mockSubmit}
      onCancel={mockCancel}
    />,
  );
}

describe('ClassForm', () => {
  beforeEach(() => {
    mockSubmit.mockReset();
    mockCancel.mockReset();
  });

  it('renderiza os campos de nome, turno e ano letivo', () => {
    renderForm();
    expect(screen.getByTestId('class-name-input')).toBeTruthy();
    expect(screen.getByTestId('class-shift-selector')).toBeTruthy();
    expect(screen.getByTestId('class-year-input')).toBeTruthy();
  });

  it('exibe "Criar turma" quando não há initialValues', () => {
    renderForm();
    expect(screen.getByText('Criar turma')).toBeTruthy();
  });

  it('exibe "Salvar alterações" quando há initialValues', () => {
    renderForm({ name: '1º A', shift: Shift.Morning, academicYear: 2024 });
    expect(screen.getByText('Salvar alterações')).toBeTruthy();
  });

  it('preenche campos com initialValues', () => {
    renderForm({ name: '2º B', shift: Shift.Afternoon, academicYear: 2024 });
    expect(screen.getByDisplayValue('2º B')).toBeTruthy();
    expect(screen.getByDisplayValue('2024')).toBeTruthy();
  });

  it('exibe os três turnos como opções', () => {
    renderForm();
    expect(screen.getByText('Matutino')).toBeTruthy();
    expect(screen.getByText('Vespertino')).toBeTruthy();
    expect(screen.getByText('Noturno')).toBeTruthy();
  });

  it('exibe erro quando nome está vazio', async () => {
    mockSubmit.mockResolvedValue(undefined);
    renderForm();
    fireEvent.press(screen.getByTestId('class-submit-button'));
    await waitFor(() => expect(screen.getByTestId('class-name-error')).toBeTruthy());
    expect(screen.getByText('Nome é obrigatório')).toBeTruthy();
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('exibe erro quando turno não selecionado', async () => {
    mockSubmit.mockResolvedValue(undefined);
    renderForm();
    fireEvent.changeText(screen.getByTestId('class-name-input'), '1º A');
    fireEvent.changeText(screen.getByTestId('class-year-input'), '2024');
    fireEvent.press(screen.getByTestId('class-submit-button'));
    await waitFor(() => expect(screen.getByTestId('class-shift-error')).toBeTruthy());
    expect(screen.getByText('Turno é obrigatório')).toBeTruthy();
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('exibe erro quando ano letivo é inválido', async () => {
    mockSubmit.mockResolvedValue(undefined);
    renderForm();
    fireEvent.changeText(screen.getByTestId('class-name-input'), '1º A');
    fireEvent.press(screen.getByTestId(`shift-option-${Shift.Morning}`));
    fireEvent.changeText(screen.getByTestId('class-year-input'), 'abc');
    fireEvent.press(screen.getByTestId('class-submit-button'));
    await waitFor(() => expect(screen.getByTestId('class-year-error')).toBeTruthy());
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('chama onSubmit com dados corretos quando formulário é válido', async () => {
    mockSubmit.mockResolvedValue(undefined);
    renderForm();
    fireEvent.changeText(screen.getByTestId('class-name-input'), '3º C');
    fireEvent.press(screen.getByTestId(`shift-option-${Shift.Evening}`));
    fireEvent.changeText(screen.getByTestId('class-year-input'), '2024');
    fireEvent.press(screen.getByTestId('class-submit-button'));
    await waitFor(() => expect(mockSubmit).toHaveBeenCalledTimes(1));
    expect(mockSubmit).toHaveBeenCalledWith({
      schoolId: 'school-1',
      name: '3º C',
      shift: Shift.Evening,
      academicYear: 2024,
    });
  });

  it('chama onCancel ao pressionar Cancelar', () => {
    renderForm();
    fireEvent.press(screen.getByTestId('class-cancel-button'));
    expect(mockCancel).toHaveBeenCalledTimes(1);
  });
});
