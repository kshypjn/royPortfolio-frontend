import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google"; // Import Google Provider
import { createClient } from "@supabase/supabase-js"; // Import Supabase client

// Initialize a Supabase client for server-side auth calls
// It uses the service_role key to directly interact with auth.users
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY, // Use the service role key here!
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

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
          const { data: authData, error: authError } = await supabaseAdmin.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password,
          });

          if (authError) {
            console.error("Supabase authentication error:", authError.message);
            // Return null or throw an error depending on how you want to handle
            return null; // Authentication failed
          }

          // Check if Supabase returned a user and a session
          if (authData.user && authData.session) {
            // Return a user object that NextAuth expects.
            // NextAuth will then create a session based on this user object.
            return {
              id: authData.user.id,
              email: authData.user.email,
              name: authData.user.user_metadata?.full_name || authData.user.email, // Use full_name if available, else email
              // You can add other properties from authData.user here if needed for your session
            };
          }
          return null; // Authentication failed (no user or session)
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