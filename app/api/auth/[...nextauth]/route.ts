import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { eq } from "drizzle-orm";

async function ensureUserInDb(email?: string | null, name?: string | null, image?: string | null) {
  if (!email) return;

  const userId = email;

  const existing = await db.select().from(users).where(eq(users.id, userId));

  if (existing.length === 0) {
    await db.insert(users).values({
      id: userId,
      email,
      name: name ?? null,
      image: image ?? null,
    });
  }
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {

      await ensureUserInDb(user.email, user.name, user.image);
      return true;
    },
    async jwt({ token, user }) {
      if (user?.email) {
        (token as any).id = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && (token as any).id) {
        (session.user as any).id = (token as any).id;
      }
      return session;
    },
  },
};


const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
