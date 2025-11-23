'use client';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchCurrentUser } from '@/services/userService';
import { useAuthStore } from '@/store/useAuthStore';

export const useCurrentUser = () => {
  const user = useAuthStore((state) => state.user);
  const status = useAuthStore((state) => state.status);
  const { setUser, setStatus, setError } = useAuthStore((state) => state.actions);
  const shouldFetchProfile = Boolean(user);

  const query = useQuery({
    queryKey: ['current-user'],
    queryFn: fetchCurrentUser,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    enabled: shouldFetchProfile,
  });

  useEffect(() => {
    if (query.isLoading) {
      setStatus('loading');
    }
  }, [query.isLoading, setStatus]);

  useEffect(() => {
    if (query.isSuccess && query.data) {
      setUser(query.data);
    }
  }, [query.isSuccess, query.data, setUser]);

  useEffect(() => {
    if (query.isError) {
      setError(query.error instanceof Error ? query.error.message : undefined);
      setStatus('error');
    }
  }, [query.isError, query.error, setError, setStatus]);

  useEffect(() => {
    if (query.isSuccess) {
      setStatus('authenticated');
    }
  }, [query.isSuccess, setStatus]);

  return { user, status, query };
};
