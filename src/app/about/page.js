import { supabase } from '@/lib/supabaseClient';
export const dynamic = 'force-dynamic';
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
  let aboutContentForClient = {
    data: {
      introduction: '',
      ctaText: '',
      ctaLink: '',
      mainContentJson: [],
      sectionsJson: [],
      profileImageUrl: '',
      linkedinUrl: '',
      twitterUrl: '',
    }
  };
  let error = null;

  try {
    const { data, error: fetchError } = await supabase
      .from('AboutPage')
      .select('id, introduction_text, main_content_json, cta_text, cta_link, sections_json, profile_image_url, linkedinUrl, twitterUrl')
      .limit(1)
      .maybeSingle();

    if (fetchError) throw fetchError;

    if (!data) {
      // Provide an empty skeleton if no data exists yet
      aboutContentForClient = {
        data: {
          introduction: '',
          ctaText: '',
          ctaLink: '',
          mainContentJson: [],
          sectionsJson: [],
          profileImageUrl: '',
          linkedinUrl: '',
          twitterUrl: '',
        }
      };
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
      : { message: typeof e === 'string' ? e : JSON.stringify(e) };
    console.error('Error fetching About Page content:', safeError);

    const uiMessage = safeError.message || 'Unknown error';
    error = `Failed to load about me content. Details: ${uiMessage}. Please check database connection, RLS policies, and data integrity.`;
    if (!aboutContentForClient) {
      aboutContentForClient = {
        data: {
          introduction: '',
          ctaText: '',
          ctaLink: '',
          mainContentJson: [],
          sectionsJson: [],
          profileImageUrl: '',
          linkedinUrl: '',
          twitterUrl: '',
        }
      };
    }
  }

return (
    <AboutPageClient aboutMe={JSON.parse(JSON.stringify(aboutContentForClient))} />
  );
} 