'use client';

import { useEffect } from 'react';
import { refreshSession } from '@/services/apollo/client';
import useStore from '@/services/store/useStore';
import { loadServerCart } from '@/hooks/useCart';

export default function AuthProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const setUser = useStore((state) => state.setUser);
  const logout = useStore((state) => state.logout);
  const setLoading = useStore((state) => state.setLoading);

  useEffect(() => {
    setLoading(true);
    refreshSession()
      .then((session) => {
        if (session) {
          setUser(session.user);
          return loadServerCart(session.user.cart);
        }
        logout();
      })
      .finally(() => setLoading(false));
  }, [setUser, logout, setLoading]);

  return <>{children}</>;
}
