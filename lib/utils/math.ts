/**
 * Round a number to 2 decimal places (avoids floating-point drift in money math).
 */
export function roundMoney(value: number): number {
  return Math.round(value * 100) / 100
}

/**
 * Clamp a value between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}
