import React from 'react';
import { render, screen } from '../../../test-utils';
import { ShiftBadge } from './ShiftBadge';
import { Shift } from '../types';

describe('ShiftBadge', () => {
  it('exibe "Matutino" para o turno Morning', () => {
    render(<ShiftBadge shift={Shift.Morning} />);
    expect(screen.getByText('Matutino')).toBeTruthy();
  });

  it('exibe "Vespertino" para o turno Afternoon', () => {
    render(<ShiftBadge shift={Shift.Afternoon} />);
    expect(screen.getByText('Vespertino')).toBeTruthy();
  });

  it('exibe "Noturno" para o turno Evening', () => {
    render(<ShiftBadge shift={Shift.Evening} />);
    expect(screen.getByText('Noturno')).toBeTruthy();
  });

  it('aplica cor de fundo verde para Matutino', () => {
    render(<ShiftBadge shift={Shift.Morning} />);
    const badge = screen.getByTestId(`shift-badge-${Shift.Morning}`);
    expect(badge.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ backgroundColor: '#064e3b' })]),
    );
  });

  it('aplica cor de fundo laranja para Vespertino', () => {
    render(<ShiftBadge shift={Shift.Afternoon} />);
    const badge = screen.getByTestId(`shift-badge-${Shift.Afternoon}`);
    expect(badge.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ backgroundColor: '#7c2d12' })]),
    );
  });

  it('aplica cor de fundo roxo para Noturno', () => {
    render(<ShiftBadge shift={Shift.Evening} />);
    const badge = screen.getByTestId(`shift-badge-${Shift.Evening}`);
    expect(badge.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ backgroundColor: '#3b0764' })]),
    );
  });
});
