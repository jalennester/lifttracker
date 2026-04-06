import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://tytqyvzkdkxfacqbswhs.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5dHF5dnprZGt4ZmFjcWJzd2hzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1MTM0MTksImV4cCI6MjA5MTA4OTQxOX0.B5BryhOBns6BkM_Owfr4qgKqrt3Hyir9V73CG84JG0o'
);
