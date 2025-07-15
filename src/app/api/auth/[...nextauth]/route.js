import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

// Remove all Supabase-related code and references

export const authOptions = {
  // Configure authentication providers
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials.password) {
          return null; // No credentials provided
        }

        try {
          // Attempt to sign in the user directly with Supabase Auth
          // This part of the logic needs to be adapted for Prisma
          // For now, we'll return null as Supabase is removed.
          // In a real scenario, you would integrate with your Prisma schema
          // to validate credentials and return a user object.
          console.warn("Supabase authentication logic removed. Credentials validation skipped.");
          return null; // Authentication failed
        } catch (error) {
          console.error("Error during NextAuth authorize function:", error);
          return null;
        }
      },
    }),
    // Add Google Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  // Configure session management
  session: {
    strategy: "jwt", // Use JWT for session management
  },
  // Callbacks for JWT and Session management
  callbacks: {
    async jwt({ token, user, account }) {
      // If a user logs in via OAuth (like Google), account object will be available
      if (account && user) {
        token.accessToken = account.access_token; // Store Google access token if needed
        token.id = user.id; // Store Supabase user ID
        token.email = user.email; // Store email
        token.name = user.name || user.email; // Store name
        // You might need to check how user.id is populated for Google auth here.
        // NextAuth maps the OAuth profile's ID to user.id, which should be the Supabase user ID.
      } else if (user) { // For credentials provider
        token.id = user.id;
        token.email = user.email;
        token.name = user.name || user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
      }
      return session;
    },
  },
  // Define custom pages (e.g., login page)
  pages: {
    signIn: "/admin/login", // Redirect to your custom login page
  },
  // Secret for signing the JWTs
  secret: process.env.NEXTAUTH_SECRET,
};

// Export the handler for NextAuth
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 