import { PrismaClient } from '@prisma/client';
import AboutPageClient from './AboutPageClient';

const prisma = new PrismaClient();

export const revalidate = 7200; 

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
    const fetchedData = await prisma.aboutPage.findFirst();

    if (!fetchedData) {
     
      error = "About page content not found in database. Please ensure you've added a row to the 'about_page' table.";
    } else {
      aboutContentForClient = {
        data: {
          introduction: fetchedData.introduction,
          ctaText: fetchedData.ctaText,
          ctaLink: fetchedData.ctaLink,

         
          mainContentJson: fetchedData.mainContentJson || [],
          sectionsJson: fetchedData.sectionsJson || [],

          profileImageUrl: fetchedData.profileImageUrl,
          linkedinUrl: fetchedData.linkedinUrl,
          twitterUrl: fetchedData.twitterUrl,
        }
      };
    }

  } catch (e) {
    console.error("Error fetching About Page content:", e); 

    error = `Failed to load about me content. Details: ${e.message}. Please check database connection, RLS policies, and data integrity.`; //
  }

  if (error) {
    return (
      <main className="bg-white min-h-screen flex flex-col items-center py-10 px-2 sm:px-0">
        <div className="w-full sm:max-w-4xl sm:bg-white sm:rounded-2xl sm:shadow-xl sm:border sm:border-gray-100 sm:p-12 text-red-500">
          <h1 className="text-4xl font-bold mb-8">About Me Error</h1>
          <p>{error}</p>
          <p className="mt-4 text-gray-700">
            Please ensure:
            <ul className="list-disc list-inside ml-4">
              <li>You have exactly one row in your `about_page` table in Supabase.</li>
              <li>All JSON fields (`main_content_json`, `sections_json`) contain valid JSON (even `[]` if empty).</li>
              <li>The RLS policy for `about_page` allows `SELECT` for the `public` role.</li>
            </ul>
          </p>
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