import { NextResponse } from "next/server";
import { revalidatePath } from 'next/cache';
import { getServerSession } from "next-auth";
import { supabase } from "@/lib/supabaseClient";
import { getSupabaseServer } from "@/lib/supabaseServer";
import { authOptions } from "../auth/[...nextauth]/route";

// Helper to validate URLs (simple regex)
const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

// GET handler to fetch all articles (for admin list)
export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
  }
  try {
    const client = (process.env.SUPABASE_SERVICE_ROLE_KEY ? getSupabaseServer() : supabase);
    const { data, error } = await client
      .from('Articles')
      .select('*')
      .order('publishedDate', { ascending: false });
    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (error) {
    const message = (error && typeof error === 'object' && 'message' in error) ? error.message : String(error);
    console.error("Error fetching articles:", { message });
    return new NextResponse(JSON.stringify({ message }), { status: 500 });
  }
}

// POST handler to create a new article
export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
  }
  try {
    const body = await request.json();
    const { title, url, publication, thumbnailUrl, publishedDate, tags, status } = body;
    if (!title || title.trim() === '') {
      return new NextResponse(JSON.stringify({ message: "Title is required." }), { status: 400 });
    }
    if (!url || !isValidUrl(url)) {
      return new NextResponse(JSON.stringify({ message: "A valid URL is required." }), { status: 400 });
    }
    if (!publication || publication.trim() === '') {
      return new NextResponse(JSON.stringify({ message: "Publication is required." }), { status: 400 });
    }
    if (!publishedDate || isNaN(new Date(publishedDate).getTime())) {
      return new NextResponse(JSON.stringify({ message: "A valid Published Date is required." }), { status: 400 });
    }
    const tagsArray = tags
      ? tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
      : [];
    const insertPayload = {
      title,
      url,
      publication,
      thumbnailUrl: thumbnailUrl || null,
      publishedDate: new Date(publishedDate).toISOString().slice(0,10),
      tags: tagsArray,
      status: status || 'Draft',
    };
    const client = (process.env.SUPABASE_SERVICE_ROLE_KEY ? getSupabaseServer() : supabase);
    const { data, error } = await client
      .from('Articles')
      .insert(insertPayload)
      .select()
      .single();
    if (error) {
      // Unique violation for url
      if (error.code === '23505') {
        return new NextResponse(JSON.stringify({ message: "An article with this URL already exists." }), { status: 409 });
      }
      throw error;
    }
    // Revalidate the public Work page to show the new article sooner
    try { revalidatePath('/work'); } catch (_) {}
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    const message = (error && typeof error === 'object' && 'message' in error) ? error.message : String(error);
    console.error("Error creating article:", { message });
    return new NextResponse(JSON.stringify({ message: "Failed to create article due to an internal server error." }), { status: 500 });
  }
} 