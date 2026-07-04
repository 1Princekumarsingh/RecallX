export type HapticPattern = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error'

const patternMap: Record<HapticPattern, number | number[]> = {
  light: 10,
  medium: 20,
  heavy: 30,
  success: [10, 20, 10],
  warning: [20, 10, 20],
  error: [30, 20, 30, 20]
}

export function triggerHaptic(pattern: HapticPattern = 'light') {
  if (typeof navigator === 'undefined' || !('vibrate' in navigator)) return

  navigator.vibrate(patternMap[pattern])
}
