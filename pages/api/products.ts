import { Prisma } from "@prisma/client";
import { NextApiHandler } from "next";
import { unstable_getServerSession } from "next-auth/next";
import SuperJSON from "superjson";
import { z } from "zod";

import { authOptions } from "~/lib/auth/config";
import db from "~/prisma";

const schema = z.object({
  code: z.string().transform((val) => val.toLocaleLowerCase("hr")),
});

const handler: NextApiHandler = async (req, res) => {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const query = schema.safeParse(req.query);
  if (!query.success) {
    return res.status(400).json({ error: query.error });
  }

  if (!query.data.code) {
    return res.status(200).json(SuperJSON.serialize({ products: [], hasMore: false }));
  }

  const matches: Record<string, string[]> = {
    c: ["c", "č", "ć"],
    d: ["d", "đ"],
    s: ["s", "š"],
    z: ["z", "ž"],
  };
  const prepareWhere = (code: string, searchType: "contains" | "equals" | "startsWith") => {
    if (!Object.keys(matches).some((key) => code.includes(key))) {
      return { code: { [searchType]: code } } satisfies Prisma.ProductWhereInput;
    }

    const where = { OR: [] as any };
    code.split("").forEach((char, i) => {
      const match = matches[char];

      if (match) {
        match.forEach((m) => {
          const arr = code.split("");
          arr[i] = m;

          where.OR!.push({ code: { [searchType]: arr.join(""), mode: "insensitive" } });
        });
      }
    });

    return where;
  };

  const rawProducts = await db.product.findMany({
    where: prepareWhere(query.data.code, "contains"),
    include: { inventoryEntries: { where: { deletedAt: null } } },
    take: 6,
  });

  const exactProducts = await db.product.findMany({
    where: prepareWhere(query.data.code, "startsWith"),
    include: { inventoryEntries: { where: { deletedAt: null } } },
    take: 2,
  });

  const allProducts = [...exactProducts, ...rawProducts.slice(0, 5)].filter(
    (p, i, arr) => arr.findIndex((p2) => p2.id === p.id) === i
  );

  res.status(200).json(
    SuperJSON.serialize({
      products: allProducts.map((p) => ({
        ...p,
        currentCount: p.inventoryEntries.reduce((acc, entry) => acc + entry.quantity, 0),
      })),
      hasMore: rawProducts.length === 6,
    })
  );
};

export default handler;
