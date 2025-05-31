import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import Image from 'next/image'; // Import Next.js Image component
import Link from 'next/link';   // Import Next.js Link component for navigation
import WorkGrid from './components/WorkGrid';

async function getAboutMeData() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/about-me`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch About Me data');
  }

  return res.json();
}

async function getArticles() {
  // Using populate=* for Strapi v5 to get all immediate relations (like images and tags)
  const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/articles?populate=*`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch Articles data');
  }

  return res.json();
}

export default async function Home() {
  const aboutMe = await getAboutMeData();
  const articlesData = await getArticles(); // Fetch articles data

  const { content } = aboutMe.data; // Correctly accessing content directly from data

  // Handle cases where About Me content might be missing or not in expected format
  if (!content || !Array.isArray(content)) {
    console.error("About Me content is missing or not in expected format:", content);
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-8">My Portfolio</h1>
          <h2 className="text-2xl mt-4">About Me content not available or in unexpected format.</h2>
          <p>Please ensure you&apos;ve saved and published content in Strapi&apos;s &apos;About Me&apos; section.</p>
        </div>
      </main>
    );
  }

  const articles = articlesData.data;

  // Sort articles by PublicationDate descending
  articles.sort((a, b) => {
    const dateA = new Date(a.PublicationDate);
    const dateB = new Date(b.PublicationDate);
    return dateB - dateA;
  });

  // Group articles by publication
  const grouped = articles.reduce((acc, article) => {
    if (!article.publication) return acc;
    if (!acc[article.publication]) acc[article.publication] = [];
    acc[article.publication].push(article);
    return acc;
  }, {});

  const publicationGroups = Object.entries(grouped).map(([publicationName, articles]) => ({
    publicationName,
    articles,
  }));

  if (publicationGroups.length === 0) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-8">Work</h1>
          <p className="text-lg">No articles found. Please add some articles in Strapi!</p>
        </div>
      </main>
    );
  }

  return <WorkGrid publicationGroups={publicationGroups} />;
}