export const darkColors = {
  background: '#0D0D0F',
  surface: '#1A1A1F',
  surfaceLight: '#252530',
  accent: '#00D4AA',
  secondary: '#FFB347',
  text: '#FFFFFF',
  textSecondary: '#8E8E93',
  textTertiary: '#5A5A5E',
  border: '#2C2C30',
};

export const lightColors = {
  background: '#F2F2F7',
  surface: '#FFFFFF',
  surfaceLight: '#EBEBEB',
  accent: '#00D4AA',
  secondary: '#FFB347',
  text: '#000000',
  textSecondary: '#6C6C70',
  textTertiary: '#8E8E93',
  border: '#E5E5EA',
};

// Kept for backward compatibility
export const colors = darkColors;

const ratingColors = [
  '#FF3B30', // 1 - Vivid Red
  '#FF5733', // 2 - Persimmon / Red-Orange
  '#FF7A33', // 3 - Deep Orange
  '#FF9500', // 4 - Pure Orange
  '#FFB347', // 5 - Soft Amber (Matches secondary)
  '#FFCC00', // 6 - Golden Yellow
  '#A8D844', // 7 - Lime Green
  '#34C759', // 8 - Apple Green
  '#00B894', // 9 - Jade Green
  '#00D4AA', // 10 - Mint Teal (Matches accent)
];

export function getRatingColor(score: number): string {
  const index = Math.max(0, Math.min(9, Math.round(score) - 1));
  return ratingColors[index];
}

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const typography = {
  largeTitle: { fontSize: 34, fontWeight: '700' as const },
  title: { fontSize: 22, fontWeight: '700' as const },
  headline: { fontSize: 17, fontWeight: '600' as const },
  body: { fontSize: 17, fontWeight: '400' as const },
  caption: { fontSize: 13, fontWeight: '400' as const },
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};