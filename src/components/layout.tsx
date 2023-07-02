import { ThemeProvider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import React from 'react';
import { theme } from './theme';

export const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </React.StrictMode>
  );
};
