import WorkGrid from '../components/WorkGrid';
import Footer from '../components/Footer';
import prisma from '../../lib/prisma';

export const revalidate = 60; // Optional: ISR

export default async function WorkPage() {
  let articles = [];
  let error = null;

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
    console.error("Error fetching articles:", e);
    error = "Failed to load articles. Please check your database connection and RLS policies.";
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-red-500">
        <h1 className="text-4xl font-bold mb-4">Featured Work</h1>
        <p>{error}</p>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <WorkGrid publicationGroups={articles} />
      <Footer />
    </>
  );
} 