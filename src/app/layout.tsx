// app/layout.tsx
import { Providers } from '@/providers';
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MUI Emotion SSR Example',
  description: 'Using MUI + Emotion with App Router and server-side layout',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
