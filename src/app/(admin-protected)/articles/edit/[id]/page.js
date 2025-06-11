import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../api/auth/[...nextauth]/route";
import { redirect, notFound } from 'next/navigation';
import ArticleEditForm from '../../../../../components/ArticleEditForm'; // Adjust path if needed

const prisma = new PrismaClient();

export default async function EditArticlePage({ params }) {
  const session = await getServerSession(authOptions);

  // 1. Authentication Check
  if (!session) {
    redirect("/admin/login");
  }

  const articleId = params.id;

  // 2. Fetch Article Data (Server-Side)
  let article = null;
  try {
    article = await prisma.article.findUnique({
      where: {
        id: articleId,
      },
    });
  } catch (error) {
    console.error("Error fetching article:", error);
    // Optionally redirect to an error page or show a generic error
    notFound(); // If database error, treat as not found for user experience
  }

  // 3. Handle Article Not Found
  if (!article) {
    notFound(); // Next.js built-in notFound() for 404 page
  }

  // 4. Render the Client Component with fetched data
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Article: {article.title}</h2>
      <ArticleEditForm article={article} />
    </div>
  );
} 