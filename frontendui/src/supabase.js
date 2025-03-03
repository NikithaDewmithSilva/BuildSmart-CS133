// src/supabase.js
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ufernctpquewhxmrjyjr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmZXJuY3RwcXVld2h4bXJqeWpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyOTEwMjcsImV4cCI6MjA1NTg2NzAyN30.eL6VgQ2aXc2DR_WJbU2sHGog5x_Dlxt5LwQkzZ1VUeg';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);