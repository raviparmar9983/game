'use client';

import {
  QueryClient,
  QueryClientProvider,
  QueryClientConfig,
} from '@tanstack/react-query';
import { ReactNode, useState } from 'react';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const defaultQueryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
};

type Props = {
  children: ReactNode;
  config?: QueryClientConfig;
};

export const QueryProvider = ({ children, config }: Props) => {
  const [queryClient] = useState(
    () => new QueryClient(config ?? defaultQueryClientConfig),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )} */}
    </QueryClientProvider>
  );
};
