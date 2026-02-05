import React, { createContext, useContext, useState, useCallback } from 'react';

const UserContext = createContext<{
  userId: string | null;
  setUserId: (id: string | null) => void;
  isAuthenticated: boolean;
}>({
  userId: null,
  setUserId: () => {},
  isAuthenticated: false,
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserIdState] = useState<string | null>(null);
  const setUserId = useCallback((id: string | null) => {
    setUserIdState(id);
  }, []);
  return (
    <UserContext.Provider
      value={{
        userId,
        setUserId,
        isAuthenticated: !!userId,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
}
