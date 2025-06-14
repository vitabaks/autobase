import { FC, useEffect } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createAppTheme } from '@shared/theme/theme.ts';
import Router from '@app/router/Router.tsx';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { store } from '@app/redux/store/store.ts';
import { useAppSelector, useAppDispatch } from '@app/redux/store/hooks.ts';
import { selectActualTheme } from '@app/redux/slices/themeSlice/themeSelectors.ts';
import { updateSystemTheme } from '@app/redux/slices/themeSlice/themeSlice.ts';

const AppContent: FC = () => {
  const dispatch = useAppDispatch();
  const actualTheme = useAppSelector(selectActualTheme);
  const theme = createAppTheme(actualTheme);

  useEffect(() => {
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      dispatch(updateSystemTheme());
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [dispatch]);

  return (
      <ThemeProvider theme={theme}>
      <CssBaseline />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Router />
          <ToastContainer theme={actualTheme} />
        </LocalizationProvider>
      </ThemeProvider>
  );
};

const App: FC = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;
