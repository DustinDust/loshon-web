import { create } from 'zustand';
import { createClient } from '@supabase/supabase-js';

type SupabaseStore = {
  supabase?: import('@supabase/supabase-js').SupabaseClient;
  init: () => void;
  unset: () => void;
};
export const useSupabase = create<SupabaseStore>((set) => ({
  supabase: undefined,
  init: () => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    set({ supabase });
  },
  unset: () => {
    set({ supabase: undefined });
  },
}));
