
import { createClient } from '@supabase/supabase-js';
import { toast } from "@/components/ui/use-toast";

// Get environment variables with fallbacks
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Validate required values
if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase configuration is missing. Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your environment.');
  
  // Show toast notification to the user
  if (typeof document !== 'undefined') {
    setTimeout(() => {
      toast({
        title: "Ошибка конфигурации Supabase",
        description: "Отсутствуют настройки подключения к Supabase. Пожалуйста, проверьте переменные окружения.",
        variant: "destructive",
      });
    }, 1000);
  }
}

// Create a dummy client or a real one based on configuration availability
export const supabase = supabaseUrl && supabaseKey 
  ? createClient(
      supabaseUrl, 
      supabaseKey,
      {
        auth: {
          autoRefreshToken: true,
          persistSession: true
        }
      }
    ) 
  : {
      // Provide a minimal mock implementation to prevent runtime errors
      from: () => ({ 
        select: () => ({ data: null, error: new Error('Supabase not configured') }),
        insert: () => ({ data: null, error: new Error('Supabase not configured') }),
        update: () => ({ data: null, error: new Error('Supabase not configured') }),
        delete: () => ({ data: null, error: new Error('Supabase not configured') }),
        eq: () => ({ data: null, error: new Error('Supabase not configured') }),
        single: () => ({ data: null, error: new Error('Supabase not configured') }),
      }),
      // Add other commonly used methods that might be called
      auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: new Error('Supabase not configured') }),
        signIn: () => Promise.resolve({ data: { user: null }, error: new Error('Supabase not configured') }),
        signOut: () => Promise.resolve({ error: new Error('Supabase not configured') }),
      },
      storage: {
        from: () => ({
          upload: () => Promise.resolve({ error: new Error('Supabase not configured') }),
          getPublicUrl: () => ({ data: { publicUrl: '' }, error: new Error('Supabase not configured') }),
        }),
      }
    };

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return !!supabaseUrl && !!supabaseKey;
};
