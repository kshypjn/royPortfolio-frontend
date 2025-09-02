import { supabase } from '@/lib/supabaseClient';
import AboutPageClient from './AboutPageClient';

export const metadata = {
  title: 'About Aditya Roy',
  description: 'Learn more about Aditya Roy, a journalism, media, and economics student.',
  keywords: [
    'Aditya Roy',
    'About',
    'Journalism',
    'Media',
    'Economics',
    'Student',
    'Profile',
    'Ashoka University',
    'Media Studies'
  ],
};

export default async function AboutPage() {
  let aboutContentForClient = null;
  let error = null;

  try {
    const { data, error: fetchError } = await supabase
      .from('AboutPage')
      .select('id, introduction_text, main_content_json, cta_text, cta_link, sections_json, profile_image_url, linkedinUrl, twitterUrl')
      .limit(1)
      .maybeSingle();

    if (fetchError) throw fetchError;

    if (!data) {
      error = "About page content not found in database. Please ensure you've added a row to the 'about_page' table.";
    } else {
      aboutContentForClient = {
        data: {
          introduction: data.introduction_text,
          ctaText: data.cta_text,
          ctaLink: data.cta_link,
          mainContentJson: data.main_content_json || [],
          sectionsJson: data.sections_json || [],
          profileImageUrl: data.profile_image_url,
          linkedinUrl: data.linkedinUrl,
          twitterUrl: data.twitterUrl,
        }
      };
    }

  } catch (e) {
    const safeError = (e instanceof Error)
      ? { name: e.name, message: e.message, stack: e.stack }
      : { message: typeof e === 'string' ? e : String(e) };
    console.error('Error fetching About Page content:', safeError);

    const uiMessage = safeError.message || 'Unknown error';
    error = `Failed to load about me content. Details: ${uiMessage}. Please check database connection, RLS policies, and data integrity.`;
  }

  if (error) {
    return (
      <main className="bg-white min-h-screen flex flex-col items-center py-10 px-2 sm:px-0">
        <div className="w-full sm:max-w-4xl sm:bg-white sm:rounded-2xl sm:shadow-xl sm:border sm:border-gray-100 sm:p-12 text-red-500">
          <h1 className="text-4xl font-bold mb-8">About Me Error</h1>
          <p>{error}</p>
          <div className="mt-4 text-gray-700">
            Please ensure:
            <ul className="list-disc list-inside ml-4">
              <li>You have exactly one row in your `about_page` table in the database.</li>
              <li>All JSON fields (`main_content_json`, `sections_json`) contain valid JSON (even `[]` if empty).</li>
              <li>The RLS policy for `about_page` allows `SELECT` for the `public` role.</li>
            </ul>
          </div>
        </div>
      </main>
    );
  }

  // If no error, proceed to render the client component
  // Ensure aboutContentForClient is not null before parsing
  return (
    <AboutPageClient aboutMe={JSON.parse(JSON.stringify(aboutContentForClient))} />
  );
} 