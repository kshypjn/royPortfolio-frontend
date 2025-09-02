import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { supabase } from '@/lib/supabaseClient';
import AboutForm from './AboutForm';

export const revalidate = 0;

export default async function AdminAboutPage() {
  const session = await getServerSession(authOptions);
  const allowedEmails = process.env.ALLOWED_ADMIN_EMAILS?.split(',').map(e => e.trim());

  if (!session || !allowedEmails?.includes(session.user.email)) {
    redirect("/admin/login?error=AccessDenied");
  }

  let initialData = null;
  let error = null;

  try {
    const { data, error: fetchError } = await supabase
      .from('AboutPage')
      .select('id, introduction_text, main_content_json, cta_text, cta_link, sections_json, profile_image_url, linkedinUrl, twitterUrl')
      .limit(1)
      .maybeSingle();

    if (fetchError) throw fetchError;

    if (!data) {
      error = "No About Page entry found. Please create one row in the 'about_page' table in the database.";
    } else {
      initialData = {
        id: data.id,
        introduction: data.introduction_text || '',
        mainContentJson: data.main_content_json || [],
        ctaText: data.cta_text || '',
        ctaLink: data.cta_link || '',
        sectionsJson: data.sections_json || [],
        profileImageUrl: data.profile_image_url || '',
        linkedinUrl: data.linkedinUrl || '',
        twitterUrl: data.twitterUrl || '',
      };
    }
  } catch (e) {
    const message = (e && typeof e === 'object' && 'message' in e) ? e.message : String(e);
    console.error('Error fetching About Page for admin:', { message });
    error = 'Failed to load About Page data for editing.';
  }

  // Always render the form; if no row exists yet, the form will start empty
  // and the API will create the row on first save.
  return (
    <div className="container mx-auto">
      {error && (
        <div className="p-4 mb-4 rounded bg-yellow-50 text-yellow-800">
          {error}
        </div>
      )}
      <AboutForm initialData={JSON.parse(JSON.stringify(initialData || {}))} />
    </div>
  );
} 