import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatAddress(address: string): string {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function formatEther(value: bigint, decimals: number = 18): string {
  const divisor = BigInt(10 ** decimals)
  const whole = value / divisor
  const remainder = value % divisor
  const remainderStr = remainder.toString().padStart(decimals, '0')
  return `${whole}.${remainderStr}`
}

export function parseEther(value: string, decimals: number = 18): bigint {
  const [whole, decimal = ''] = value.split('.')
  const decimalPadded = decimal.padEnd(decimals, '0').slice(0, decimals)
  return BigInt(whole + decimalPadded)
}


