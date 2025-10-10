import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// console.log('🔍 Supabase URL:', supabaseUrl);
// console.log('🔍 Supabase Anon Key:', supabaseAnonKey?.substring(0, 20) + '...');

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL과 Anon Key를 환경 변수에 설정해주세요.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);