import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "../auth/[...nextauth]/route";

const prisma = new PrismaClient();

// Helper to validate URLs (simple regex)
const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

// GET handler to fetch all articles (for admin list)
export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
  }
  try {
    const articles = await prisma.article.findMany({
      orderBy: { publishedDate: "desc" },
    });
    return NextResponse.json(articles);
  } catch (error) {
    console.error("Error fetching articles:", error);
    return new NextResponse(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
  }
}

// POST handler to create a new article
export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
  }
  try {
    const body = await request.json();
    const { title, url, publication, thumbnailUrl, publishedDate, tags } = body;
    if (!title || title.trim() === '') {
      return new NextResponse(JSON.stringify({ message: "Title is required." }), { status: 400 });
    }
    if (!url || !isValidUrl(url)) {
      return new NextResponse(JSON.stringify({ message: "A valid URL is required." }), { status: 400 });
    }
    if (!publication || publication.trim() === '') {
      return new NextResponse(JSON.stringify({ message: "Publication is required." }), { status: 400 });
    }
    if (!publishedDate || isNaN(new Date(publishedDate).getTime())) {
      return new NextResponse(JSON.stringify({ message: "A valid Published Date is required." }), { status: 400 });
    }
    const tagsArray = tags
      ? tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
      : [];
    const newArticle = await prisma.article.create({
      data: {
        title,
        url,
        publication,
        thumbnailUrl: thumbnailUrl || null,
        publishedDate: new Date(publishedDate),
        tags: tagsArray,
      },
    });
    return NextResponse.json(newArticle, { status: 201 });
  } catch (error) {
    console.error("Error creating article:", error);
    if (error.code === 'P2002' && error.meta?.target?.includes('url')) {
      return new NextResponse(JSON.stringify({ message: "An article with this URL already exists." }), { status: 409 });
    }
    return new NextResponse(JSON.stringify({ message: "Failed to create article due to an internal server error." }), { status: 500 });
  }
} 