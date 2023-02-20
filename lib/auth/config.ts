import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
// import { PrismaAdapter } from "@next-auth/prisma-adapter";

import db from "~/prisma";
import { isDev } from "~/lib";
import { checkPassword } from "~/lib/auth/password";

export const authOptions: NextAuthOptions = {
  // adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  // TODO: figure out how to use this properly
  callbacks: {
    jwt: async ({ token, user }) => {
      user && (token.user = user);
      return token;
    },
    session: async ({ session, token }) => {
      // @ts-expect-error
      session.user = token.user;
      return session;
    },
  },
  providers: [
    Credentials({
      type: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "zeljko@tucic.hr",
          ...(isDev && { value: "foo@bar.com" }),
        },
        password: { label: "Password", type: "password", ...(isDev && { value: "foobar123" }) },
      },
      authorize: async (credentials) => {
        if (!credentials) {
          return null;
        }

        const user = await db.user.findUnique({
          select: {
            id: true,
            name: true,
            email: true,
            accounts: {
              where: {
                provider: "credentials",
              },
            },
          },
          where: {
            email: credentials.email,
          },
        });

        if (!user || user.accounts.length === 0 || !user.accounts[0]!.access_token) {
          return null;
        }

        const passwordOk = await checkPassword(credentials.password, user.accounts[0]!);
        if (!passwordOk) {
          return null;
        }

        const { accounts, ...restOfUser } = user;

        return restOfUser;
      },
    }),
  ],
};
