import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeSliceState {
  mode: ThemeMode;
  actualTheme: 'light' | 'dark'; // Resolved theme (system preference resolved to light/dark)
}

// Function to get system theme preference with better error handling
const getSystemTheme = (): 'light' | 'dark' => {
  try {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      return mediaQuery.matches ? 'dark' : 'light';
    }
  } catch (error) {
    console.warn('Failed to detect system theme:', error);
  }
  return 'light'; // fallback
};

// Function to resolve actual theme based on mode
const resolveActualTheme = (mode: ThemeMode): 'light' | 'dark' => {
  if (mode === 'system') {
    return getSystemTheme();
  }
  return mode;
};

const getInitialMode = (): ThemeMode => {
  const savedMode = localStorage.getItem('themeMode') as ThemeMode;
  if (savedMode && ['light', 'dark', 'system'].includes(savedMode)) {
    return savedMode;
  }
  return 'system';
};

const initialState: ThemeSliceState = {
  mode: getInitialMode(),
  actualTheme: resolveActualTheme(getInitialMode()),
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemeMode: (state: ThemeSliceState, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;
      state.actualTheme = resolveActualTheme(action.payload);
      localStorage.setItem('themeMode', action.payload);
    },
    updateSystemTheme: (state: ThemeSliceState) => {
      if (state.mode === 'system') {
        state.actualTheme = getSystemTheme();
      }
    },
  },
});

export const { setThemeMode, updateSystemTheme } = themeSlice.actions;

export default themeSlice.reducer; 