import { z } from "zod";

export const isDev = process.env.NODE_ENV === "development";

export const idParams = z.object({
  id: z.coerce.number(),
});
