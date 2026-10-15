import { Platform } from 'react-native';

/**
 * Design tokens from DESIGN.md. Every screen styles from these values —
 * no component improvises its own colours, spacing or radii.
 */

export const colors = {
  bg: '#F7F5F1',
  surface: '#FFFFFF',
  fg: '#1C1B19',
  fgMuted: '#6B6862',
  accent: '#1F6F4A',
  accentStrong: '#175538',
  accentSoft: '#E7F1EB',
  border: '#E2DED6',
  inputBg: '#FFFFFF',
  danger: '#B3261E',
  dangerSoft: '#FBEAE8',
  disabled: '#A8A49C',
} as const;

export const spacing = {
  space0: 4,
  space1: 8,
  space2: 12,
  space3: 16,
  space4: 24,
  space5: 32,
  space6: 48,
} as const;

export const radii = {
  sm: 6,
  md: 10,
  lg: 16,
  pill: 999,
} as const;

const systemFontFamily = Platform.select({
  ios: 'System',
  android: 'sans-serif',
  default:
    "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
}) as string;

const numericFontFamily = Platform.select({
  ios: 'Menlo',
  android: 'monospace',
  default: "ui-monospace, 'SF Mono', 'Roboto Mono', Menlo, monospace",
}) as string;

export const fonts = {
  family: systemFontFamily,
  numeric: numericFontFamily,
} as const;

export const typography = {
  label: 13,
  body: 15,
  input: 17,
  section: 22,
  heading: 28,
  resultFigure: 40,
  headingWeight: '600',
  bodyWeight: '400',
  labelLetterSpacing: 0.4,
  figureLetterSpacing: -0.5,
} as const;

export const theme = {
  colors,
  spacing,
  radii,
  fonts,
  typography,
} as const;

export default theme;
