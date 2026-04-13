import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../../test-utils';
import { SchoolForm } from './SchoolForm';

const mockSubmit = jest.fn();
const mockCancel = jest.fn();

function renderForm(initialValues?: { name: string; address: string }) {
  return render(
    <SchoolForm
      initialValues={initialValues}
      onSubmit={mockSubmit}
      onCancel={mockCancel}
    />,
  );
}

describe('SchoolForm', () => {
  beforeEach(() => {
    mockSubmit.mockReset();
    mockCancel.mockReset();
  });

  it('renderiza os campos de nome e endereço', () => {
    renderForm();
    expect(screen.getByTestId('school-name-input')).toBeTruthy();
    expect(screen.getByTestId('school-address-input')).toBeTruthy();
  });

  it('exibe "Criar escola" quando não há initialValues', () => {
    renderForm();
    expect(screen.getByText('Criar escola')).toBeTruthy();
  });

  it('exibe "Salvar alterações" quando há initialValues', () => {
    renderForm({ name: 'Escola', address: 'Rua A' });
    expect(screen.getByText('Salvar alterações')).toBeTruthy();
  });

  it('preenche campos com initialValues', () => {
    renderForm({ name: 'E.E. Santos Dumont', address: 'Rua das Flores, 123' });
    expect(screen.getByDisplayValue('E.E. Santos Dumont')).toBeTruthy();
    expect(screen.getByDisplayValue('Rua das Flores, 123')).toBeTruthy();
  });

  it('exibe erro de validação quando nome está vazio', async () => {
    mockSubmit.mockResolvedValue(undefined);
    renderForm();
    fireEvent.press(screen.getByTestId('school-submit-button'));
    await waitFor(() => expect(screen.getByTestId('school-name-error')).toBeTruthy());
    expect(screen.getByText('Nome é obrigatório')).toBeTruthy();
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('exibe erro de validação quando endereço está vazio', async () => {
    mockSubmit.mockResolvedValue(undefined);
    renderForm();
    fireEvent.changeText(screen.getByTestId('school-name-input'), 'Escola X');
    fireEvent.press(screen.getByTestId('school-submit-button'));
    await waitFor(() => expect(screen.getByTestId('school-address-error')).toBeTruthy());
    expect(screen.getByText('Endereço é obrigatório')).toBeTruthy();
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('chama onSubmit com dados corretos quando formulário é válido', async () => {
    mockSubmit.mockResolvedValue(undefined);
    renderForm();
    fireEvent.changeText(screen.getByTestId('school-name-input'), 'Nova Escola');
    fireEvent.changeText(screen.getByTestId('school-address-input'), 'Rua Nova, 1');
    fireEvent.press(screen.getByTestId('school-submit-button'));
    await waitFor(() => expect(mockSubmit).toHaveBeenCalledTimes(1));
    expect(mockSubmit).toHaveBeenCalledWith({ name: 'Nova Escola', address: 'Rua Nova, 1' });
  });

  it('remove espaços extras dos campos antes de submeter', async () => {
    mockSubmit.mockResolvedValue(undefined);
    renderForm();
    fireEvent.changeText(screen.getByTestId('school-name-input'), '  Escola Trim  ');
    fireEvent.changeText(screen.getByTestId('school-address-input'), '  Rua Trim, 1  ');
    fireEvent.press(screen.getByTestId('school-submit-button'));
    await waitFor(() => expect(mockSubmit).toHaveBeenCalledWith({ name: 'Escola Trim', address: 'Rua Trim, 1' }));
  });

  it('chama onCancel ao pressionar Cancelar', () => {
    renderForm();
    fireEvent.press(screen.getByTestId('school-cancel-button'));
    expect(mockCancel).toHaveBeenCalledTimes(1);
  });
});
