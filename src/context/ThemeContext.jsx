import React, { createContext, useState, useMemo, useContext } from 'react';
import { createTheme, ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

// Create the context
const ColorModeContext = createContext({ toggleColorMode: () => {} });

// Custom Hook for easy access
export const useColorMode = () => useContext(ColorModeContext);

export const ThemeProviderWrapper = ({ children }) => {
  const [mode, setMode] = useState(localStorage.getItem('themeMode') || 'light');

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const newMode = prevMode === 'light' ? 'dark' : 'light';
          localStorage.setItem('themeMode', newMode); // Save preference
          return newMode;
        });
      },
    }),
    [],
  );

  // Define the detailed theme colors
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'light'
            ? {
                // Light Mode Colors
                primary: { main: '#1976d2' },
                secondary: { main: '#9c27b0' },
                background: { default: '#f4f6f8', paper: '#ffffff' },
                text: { primary: '#2d3436', secondary: '#636e72' },
              }
            : {
                // Dark Mode Colors
                primary: { main: '#90caf9' },
                secondary: { main: '#ce93d8' },
                background: { default: '#121212', paper: '#1e1e1e' },
                text: { primary: '#ffffff', secondary: '#b0bec5' },
              }),
        },
        // Global overrides for smoother transitions
        typography: { fontFamily: 'Poppins, sans-serif' },
        components: {
            MuiPaper: { styleOverrides: { root: { transition: 'background-color 0.3s ease' } } },
            MuiBox: { styleOverrides: { root: { transition: 'background-color 0.3s ease' } } },
        }
      }),
    [mode],
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <MUIThemeProvider theme={theme}>
        {/* CssBaseline kicks start an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </ColorModeContext.Provider>
  );
};