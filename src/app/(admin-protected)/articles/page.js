import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import ManageArticlesClient from "./ManageArticlesClient";

export default async function ManageArticlesPage() {
  const session = await getServerSession(authOptions);
  const allowedEmails = process.env.ALLOWED_ADMIN_EMAILS?.split(',').map(e => e.trim());

  if (!session || !allowedEmails?.includes(session.user.email)) {
    redirect("/admin/login?error=AccessDenied");
  }

  return <ManageArticlesClient />;
} 