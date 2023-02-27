import { Session } from "next-auth";

import db from "~/prisma";
import { requireLogin } from "~/lib/auth/helpers";
import { Header } from "~/components/Header";
import { EntriesLayout } from "~/components/EntriesLayout";

export type InventoryEntryWithProduct = Awaited<
  ReturnType<typeof getLastEntries>
>[number];
const getLastEntries = async (session: Session) => {
  const inventoryEntries = await db.inventoryEntry.findMany({
    where: { userId: session.user?.id, deletedAt: null },
    select: {
      id: true,
      quantity: true,
      backupCode: true,
      product: {
        select: {
          name: true,
          code: true,
          quantity: true,
          inventoryEntries: {
            where: { deletedAt: null },
            select: {
              quantity: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return inventoryEntries.map(({ product, ...rest }) => ({
    ...rest,
    ...(product === null
      ? null
      : {
          product: {
            name: product.name,
            code: product.code,
            quantity: product.quantity,
            loggedQuantity: product.inventoryEntries.reduce(
              (acc, entry) => acc + entry.quantity,
              0
            ),
          },
        }),
  }));
};

export default async function App() {
  const session = await requireLogin();
  const lastEntries = await getLastEntries(session);

  const allProductCodes = await db.product.findMany({
    select: { id: true, code: true, name: true },
  });

  return (
    <div
      style={{
        position: "relative",
        backgroundColor: "#121212",
        height: "100vh",
      }}
    >
      <Header />
      <div style={{ padding: "0 80px" }}>
        <EntriesLayout
          allProductCodes={allProductCodes}
          lastEntries={lastEntries}
        />
      </div>
    </div>
  );
}
