import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import Image from 'next/image'; // Import Next.js Image component
import Link from 'next/link';   // Import Next.js Link component for navigation
import WorkGrid from './components/WorkGrid';
import prisma from '../lib/prisma';

export const revalidate = 60; // Optional: ISR

export default async function Home() {
  let articles = [];
  let error = null;

  // TEMPORARY DEBUGGING LOG: Verify DATABASE_URL from Vercel's perspective
  console.log("Vercel Runtime DATABASE_URL (first 30 chars):", process.env.DATABASE_URL?.substring(0, 30));
  console.log("Vercel Runtime DATABASE_URL length:", process.env.DATABASE_URL?.length);

  try {
    const fetchedArticles = await prisma.article.findMany({
      where: { status: 'Published' },
      orderBy: { publishedDate: 'desc' },
      select: {
        id: true,
        title: true,
        url: true,
        publication: true,
        thumbnailUrl: true,
        publishedDate: true,
        tags: true,
      }
    });

    // Transform to WorkGrid.js shape
    const transformedArticles = fetchedArticles.map(article => ({
      id: article.id,
      URL: article.url || '#',
      Title: article.title || 'Untitled Article',
      PublicationDate: article.publishedDate ? article.publishedDate.toISOString() : null,
      image: { url: article.thumbnailUrl || '/placeholder.png' },
      tags: Array.isArray(article.tags)
        ? article.tags.map((tag, idx) => ({ id: `${article.id}-tag-${idx}`, name: tag }))
        : [],
      publication: article.publication || 'Uncategorized',
    }));

    // Group by publication
    const publicationGroupsMap = {};
    for (const article of transformedArticles) {
      const pub = article.publication;
      if (!publicationGroupsMap[pub]) {
        publicationGroupsMap[pub] = { publicationName: pub, articles: [] };
      }
      publicationGroupsMap[pub].articles.push(article);
    }
    articles = Object.values(publicationGroupsMap).sort((a, b) =>
      a.publicationName.localeCompare(b.publicationName)
    );
  } catch (e) {
    // CRITICAL: Log the full error object here!
    console.error("Error fetching articles FROM VERCEL:", e);
    error = "Failed to load articles. Please check your database connection and RLS policies.";
    // Optionally, for advanced debugging, you could also expose more of the error message to the UI
    // For now, let's just focus on the logs.
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-red-500">
        <h1 className="text-4xl font-bold mb-8">Featured Work</h1>
        <p>{error}</p>
        {/* Optional: Display more specific error for debugging */}
        {/* <p>Details: {e?.message || e?.name || "Unknown error"}</p> */}
      </div>
    );
  }

  return <WorkGrid publicationGroups={articles} />;
}