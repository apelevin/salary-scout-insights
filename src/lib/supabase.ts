
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

// Create a chainable mock that returns itself for most method calls
const createChainableMock = (errorMessage = 'Supabase not configured') => {
  const mockObj: any = {};
  
  // Methods that return the mock object itself for chaining
  const chainMethods = ['from', 'select', 'insert', 'update', 'delete', 'eq', 'single'];
  
  chainMethods.forEach(method => {
    mockObj[method] = () => mockObj;
  });
  
  // Add the final resolution methods that end the chain
  mockObj.then = (callback: any) => {
    return Promise.resolve(callback({ data: null, error: new Error(errorMessage) }));
  };
  
  // For direct access to data/error pattern
  mockObj.data = null;
  mockObj.error = new Error(errorMessage);
  
  return mockObj;
};

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
      // Provide a chainable mock implementation to prevent runtime errors
      from: () => createChainableMock('Supabase not configured'),
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
