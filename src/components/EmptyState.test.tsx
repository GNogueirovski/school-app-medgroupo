import React from 'react';
import { render, screen, fireEvent } from '../test-utils';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('renderiza a mensagem', () => {
    render(<EmptyState message="Nenhuma escola cadastrada" />);
    expect(screen.getByTestId('empty-state')).toBeTruthy();
    expect(screen.getByText('Nenhuma escola cadastrada')).toBeTruthy();
  });

  it('não renderiza CTA quando ctaLabel ou onCta estão ausentes', () => {
    render(<EmptyState message="Lista vazia" />);
    expect(screen.queryByTestId('empty-state-cta')).toBeNull();
  });

  it('renderiza CTA quando ctaLabel e onCta são fornecidos', () => {
    render(<EmptyState message="Lista vazia" ctaLabel="Adicionar" onCta={() => {}} />);
    expect(screen.getByTestId('empty-state-cta')).toBeTruthy();
    expect(screen.getByText('Adicionar')).toBeTruthy();
  });

  it('chama onCta ao pressionar o botão', () => {
    const onCta = jest.fn();
    render(<EmptyState message="Lista vazia" ctaLabel="Adicionar" onCta={onCta} />);
    fireEvent.press(screen.getByTestId('empty-state-cta'));
    expect(onCta).toHaveBeenCalledTimes(1);
  });

  it('não renderiza CTA quando apenas ctaLabel é fornecido (sem onCta)', () => {
    render(<EmptyState message="Lista vazia" ctaLabel="Adicionar" />);
    expect(screen.queryByTestId('empty-state-cta')).toBeNull();
  });
});
