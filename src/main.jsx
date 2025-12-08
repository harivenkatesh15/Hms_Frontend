import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'


const theme = createTheme({
  typography: {
    fontFamily: "'Poppins', sans-serif", 
    h4: { fontWeight: 700, color: '#1a237e' }, 
    h6: { fontWeight: 600 },
  },
  palette: {
    primary: { main: '#2563eb' }, 
    secondary: { main: '#7c3aed' }, 
    background: { default: '#f3f4f6', paper: '#ffffff' },
  },
  shape: {
    borderRadius: 12, 
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // No ALL CAPS buttons
          fontWeight: 600,
          borderRadius: 8,
          boxShadow: 'none',
          '&:hover': { boxShadow: '0px 4px 12px rgba(0,0,0,0.1)' }, // 
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 20px rgba(0,0,0,0.05)',
        },
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
)