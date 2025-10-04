import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Get environment variables from .env file
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

console.log('Supabase environment variables:', {
  SUPABASE_URL: SUPABASE_URL ? 'SET' : 'MISSING',
  SUPABASE_ANON_KEY: SUPABASE_ANON_KEY ? 'SET' : 'MISSING',
  SUPABASE_URL_VALUE: SUPABASE_URL,
  SUPABASE_ANON_KEY_VALUE: SUPABASE_ANON_KEY ? 'KEY_PRESENT' : 'KEY_MISSING'
});

// Validate environment variables
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing Supabase environment variables. Check your .env file.');
  console.error('VITE_SUPABASE_URL:', SUPABASE_URL ? 'SET' : 'MISSING');
  console.error('VITE_SUPABASE_ANON_KEY:', SUPABASE_ANON_KEY ? 'SET' : 'MISSING');
}

// Create a fallback client if environment variables are missing
const createFallbackClient = () => {
  console.log('Creating fallback Supabase client');

  // Create a more comprehensive mock client
  const mockQuery = {
    select: (columns?: string, options?: any) => {
      console.log('Mock select called with:', { columns, options });
      // Handle count option
      if (options && options.count) {
        return {
          ...mockQuery,
          count: null,
          data: null,
          error: new Error('Supabase not configured')
        };
      }
      return mockQuery;
    },
    insert: (data: any) => {
      console.log('Mock insert called with:', data);
      return mockQuery;
    },
    update: (data: any) => {
      console.log('Mock update called with:', data);
      return mockQuery;
    },
    delete: () => {
      console.log('Mock delete called');
      return mockQuery;
    },
    eq: (column: string, value: any) => {
      console.log('Mock eq called with:', { column, value });
      return mockQuery;
    },
    limit: (limit: number) => {
      console.log('Mock limit called with:', limit);
      return mockQuery;
    },
    single: () => {
      console.log('Mock single called');
      return mockQuery;
    },
    order: (column: string, options?: any) => {
      console.log('Mock order called with:', { column, options });
      return mockQuery;
    },
    data: null,
    error: new Error('Supabase not configured'),
    count: null
  };

  const mockStorage = {
    from: (bucket: string) => {
      console.log('Mock storage from called with:', bucket);
      return {
        upload: (path: string, file: File, options?: any) => {
          console.log('Mock storage upload called with:', { path, file, options });
          return Promise.resolve({ data: null, error: new Error('Supabase storage not configured') });
        },
        getPublicUrl: (path: string, options?: any) => {
          console.log('Mock storage getPublicUrl called with:', { path, options });
          return ({ data: { publicUrl: '' }, error: new Error('Supabase storage not configured') });
        },
        remove: (paths: string[]) => {
          console.log('Mock storage remove called with:', paths);
          return Promise.resolve({ data: null, error: new Error('Supabase storage not configured') });
        },
        list: (path?: string, options?: any) => {
          console.log('Mock storage list called with:', { path, options });
          return Promise.resolve({ data: null, error: new Error('Supabase storage not configured') });
        },
        download: (path: string) => {
          console.log('Mock storage download called with:', path);
          return Promise.resolve({ data: null, error: new Error('Supabase storage not configured') });
        },
        move: (fromPath: string, toPath: string) => {
          console.log('Mock storage move called with:', { fromPath, toPath });
          return Promise.resolve({ data: null, error: new Error('Supabase storage not configured') });
        },
        copy: (fromPath: string, toPath: string) => {
          console.log('Mock storage copy called with:', { fromPath, toPath });
          return Promise.resolve({ data: null, error: new Error('Supabase storage not configured') });
        },
        createSignedUrl: (path: string, expiresIn: number) => {
          console.log('Mock storage createSignedUrl called with:', { path, expiresIn });
          return Promise.resolve({ data: null, error: new Error('Supabase storage not configured') });
        },
        createSignedUploadUrl: (path: string) => {
          console.log('Mock storage createSignedUploadUrl called with:', path);
          return Promise.resolve({ data: null, error: new Error('Supabase storage not configured') });
        },
        uploadToSignedUrl: (path: string, token: string, file: File, options?: any) => {
          console.log('Mock storage uploadToSignedUrl called with:', { path, token, file, options });
          return Promise.resolve({ data: null, error: new Error('Supabase storage not configured') });
        },
      }
    }
  };

  const mockAuth = {
    signInWithPassword: (credentials: any) => {
      console.log('Mock auth signInWithPassword called with:', credentials);
      return Promise.resolve({ data: { user: null, session: null }, error: new Error('Supabase not configured') });
    },
    signUp: (credentials: any) => {
      console.log('Mock auth signUp called with:', credentials);
      return Promise.resolve({ data: { user: null, session: null }, error: new Error('Supabase not configured') });
    },
    signOut: () => {
      console.log('Mock auth signOut called');
      return Promise.resolve({ error: new Error('Supabase not configured') });
    },
    getUser: () => {
      console.log('Mock auth getUser called');
      return Promise.resolve({ data: { user: null }, error: new Error('Supabase not configured') });
    },
    getSession: () => {
      console.log('Mock auth getSession called');
      return Promise.resolve({ data: { session: null }, error: new Error('Supabase not configured') });
    },
    onAuthStateChange: (callback: any) => {
      console.log('Mock auth onAuthStateChange called');
      // Call callback immediately with null session
      callback('SIGNED_OUT', null);
      return {
        data: {
          subscription: {
            unsubscribe: () => { }
          }
        }
      };
    },
  };

  const mockChannel = {
    on: (type: string, filter: any, callback?: any) => {
      console.log('Mock channel on called with:', { type, filter });
      // Handle different parameter orders
      if (typeof filter === 'function') {
        // Two parameters: type, callback
        return mockChannel;
      } else if (typeof callback === 'function') {
        // Three parameters: type, filter, callback
        return mockChannel;
      }
      return mockChannel;
    },
    subscribe: () => {
      console.log('Mock channel subscribe called');
      return mockChannel;
    },
    unsubscribe: () => {
      console.log('Mock channel unsubscribe called');
    }
  };

  const client = {
    from: (table: string) => {
      console.log('Mock from called with:', table);
      return mockQuery;
    },
    auth: mockAuth,
    storage: mockStorage,
    channel: (name: string) => {
      console.log('Mock channel called with:', name);
      return mockChannel;
    },
    realtime: {
      channel: (name: string) => {
        console.log('Mock realtime channel called with:', name);
        return mockChannel;
      }
    }
  };

  console.log('Fallback client created:', client);
  return client;
};

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

console.log('Creating Supabase client with:', {
  SUPABASE_URL: SUPABASE_URL ? 'SET' : 'MISSING',
  SUPABASE_ANON_KEY: SUPABASE_ANON_KEY ? 'SET' : 'MISSING'
});

export const supabase = SUPABASE_URL && SUPABASE_ANON_KEY
  ? (console.log('Creating real Supabase client'), createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
      flowType: 'pkce',
      detectSessionInUrl: true
    }
  }))
  : (console.log('Creating fallback client'), createFallbackClient());