import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Handler for PATCH requests (to update the AboutPage)
export async function PATCH(request) {
  try {
    const body = await request.json();

    // Find the single AboutPage entry (we assume there's only one)
    const existingAboutPage = await prisma.aboutPage.findFirst();

    if (!existingAboutPage) {
      return NextResponse.json({ message: 'About page entry not found.' }, { status: 404 });
    }

    // Update the existing AboutPage entry
    const updatedAboutPage = await prisma.aboutPage.update({
      where: { id: existingAboutPage.id }, // Use the ID of the existing entry
      data: {
        introduction: body.introduction,
        mainContentJson: body.mainContentJson, // Ensure this is valid JSON
        ctaText: body.ctaText,
        ctaLink: body.ctaLink,
        sectionsJson: body.sectionsJson, // Ensure this is valid JSON
        profileImageUrl: body.profileImageUrl,
        linkedinUrl: body.linkedinUrl,
        twitterUrl: body.twitterUrl,
      },
    });

    return NextResponse.json(updatedAboutPage, { status: 200 });

  } catch (error) {
    console.error('Error updating About Page:', error);
    return NextResponse.json(
      { message: 'Failed to update About Page.', error: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 