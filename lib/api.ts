import { IncomingMessage, ServerResponse } from "http";
import { Session, unstable_getServerSession } from "next-auth";
import nextConnect from "next-connect";

import { authOptions } from "~/lib/auth/config";

export const getAuthenticatedHandler = () => {
  const handler = nextConnect<
    IncomingMessage & { session: Session; body: unknown; query: Record<string, string> },
    ServerResponse<IncomingMessage>
  >({
    onNoMatch(req, res) {
      res.statusCode = 405;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: `Method '${req.method}' Not Allowed` }));
    },
  });

  handler.use(async (req, res, next) => {
    // @ts-expect-error
    const session = await unstable_getServerSession(req, res, authOptions);
    if (!session) {
      res.statusCode = 401;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "Unauthorized" }));
      return;
    }

    req.session = session;

    next();
  });

  return handler;
};

export const apiSend = (
  res: ServerResponse<IncomingMessage>,
  code: number,
  body: any = undefined
) => {
  res.statusCode = code;
  if (body) {
    res.setHeader("Content-Type", "application/json");
    res.write(JSON.stringify(body));
  }

  res.end();
};
