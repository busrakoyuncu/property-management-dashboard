/**
 * Buena Color Palette
 * Centralized color definitions for consistent theming across the application
 */

export const colors = {
  yellow: '#fdc800',
  beige: '#cebda3', // light brown
  green: '#398958', // soft green
  'light-gray': '#e7e5e4',
  'warm-gray': '#a6a09b', // brown gray
  orange: '#ff6900',
  'warm-beige': '#dbd4ca', // section background (warm neutral)
  white: '#ffffff', // default background
  black: '#010105', // footer background
} as const

// Type-safe color values
export type ColorName = keyof typeof colors

// Helper function to get color value
export function getColor(colorName: ColorName): string {
  return colors[colorName]
}

// CSS variable format (for use in inline styles or CSS)
export const colorVariables = {
  '--color-yellow': colors.yellow,
  '--color-beige': colors.beige,
  '--color-green': colors.green,
  '--color-light-gray': colors['light-gray'],
  '--color-warm-gray': colors['warm-gray'],
  '--color-orange': colors.orange,
  '--color-warm-beige': colors['warm-beige'],
  '--color-white': colors.white,
  '--color-black': colors.black,
} as const
