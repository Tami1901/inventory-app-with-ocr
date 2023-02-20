// @ts-check

import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../lib/auth/hashPassword.mjs";

const db = new PrismaClient();

(async () => {
  const password = await hashPassword("foobar123");

  await db.user.create({
    data: {
      email: "foo@bar.com",
      name: "Foo Bar",
      accounts: {
        create: {
          provider: "credentials",
          providerAccountId: "",
          type: "password",
          access_token: password,
        },
      },
    },
  });

  await db.$disconnect();
})();
