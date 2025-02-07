import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from 'next-auth/providers/google'
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";
import { env } from "@/env";
import { db } from "@/server/db";
import { PaymentType } from "@prisma/client";


interface Plan {
  type: PaymentType;
  status: string;
  trialStartedAt: Date | null;
  renewsAt: Date | null;
  hasTakenTrial: boolean;
}

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      plan: Plan | null;
      referrer: string | null;
    } & DefaultSession["user"];
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session: async ({ session, user }) => {
      const userEntity = await db.user.findUnique({
        where: {
          id: user.id
        },
        include: {
          plan: true,
          payments: {
            where: {
              type: PaymentType.TRIAL
            }
          }
        }
      });

      let plan: Plan | null = null;
      if (!userEntity?.plan) {
        plan = null;
      } else {
        plan = {
          type: userEntity?.plan.type,
          status: userEntity?.plan.status,
          trialStartedAt: userEntity?.plan.type == "TRIAL" ? userEntity?.plan.startedAt : null,
          renewsAt: userEntity?.plan.renewsAt,
          hasTakenTrial: userEntity?.payments.length > 0
        }
      }

      const result = {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          referrer: userEntity?.referrer,
          plan
        },
      };

      return result;
    },
    signIn() {
      // const TESTERS = ["ifedayoprince@gmail.com", "studywithsturdyworks@gmail.com", "reachstudma@gmail.com"];
      // if (!TESTERS.includes(user.email ?? "")) {
      //   return '/beta';
      // }
      return true;
    },
  },
  pages: {
    signIn: "/auth"
  },
  adapter: PrismaAdapter(db) as Adapter,
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET
    })
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
