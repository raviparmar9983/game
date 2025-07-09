"use client";

import { QueryProvider } from "@/providers/query-provider";
import { Toaster } from "react-hot-toast";
import AnimatedBackground from "@/components/shared/BackgroudBox";
import ThemeProvider from "@/lib/Theme-Provider";
import { ReactNode, useEffect, useState } from "react";

const toastOptions = {
  /* ... your styled config ... */
};

export default function ClientWrapper({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <ThemeProvider>
      <QueryProvider>
        <AnimatedBackground
          enableGridAnimation={true}
          enableConicEffect={false}
        >
          {children}
        </AnimatedBackground>
        <Toaster position="bottom-center" toastOptions={toastOptions} />
      </QueryProvider>
    </ThemeProvider>
  );
}
