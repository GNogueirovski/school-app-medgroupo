import React from 'react';
import { render, screen, fireEvent } from '../test-utils';
import { ConfirmDialog } from './ConfirmDialog';

function renderDialog(isOpen: boolean, onConfirm = jest.fn(), onCancel = jest.fn()) {
  return render(
    <ConfirmDialog
      isOpen={isOpen}
      title="Confirmar exclusão"
      message="Tem certeza que deseja excluir?"
      confirmLabel="Excluir"
      cancelLabel="Cancelar"
      onConfirm={onConfirm}
      onCancel={onCancel}
    />,
  );
}

describe('ConfirmDialog', () => {
  it('exibe título e mensagem quando aberto', () => {
    renderDialog(true);
    expect(screen.getByTestId('confirm-dialog-title')).toBeTruthy();
    expect(screen.getByText('Confirmar exclusão')).toBeTruthy();
    expect(screen.getByText('Tem certeza que deseja excluir?')).toBeTruthy();
  });

  it('exibe os botões de confirmar e cancelar', () => {
    renderDialog(true);
    expect(screen.getByTestId('confirm-dialog-confirm')).toBeTruthy();
    expect(screen.getByTestId('confirm-dialog-cancel')).toBeTruthy();
    expect(screen.getByText('Excluir')).toBeTruthy();
    expect(screen.getByText('Cancelar')).toBeTruthy();
  });

  it('chama onConfirm ao pressionar o botão de confirmação', () => {
    const onConfirm = jest.fn();
    renderDialog(true, onConfirm);
    fireEvent.press(screen.getByTestId('confirm-dialog-confirm'));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('chama onCancel ao pressionar o botão de cancelar', () => {
    const onCancel = jest.fn();
    renderDialog(true, jest.fn(), onCancel);
    fireEvent.press(screen.getByTestId('confirm-dialog-cancel'));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('não renderiza conteúdo quando fechado', () => {
    renderDialog(false);
    expect(screen.queryByTestId('confirm-dialog-title')).toBeNull();
    expect(screen.queryByTestId('confirm-dialog-message')).toBeNull();
  });
});
