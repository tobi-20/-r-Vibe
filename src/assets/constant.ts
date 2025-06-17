export const JW_SECRET = import.meta.env.VITE_SUPABASE_JWT;
if (!JW_SECRET) throw new Error("Missing Supabase JWT");
