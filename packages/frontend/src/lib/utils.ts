import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export function formatCurrencyInput(inputValue: string): {
  value: string;
  formattedValue: string;
} {
  const value = inputValue.replace(/\D/g, '');

  const numericValue = Number.parseInt(value, 10) || 0;

  const actualValue = (numericValue / 100).toString();

  const formattedValue = (numericValue / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  return {
    value: actualValue,
    formattedValue,
  };
}
