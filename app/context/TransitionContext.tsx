'use client';

import React, { createContext, useContext, useTransition, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

interface TransitionContextType {
    isPending: boolean;
    startTransition: (callback: () => void) => void;
    router: AppRouterInstance;
}

const TransitionContext = createContext<TransitionContextType | undefined>(undefined);

export function TransitionProvider({ children }: { children: ReactNode }) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    return (
        <TransitionContext.Provider value={{ isPending, startTransition, router }}>
            {children}
        </TransitionContext.Provider>
    );
}

export function useTransitionContext() {
    const context = useContext(TransitionContext);
    if (context === undefined) {
        throw new Error('useTransitionContext must be used within a TransitionProvider');
    }
    return context;
}
