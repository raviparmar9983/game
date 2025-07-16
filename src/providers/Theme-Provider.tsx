// ThemeRegistry.tsx
'use client';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import gameTheme from '@/lib/theme';

interface ThemeRegistryProps {
  children: React.ReactNode;
}

const ThemeRegistry: React.FC<ThemeRegistryProps> = ({ children }) => {
  return (
    <AppRouterCacheProvider options={{ key: 'mui' }}>
      <ThemeProvider theme={gameTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
};

export default ThemeRegistry;
