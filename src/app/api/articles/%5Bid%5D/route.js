import prisma from '../../../../lib/prisma';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log(">> SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log(">> SUPABASE_ANON_KEY:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY); 