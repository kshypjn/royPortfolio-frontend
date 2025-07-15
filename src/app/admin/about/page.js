import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import prisma from '../../../lib/prisma';
import AboutForm from './AboutForm';

export const revalidate = 0;

export default async function AdminAboutPage() {
  const session = await getServerSession(authOptions);
  const allowedEmails = process.env.ALLOWED_ADMIN_EMAILS?.split(',').map(e => e.trim());

  if (!session || !allowedEmails?.includes(session.user.email)) {
    redirect("/admin/login?error=AccessDenied");
  }

  let initialData = null;
  let error = null;

  try {
    initialData = await prisma.aboutPage.findFirst();
    if (!initialData) {
      error = "No About Page entry found. Please create one row in the 'about_page' table in the database.";
    }
  } catch (e) {
    console.error("Error fetching About Page for admin:", e);
    error = "Failed to load About Page data for editing.";
  } finally {
    await prisma.$disconnect();
  }

  if (error) {
    return (
      <div className="container mx-auto p-8 text-red-500">
        <h1 className="text-3xl font-bold mb-4">Admin: Edit About Page</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <AboutForm initialData={JSON.parse(JSON.stringify(initialData))} />
    </div>
  );
} 