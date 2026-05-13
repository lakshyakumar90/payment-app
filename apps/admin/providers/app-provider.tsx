"use client";

import type { ReactNode } from "react";
import { QueryProvider } from "./query-provider";
import { AuthProvider } from "./auth-provider";
import { AppToaster } from "../components/feedback/toaster";

export function AppProvider({children}: {children: ReactNode}) {
    return <QueryProvider>
        <AuthProvider>
            {children}
            <AppToaster />
        </AuthProvider>
    </QueryProvider>;
}