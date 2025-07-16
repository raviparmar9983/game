'use client';
import { ReactNode } from 'react';
import { Box, Container } from '@mui/material';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 2,
      }}
    >
      <Container maxWidth="sm" disableGutters>
        {children}
      </Container>
    </Box>
  );
}
