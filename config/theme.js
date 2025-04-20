import { createConfig } from '@gluestack-ui/themed';

export const config = createConfig({
  tokens: {
    colors: {
      // Primary colors
      primary50: '#f0f9ff',
      primary100: '#e0f2fe',
      primary200: '#bae6fd',
      primary300: '#7dd3fc',
      primary400: '#38bdf8',
      primary500: '#0ea5e9',
      primary600: '#0284c7',
      primary700: '#0369a1',
      primary800: '#075985',
      primary900: '#0c4a6e',
      
      // Secondary colors
      secondary50: '#f5f3ff',
      secondary100: '#ede9fe',
      secondary200: '#ddd6fe',
      secondary300: '#c4b5fd',
      secondary400: '#a78bfa',
      secondary500: '#8b5cf6',
      secondary600: '#7c3aed',
      secondary700: '#6d28d9',
      secondary800: '#5b21b6',
      secondary900: '#4c1d95',
      
      // Status colors
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      info: '#3b82f6',
      
      // Grayscale
      white: '#ffffff',
      black: '#000000',
      gray50: '#f9fafb',
      gray100: '#f3f4f6',
      gray200: '#e5e7eb',
      gray300: '#d1d5db',
      gray400: '#9ca3af',
      gray500: '#6b7280',
      gray600: '#4b5563',
      gray700: '#374151',
      gray800: '#1f2937',
      gray900: '#111827',
      
      // Backgrounds
      backgroundLight: '#ffffff',
      backgroundDark: '#0f172a',
    },
    fonts: {
      heading: 'Inter-Bold',
      body: 'Inter-Regular',
      mono: 'Inter-Medium',
    },
    fontSizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 30,
      '4xl': 36,
      '5xl': 48,
    },
    space: {
      px: '1px',
      '0': 0,
      '0.5': 2,
      '1': 4,
      '1.5': 6,
      '2': 8,
      '2.5': 10,
      '3': 12,
      '3.5': 14,
      '4': 16,
      '5': 20,
      '6': 24,
      '7': 28,
      '8': 32,
      '9': 36,
      '10': 40,
      '12': 48,
      '16': 64,
      '20': 80,
      '24': 96,
      '32': 128,
      '40': 160,
      '48': 192,
      '56': 224,
      '64': 256,
    },
    radii: {
      none: 0,
      xs: 2,
      sm: 4,
      md: 6,
      lg: 8,
      xl: 12,
      '2xl': 16,
      '3xl': 24,
      full: 9999,
    },
  },
  components: {
    Button: {
      theme: {
        variants: {
          variant: {
            solid: {
              bg: '$primary600',
              _text: { color: '$white' },
              _hover: { bg: '$primary700' },
              _active: { bg: '$primary800' },
              _focus: { bg: '$primary700' },
            },
            outline: {
              borderWidth: 1,
              borderColor: '$primary600',
              _text: { color: '$primary600' },
              _hover: { bg: '$primary50' },
              _active: { bg: '$primary100' },
              _focus: { bg: '$primary50' },
            },
            link: {
              _text: { color: '$primary600' },
              _hover: { _text: { color: '$primary700' } },
              _active: { _text: { color: '$primary800' } },
            },
          },
          size: {
            sm: {
              px: '$3',
              py: '$1.5',
              _text: { fontSize: '$sm' },
            },
            md: {
              px: '$4',
              py: '$2',
              _text: { fontSize: '$md' },
            },
            lg: {
              px: '$6',
              py: '$3',
              _text: { fontSize: '$lg' },
            },
          },
        },
      },
    },
    Input: {
      theme: {
        variants: {
          variant: {
            outline: {
              borderWidth: 1,
              borderColor: '$gray300',
              _hover: { borderColor: '$gray400' },
              _focus: { 
                borderColor: '$primary600',
                borderWidth: 1.5,
              },
              _invalid: { borderColor: '$error' },
            },
          },
        },
      },
    },
  },
});

// Dark mode overrides
export const darkModeConfig = {
  tokens: {
    colors: {
      backgroundLight: '#0f172a',
      backgroundDark: '#ffffff',
    },
  },
};

export const components = {
  // Add custom component overrides here
};