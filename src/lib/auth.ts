import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import prisma from "@/lib/prisma";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 روز
  },
  pages: {
    signIn: "/auth/login",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        identifier: { label: "شناسه", type: "text" },
        code: { label: "کد تأیید", type: "text" },
      },
      async authorize(credentials) {
        const identifier = credentials?.identifier?.trim();
        const code = credentials?.code?.trim();

        if (!identifier || !code) return null;

        const verificationRecord = await prisma.verificationCode.findFirst({
          where: {
            identifier,
            code,
            expiresAt: { gt: new Date() },
            used: false,
          },
        });

        if (!verificationRecord) return null;

        await prisma.verificationCode.update({
          where: { id: verificationRecord.id },
          data: { used: true },
        });

        const isEmail = identifier.includes("@");
        const normalizedIdentifier = isEmail ? identifier.toLowerCase() : identifier;

        let user = await prisma.user.findFirst({
          where: {
            OR: [
              isEmail ? { email: normalizedIdentifier } : { phone: normalizedIdentifier },
            ],
          },
        });

        if (!user) {
          user = await prisma.user.create({
            data: isEmail
              ? { 
                  email: normalizedIdentifier, 
                  emailVerified: new Date() 
                }
              : { 
                  phone: normalizedIdentifier,
                  email: null // اضافه شد برای رفع خطای Prisma
                },
          });
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          phone: user.phone,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        if (!profile?.email) {
          console.error("[signIn] Google profile has no email.");
          return false;
        }
        try {
          const userExists = await prisma.user.findUnique({
            where: { email: profile.email },
          });

          if (!userExists) {
            const newUser = await prisma.user.create({
              data: {
                email: profile.email,
                name: profile.name,
                image: (profile as any).picture,
                emailVerified: new Date(),
              },
            });
            user.id = newUser.id; // Pass new user's ID to JWT callback
          } else {
            user.id = userExists.id; // Pass existing user's ID to JWT callback
          }

          const accountExists = await prisma.account.findUnique({
            where: {
              provider_providerAccountId: {
                provider: account.provider,
                providerAccountId: account.providerAccountId,
              },
            },
          });

          if (!accountExists) {
            await prisma.account.create({
              data: {
                userId: user.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                access_token: account.access_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
                session_state: account.session_state,
              },
            });
          }
          return true;
        } catch (error) {
          console.error("[signIn] Error during Google user/account handling:", error);
          return false;
        }
      }
      return true;
    },

    async jwt({ token, user, account, trigger }) {
      // On initial sign in
      if (account && user) {
        token.id = user.id;
        token.provider = account.provider;
        
        // Fetch full user details from DB to populate token
        const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
        });

        if (dbUser) {
            token.name = dbUser.name;
            token.email = dbUser.email;
            token.picture = dbUser.image;
            (token as any).phone = dbUser.phone;
        }
      }

      // **اضافه شد**: پشتیبانی از trigger update
      if (trigger === "update" && token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { name: true, email: true, phone: true, image: true },
        });

        if (dbUser) {
          token.name = dbUser.name;
          token.email = dbUser.email;
          token.picture = dbUser.image;
          (token as any).phone = dbUser.phone;
        }
      }

      return token;
    },

    async session({ session, token }) {
      // Send properties to the client
      if (token) {
        (session.user as any).id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture as string | undefined;
        (session.user as any).phone = (token as any).phone;
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      // If URL is a relative path, make it absolute
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // If URL is already absolute and on our domain, allow it
      if (new URL(url).origin === baseUrl) return url;
      // Default redirect to profile page
      return `${baseUrl}/profile`;
    },
  },
};
