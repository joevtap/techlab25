import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  return (value / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export function formatCurrencyInput(inputValue: string): {
  value: number;
  formattedValue: string;
} {
  const value = inputValue.replace(/\D/g, '');

  const numericValue = Number.parseInt(value, 10) || 0;

  const formattedValue = (numericValue / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  return {
    value: numericValue,
    formattedValue,
  };
}
