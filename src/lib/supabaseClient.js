import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Auth helpers
export async function login({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

// Articles CRUD
export async function fetchArticles({ status } = {}) {
  let query = supabase
    .from('Articles')
    .select('*')
    .order('publishedDate', { ascending: false });
  if (status) query = query.eq('status', status);
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function insertArticle(article) {
  // article: { title, url, publication, thumbnailUrl, publishedDate, tags, status }
  const { data, error } = await supabase
    .from('Articles')
    .insert(article)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateArticle(id, updates) {
  const { data, error } = await supabase
    .from('Articles')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// AboutPage helpers
export async function fetchAboutPage() {
  const { data, error } = await supabase
    .from('AboutPage')
    .select('*')
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function upsertAboutPage(payload) {
  const { data, error } = await supabase
    .from('AboutPage')
    .upsert(payload)
    .select()
    .maybeSingle();
  if (error) throw error;
  return data;
}


