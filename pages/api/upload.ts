import { IncomingMessage, ServerResponse } from "node:http";
import { createReadStream } from "node:fs";

import { NextApiRequest } from "next";
import { parseStream } from "fast-csv";
import multer from "multer";

import { parseRow } from "~/lib/parser";
import { getAuthenticatedHandler } from "~/lib/api";

const handler = getAuthenticatedHandler();

handler.use(
  multer({
    storage: multer.diskStorage({
      destination: "/tmp/tamtam",
      filename: (req, file, cb) => cb(null, file.originalname),
    }),
  }).single("file")
);

interface UploadReq extends NextApiRequest {
  file: Express.Multer.File;
}

const apiRedirect = (res: ServerResponse<IncomingMessage>, error?: Error) => {
  res.writeHead(307, {
    Location: `${process.env.NEXTAUTH_URL}${
      error ? `/admin/upload?success=false&error=${error.message}` : "/admin/upload?success=true"
    }`,
  });
  res.end();
};

handler.post(async (req: UploadReq, res) => {
  const { path } = req.file;
  parseStream(createReadStream(path), { headers: true })
    .on("data", parseRow)
    .on("error", (err) => apiRedirect(res, err))
    .on("end", () => apiRedirect(res));
});

export default handler;
export const config = {
  api: {
    bodyParser: false,
  },
};
