// ════════════════════════════════════════════════════════════
// Next.js এ NextAuth setup (app/api/auth/[...nextauth]/route.js)
// ════════════════════════════════════════════════════════════
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

const handler = NextAuth({
  providers: [
    // Credentials (email/password)
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const res = await fetch(`${process.env.BACKEND_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          const data = await res.json();
          if (!res.ok || !data.success) throw new Error(data.message || 'Login failed');

          // user object NextAuth এ save হবে
          return {
            id: data.user._id,
            name: data.user.name,
            email: data.user.email,
            role: data.user.role,
            avatar: data.user.avatar,
            backendToken: data.token, // আমাদের Express JWT
          };
        } catch (error) {
          throw new Error(error.message);
        }
      },
    }),

    // Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  callbacks: {
    // Google login হলে backend এ user sync করা
    async signIn({ user, account }) {
      if (account.provider === 'google') {
        try {
          const res = await fetch(`${process.env.BACKEND_URL}/api/auth/oauth-sync`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-nextauth-secret': process.env.NEXTAUTH_SECRET,
            },
            body: JSON.stringify({
              name: user.name,
              email: user.email,
              provider: 'google',
              providerId: account.providerAccountId,
              avatar: user.image,
            }),
          });

          const data = await res.json();
          if (data.success) {
            user.id = data.userId;
            user.role = data.role;
          }
        } catch (error) {
          console.error('OAuth sync failed:', error);
        }
      }
      return true;
    },

    // JWT callback - token এ extra data রাখা
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.backendToken = user.backendToken;
        token.avatar = user.avatar;
      }
      return token;
    },

    // Session callback - client এ accessible data
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.backendToken = token.backendToken;
      session.user.avatar = token.avatar;
      return session;
    },
  },

  pages: {
    signIn: '/login',
    error: '/login',
  },

  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },

  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };


// ════════════════════════════════════════════════════════════
// Next.js API call helper (lib/api.js)
// Backend call করতে এই function use করুন
// ════════════════════════════════════════════════════════════
export const apiFetch = async (endpoint, options = {}, session = null) => {
  const headers = { 'Content-Type': 'application/json', ...options.headers };

  // Session থেকে backend token attach করা
  if (session?.user?.backendToken) {
    headers.Authorization = `Bearer ${session.user.backendToken}`;
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'API Error');
  return data;
};


// ════════════════════════════════════════════════════════════
// Component এ use করার example (app/products/page.js)
// ════════════════════════════════════════════════════════════
/*
import { getServerSession } from 'next-auth';
import { apiFetch } from '@/lib/api';

// Server Component
export default async function ProductsPage({ searchParams }) {
  const session = await getServerSession();
  const data = await apiFetch(
    `/api/products?page=${searchParams.page || 1}&keyword=${searchParams.q || ''}`,
    {},
    session
  );

  return <div>{data.products.map(p => <div key={p._id}>{p.name}</div>)}</div>;
}
*/
