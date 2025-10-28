import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('ru-RU').format(num)
}

export const formatPercent = (num: number): string => {
  const sign = num > 0 ? '+' : ''
  return `${sign}${num.toFixed(1)}%`
}

