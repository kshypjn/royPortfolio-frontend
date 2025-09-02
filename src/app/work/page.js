import WorkGrid from '../components/WorkGrid';
import Footer from '../components/Footer';
import { supabase } from '@/lib/supabaseClient';

export const revalidate = 60; // Optional: ISR

export default async function WorkPage() {
  let articles = [];
  let error = null;

  try {
    const { data: fetchedArticles, error: fetchError } = await supabase
      .from('Articles')
      .select('id, title, url, publication, thumbnailUrl, publishedDate, tags')
      .eq('status', 'Published')
      .order('publishedDate', { ascending: false });

    if (fetchError) throw fetchError;

    // Transform to WorkGrid.js shape
    const transformedArticles = (fetchedArticles || []).map(article => ({
      id: article.id,
      URL: article.url || '#',
      Title: article.title || 'Untitled Article',
      PublicationDate: article.publishedDate || null,
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
    const message = (e && typeof e === 'object' && 'message' in e) ? e.message : String(e);
    console.error('Error fetching articles:', { message });
    error = 'Failed to load articles. Please check your database connection and RLS policies.';
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