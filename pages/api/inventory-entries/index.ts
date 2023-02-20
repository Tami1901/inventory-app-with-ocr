import { z } from "zod";

import db from "~/prisma";
import { apiSend, getAuthenticatedHandler } from "~/lib/api";

const handler = getAuthenticatedHandler();

export const inventoryEntrySchema = z.object({
  quantity: z.number(),
  code: z.string().optional(),
  productId: z.number(),
});

handler.post(async (req, res) => {
  const body = inventoryEntrySchema.safeParse(req.body);
  if (!body.success) {
    return apiSend(res, 400, { error: body.error });
  }

  const inventoryEntry = await db.inventoryEntry.create({
    data: {
      quantity: body.data.quantity,
      user: { connect: { id: req.session.user.id } },
      product: { connect: { id: body.data.productId } },
    },
  });

  apiSend(res, 201, inventoryEntry);
});

export default handler;
