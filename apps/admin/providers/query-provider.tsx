"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export function QueryProvider({ children }: {children: ReactNode}) {
    const [client] = useState(() => {
        return new QueryClient({
            defaultOptions: {
                queries: {
                    staleTime: 60 * 1000, 
                    retry: 1
                }
            }
        })
    })
    return <QueryClientProvider client={client}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
}
