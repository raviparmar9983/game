"use client";

import {
  QueryClient,
  QueryClientProvider,
  QueryClientConfig,
} from "@tanstack/react-query";
import { ReactNode, useState } from "react";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

type Props = {
  children: ReactNode;
};

// ✅ Optional: You can extract this config for reuse/testing
const defaultQueryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
};

export const QueryProvider = ({ children }: Props) => {
  const [queryClient] = useState(
    () => new QueryClient(defaultQueryClientConfig) 
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* ✅ Useful in development; remove in production if needed */}
      {/* {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )} */}
    </QueryClientProvider>
  );
};
