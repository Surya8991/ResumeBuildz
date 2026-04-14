'use client';

import { createContext, useContext } from 'react';
import { ToastProvider } from '@/components/Toast';
import { LoginGatewayProvider } from '@/components/LoginGateway';
import { useAuth as useAuthHook } from '@/hooks/useAuth';

type AuthContextType = ReturnType<typeof useAuthHook>;

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within Providers');
  return ctx;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const auth = useAuthHook();

  return (
    <AuthContext.Provider value={auth}>
      <ToastProvider>
        <LoginGatewayProvider>{children}</LoginGatewayProvider>
      </ToastProvider>
    </AuthContext.Provider>
  );
}
