import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://oplukbtkjdrzusajtzje.supabase.co";

const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wbHVrYnRramRyenVzYWp0emplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4ODg2MTQsImV4cCI6MjA1OTQ2NDYxNH0.NWTHG2vxEYfCdDRWlF7E1o6yGuNTTxaX4oeUxyv2iUM";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
