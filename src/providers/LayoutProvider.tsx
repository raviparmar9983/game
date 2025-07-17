'use client';
import dynamic from 'next/dynamic';
import { QueryProvider } from '@/providers/QueryProvider';
import { AnimatedBackground } from '@/components';
import { ThemeRegistry } from './ThemeProvider';

const Toaster = dynamic(
  () => import('react-hot-toast').then((mod) => mod.Toaster),
  { ssr: false },
);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ThemeRegistry>
        <QueryProvider>
          <AnimatedBackground>{children}</AnimatedBackground>
        </QueryProvider>
      </ThemeRegistry>
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: 'rgba(20, 20, 30, 0.6)',
            color: '#fff',
            border: '1px solid rgba(0, 255, 136, 0.3)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 25px rgba(0, 255, 136, 0.2)',
            borderRadius: '12px',
            fontFamily: '"Orbitron", "Roboto", sans-serif',
          },
          success: {
            style: {
              borderColor: '#00ff88',
              background: 'rgba(0, 255, 136, 0.1)',
              color: '#00ff88',
            },
          },
          error: {
            style: {
              borderColor: '#ff4d4f',
              background: 'rgba(255, 77, 79, 0.1)',
              color: '#ff4d4f',
            },
          },
        }}
      />
    </>
  );
}
