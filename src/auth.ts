import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import Credentials from "next-auth/providers/credentials";
import { FirestoreAdapter } from "@auth/firebase-adapter";
import { cert } from "firebase-admin/app";

function createAuth() {
  // During build without env vars, return stubs
  if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_PRIVATE_KEY || process.env.FIREBASE_PRIVATE_KEY === "PLACEHOLDER") {
    return NextAuth({
      providers: [],
      session: { strategy: "jwt" as const },
    });
  }

  const firebaseCert = cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  });

  // Lazy import to avoid circular deps
  const getDb = async () => {
    const { db } = await import("@/lib/firebase-admin");
    return db;
  };

  return NextAuth({
    adapter: FirestoreAdapter({ credential: firebaseCert }),
    providers: [
      Google({
        clientId: process.env.AUTH_GOOGLE_ID,
        clientSecret: process.env.AUTH_GOOGLE_SECRET,
      }),
      Resend({
        from: process.env.RESEND_FROM_EMAIL || "noreply@rajt.org",
      }),
      Credentials({
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          if (!credentials?.email || !credentials?.password) return null;

          const email = (credentials.email as string).toLowerCase();
          const password = credentials.password as string;

          const db = await getDb();
          const snap = await db
            .collection("access_requests")
            .where("email", "==", email)
            .where("status", "==", "approved")
            .get();

          if (snap.empty) return null;

          const doc = snap.docs[0].data();
          if (!doc.passwordHash) return null;

          const { createHash } = await import("crypto");
          const hash = createHash("sha256")
            .update(password + doc.salt)
            .digest("hex");

          if (hash !== doc.passwordHash) return null;

          return { id: snap.docs[0].id, email, name: doc.name || email };
        },
      }),
    ],
    session: { strategy: "jwt" as const },
    pages: {
      signIn: "/login",
      error: "/login",
    },
    callbacks: {
      async signIn({ user }) {
        if (!user?.email) return false;
        const email = user.email.toLowerCase();

        if (email === process.env.ADMIN_EMAIL?.toLowerCase()) return true;

        const db = await getDb();
        const snap = await db
          .collection("access_requests")
          .where("email", "==", email)
          .where("status", "==", "approved")
          .get();

        if (snap.empty) {
          return "/request-access?reason=not-approved";
        }

        return true;
      },
      async jwt({ token, user }) {
        if (user?.email) {
          const email = user.email.toLowerCase();
          token.isAdmin = email === process.env.ADMIN_EMAIL?.toLowerCase();
          token.approved = true;
        }
        return token;
      },
      async session({ session, token }) {
        if (session.user) {
          session.user.isAdmin = token.isAdmin as boolean;
          session.user.approved = token.approved as boolean;
        }
        return session;
      },
    },
  });
}

export const { handlers, auth, signIn, signOut } = createAuth();

// Extend the session type
declare module "next-auth" {
  interface Session {
    user: {
      email?: string | null;
      name?: string | null;
      image?: string | null;
      isAdmin?: boolean;
      approved?: boolean;
    };
  }
}
