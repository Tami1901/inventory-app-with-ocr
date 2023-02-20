import { Session } from "next-auth";
import Link from "next/link";

import db from "~/prisma";
import { requireLogin } from "~/lib/auth/helpers";
import { CameraThingWrapper } from "./Camera";
import { EntryActions } from "./EntryActions";
import { InsertProduct } from "./InsertProduct";
import { Header } from "~/components/Header";
import { LastInputs } from "~/components/LastInputs";

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
    <>
      <Header />
      <div style={{ padding: "4px 80px" }}>
        <InsertProduct allProductCodes={allProductCodes} />

        <LastInputs lastEntries={lastEntries} />
      </div>
    </>
  );
}
