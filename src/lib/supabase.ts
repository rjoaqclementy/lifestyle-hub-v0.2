import { createClient } from '@supabase/supabase-js';
import { HUBS } from './constants';

const supabaseUrl = 'https://gfcesyuegnfgyntvqsmv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmY2VzeXVlZ25mZ3ludHZxc212Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc0MDYyMzgsImV4cCI6MjA0Mjk4MjIzOH0.1il2h9F-_lL4SxAYySvWSsBlfW_oFvnecDvDlSsvzFk';

export const supabase = createClient(
  supabaseUrl, 
  supabaseAnonKey,
  { 
    db: { 
      debug: true 
    } 
  }
);

export { HUBS };