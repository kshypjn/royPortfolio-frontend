import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { supabase } from '@/lib/supabaseClient';
import { supabaseAdmin } from '@/lib/supabaseServer';

export async function PUT(request, { params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const articleId = params.id;
  if (!articleId) {
    return NextResponse.json({ message: 'Article ID is required' }, { status: 400 });
  }

  try {
    const body = await request.json();
    // Extract fields allowed for update (match your schema.prisma)
    const { title, url, publication, thumbnailUrl, publishedDate, tags, status } = body;

    // Basic validation (can be more robust with a validation library)
    if (!title || !url || !publication || !publishedDate) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Ensure publishedDate is a valid ISO string or Date object
    let parsedPublishedDate = null;
    if (publishedDate) {
        try {
            parsedPublishedDate = new Date(publishedDate);
            if (isNaN(parsedPublishedDate.getTime())) {
                throw new Error("Invalid date format");
            }
        } catch (dateError) {
            console.error("Invalid publishedDate format:", publishedDate, dateError);
            return NextResponse.json({ message: 'Invalid publishedDate format' }, { status: 400 });
        }
    }

    const updatePayload = {
      title,
      url,
      publication,
      thumbnailUrl,
      publishedDate: parsedPublishedDate ? parsedPublishedDate.toISOString().slice(0,10) : null,
      tags,
      status,
    };

    const client = supabaseAdmin || supabase;
    const { data, error } = await client
      .from('Articles')
      .update(updatePayload)
      .eq('id', articleId)
      .select()
      .maybeSingle();

    if (error) throw error;

    try { revalidatePath('/articles'); revalidatePath('/work'); } catch (_) {}
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    const message = (error && typeof error === 'object' && 'message' in error) ? error.message : String(error);
    console.error('Error updating article:', { message });
    if (message && message.includes('duplicate key value')) {
      return NextResponse.json({ message: 'A unique field already exists (likely url).' }, { status: 409 });
    }
    if (message && message.includes('No rows updated')) {
      return NextResponse.json({ message: 'Article not found.' }, { status: 404 });
    }
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const articleId = params.id;
  if (!articleId) {
    return NextResponse.json({ message: 'Article ID is required' }, { status: 400 });
  }

  try {
    const client = supabaseAdmin || supabase;
    const { error } = await client
      .from('Articles')
      .delete()
      .eq('id', articleId);
    if (error) throw error;
    try { revalidatePath('/articles'); revalidatePath('/work'); } catch (_) {}
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    const message = (error && typeof error === 'object' && 'message' in error) ? error.message : String(error);
    console.error('Error deleting article:', { message });
    return NextResponse.json({ message }, { status: 500 });
  }
}

// You might also want a GET handler for this route to fetch a single article
// if your form component decides to fetch from here instead of directly from the page.js
// For now, the page.js fetches it, so a GET here is optional for this specific flow. 