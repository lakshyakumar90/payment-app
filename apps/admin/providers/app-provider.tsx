"use client";

import type { ReactNode } from "react";
import { QueryProvider } from "./query-provider";
import { AuthProvider } from "./auth-provider";

export function AppProvider({children}: {children: ReactNode}) {
    return <QueryProvider>
        <AuthProvider>
            {children}
        </AuthProvider>
    </QueryProvider>;
}