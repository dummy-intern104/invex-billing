
import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const SUPABASE_URL = "https://dnkmwnauihqnnmbcwibz.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRua213bmF1aWhxbm5tYmN3aWJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4NDA5NjEsImV4cCI6MjA2MTQxNjk2MX0.8SNkILcCxO-FdggW4g_oeMvyWZ8iauPOdmjMJYkg1DU";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
