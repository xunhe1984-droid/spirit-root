import { useEffect, useState, useCallback } from 'react';
import pb from '@/lib/pocketbaseClient';

export function useAuth() {
  const [user, setUser] = useState(pb.authStore.record);

  useEffect(() => {
    const unsub = pb.authStore.onChange((_t, record) => setUser(record));
    return unsub;
  }, []);

  const login = useCallback(
    (email, password) => pb.collection('users').authWithPassword(email, password),
    [],
  );
  const logout = useCallback(() => pb.authStore.clear(), []);

  return {
    user,
    isAuthed: pb.authStore.isValid,
    isAdmin: !!user && user.role === 'admin',
    login,
    logout,
  };
}
