'use client';

import { useSupabase } from '@/hooks/use-supabase';
import React, { useEffect } from 'react';

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const { init, unset } = useSupabase();
  useEffect(() => {
    init();
    return unset;
  }, []);
  return children;
}
