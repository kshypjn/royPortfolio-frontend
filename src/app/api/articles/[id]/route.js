import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route"; // Adjust path if needed

const prisma = new PrismaClient();

export async function PUT(request, { params }) {
  const session = await getServerSession(authOptions);

  // 1. Authentication/Authorization Check
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const articleId = params.id;
  if (!articleId) {
    return NextResponse.json({ message: 'Article ID is required' }, { status: 400 });
  }

  try {
    const body = await request.json();
    // Extract fields allowed for update (match your schema.prisma)
    const { title, url, publication, thumbnailUrl, publishedDate, tags, status } = body;

    // Basic validation (can be more robust with a validation library)
    if (!title || !url || !publication || !publishedDate) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Ensure publishedDate is a valid ISO string or Date object for Prisma
    let parsedPublishedDate = null;
    if (publishedDate) {
        try {
            parsedPublishedDate = new Date(publishedDate);
            if (isNaN(parsedPublishedDate.getTime())) {
                throw new Error("Invalid date format");
            }
        } catch (dateError) {
            console.error("Invalid publishedDate format:", publishedDate, dateError);
            return NextResponse.json({ message: 'Invalid publishedDate format' }, { status: 400 });
        }
    }


    // 2. Update Article using Prisma
    const updatedArticle = await prisma.article.update({
      where: { id: articleId },
      data: {
        title,
        url,
        publication,
        thumbnailUrl,
        publishedDate: parsedPublishedDate,
        tags, // Tags should already be an array from the form
        status,
      },
    });

    return NextResponse.json(updatedArticle, { status: 200 });

  } catch (error) {
    console.error('Error updating article:', error);
    // Handle specific Prisma errors if needed (e.g., unique constraint violations)
    if (error.code === 'P2025') { // Prisma error code for record not found
        return NextResponse.json({ message: 'Article not found.' }, { status: 404 });
    }
    if (error.code === 'P2002') { // Prisma unique constraint violation
        return NextResponse.json({ message: `A unique field already exists: ${error.meta?.target}` }, { status: 409 });
    }
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// You might also want a GET handler for this route to fetch a single article
// if your form component decides to fetch from here instead of directly from the page.js
// For now, the page.js fetches it, so a GET here is optional for this specific flow. 