import db from "~/prisma";
import { apiSend, getAuthenticatedHandler } from "~/lib/api";
import { idParams } from "~/lib";
import { inventoryEntrySchema } from "./index";

const handler = getAuthenticatedHandler();

handler.patch(async (req, res) => {
  const query = idParams.safeParse(req.query);
  if (!query.success) {
    return apiSend(res, 400, { error: query.error });
  }

  const body = inventoryEntrySchema.partial().safeParse(req.body);
  if (!body.success) {
    return apiSend(res, 400, { error: body.error });
  }

  let inventoryEntry = await db.inventoryEntry.findUnique({
    where: {
      id: query.data.id,
      deletedAt: null,
    },
  });

  if (!inventoryEntry) {
    return apiSend(res, 404, { error: "Not found" });
  }

  if (inventoryEntry.userId !== req.session.user!.id) {
    return apiSend(res, 403, { error: "Forbidden" });
  }

  inventoryEntry = await db.inventoryEntry.update({
    where: {
      id: query.data.id,
    },

    data: body.data,
  });

  apiSend(res, 200, inventoryEntry);
});

handler.delete(async (req, res) => {
  const query = idParams.safeParse(req.query);
  if (!query.success) {
    return apiSend(res, 400, { error: query.error });
  }

  const inventoryEntry = await db.inventoryEntry.findUnique({
    where: {
      id: query.data.id,
    },
  });

  if (!inventoryEntry) {
    return apiSend(res, 404, { error: "Not found" });
  }

  if (inventoryEntry.userId !== req.session.user!.id) {
    return apiSend(res, 403, { error: "Forbidden" });
  }

  await db.inventoryEntry.update({ where: { id: query.data.id }, data: { deletedAt: new Date() } });

  apiSend(res, 200, { ok: true });
});

export default handler;
