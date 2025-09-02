import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { supabase } from '@/lib/supabaseClient';
import { supabaseAdmin } from '@/lib/supabaseServer';

// Handler for PATCH requests (to update the AboutPage)
export async function PATCH(request) {
  try {
    const body = await request.json();

    const client = supabaseAdmin || supabase;
    const { data: existing, error: findError } = await client
      .from('AboutPage')
      .select('id')
      .limit(1)
      .maybeSingle();

    if (findError) throw findError;

    const updatePayload = {
      introduction_text: body.introduction,
      main_content_json: body.mainContentJson,
      cta_text: body.ctaText,
      cta_link: body.ctaLink,
      sections_json: body.sectionsJson,
      profile_image_url: body.profileImageUrl,
      linkedinUrl: body.linkedinUrl,
      twitterUrl: body.twitterUrl,
    };

    let updated = null;
    if (existing?.id) {
      const { data, error: updateError } = await client
        .from('AboutPage')
        .update(updatePayload)
        .eq('id', existing.id)
        .select()
        .maybeSingle();
      if (updateError) throw updateError;
      updated = data;
    } else {
      const { data, error: insertError } = await client
        .from('AboutPage')
        .insert(updatePayload)
        .select()
        .maybeSingle();
      if (insertError) throw insertError;
      updated = data;
    }

    if (updateError) throw updateError;

    revalidatePath('/about');

    return NextResponse.json(updated, { status: 200 });

  } catch (error) {
    const message = (error && typeof error === 'object' && 'message' in error) ? error.message : String(error);
    console.error('Error updating About Page:', { message });
    return NextResponse.json(
      { message: 'Failed to update About Page.', error: message },
      { status: 500 }
    );
  }
}