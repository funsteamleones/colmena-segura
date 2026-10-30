import { createClient } from '@supabase/supabase-js';

// Obtener credenciales desde variables de entorno de Vite o desde localStorage
export const getSupabaseConfig = () => {
  const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  const savedUrl = localStorage.getItem('supabase_url') || envUrl;
  const savedKey = localStorage.getItem('supabase_anon_key') || envKey;

  return {
    url: savedUrl.trim(),
    anonKey: savedKey.trim(),
  };
};

export const saveSupabaseConfig = (url, anonKey) => {
  if (url) localStorage.setItem('supabase_url', url.trim());
  if (anonKey) localStorage.setItem('supabase_anon_key', anonKey.trim());
};

export const isSupabaseConfigured = () => {
  const { url, anonKey } = getSupabaseConfig();
  return Boolean(url && anonKey && url.startsWith('http'));
};

let clientInstance = null;

export const getSupabaseClient = () => {
  const { url, anonKey } = getSupabaseConfig();
  if (!url || !anonKey || !url.startsWith('http')) {
    return null;
  }
  if (!clientInstance) {
    clientInstance = createClient(url, anonKey, {
      auth: { persistSession: true },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    });
  }
  return clientInstance;
};

// ─── VERIFICAR CONEXIÓN ─────────────────────────────────────────────────────────
export const testSupabaseConnection = async (testUrl, testKey) => {
  try {
    const client = createClient(testUrl, testKey);
    const { data, error } = await client.from('families').select('id').limit(1);
    if (error && error.code !== 'PGRST116') {
      return { ok: false, error: error.message };
    }
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: err.message || 'Error de conexión' };
  }
};
