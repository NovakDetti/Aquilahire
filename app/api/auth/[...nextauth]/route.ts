import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";


async function notifyN8N(event: string, payload: any) {
  const url = process.env.N8N_WEBHOOK_URL;
  const secret = process.env.N8N_SHARED_SECRET;

  if (!url) {
    console.error("[notifyN8N] N8N_WEBHOOK_URL is missing");
    return;
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.N8N_API_KEY ?? "",
        ...(secret ? { "x-n8n-signature": secret } : {}),
      },
      body: JSON.stringify({ event, payload, ts: Date.now() }),
    });

    console.log("[notifyN8N] sent", event, "status:", res.status);

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("[notifyN8N] n8n error:", res.status, text);
    }
  } catch (err) {
    console.error("[notifyN8N] fetch failed:", err);
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
  events: {
    async signIn({ user, account, profile }) {
      await notifyN8N("signIn", { user, account, profile });
    },
    async createUser({ user }) {
      await notifyN8N("createUser", { user });
    },
    async linkAccount({ user, account }) {
      await notifyN8N("linkAccount", { user, account });
    },
    async session({ session, token }) {
      await notifyN8N("session", { session, token });
    },
    async signOut({ token }) {
      await notifyN8N("signOut", { token });
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
