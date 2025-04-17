
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

// Create a Supabase client instance with the available configuration
export const supabase = createClient(
  supabaseUrl, 
  supabaseKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true
    }
  }
);

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return !!supabaseUrl && !!supabaseKey;
};
