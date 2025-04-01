import * as CONSTANTS from "./constants";
import { Hono } from "hono";
import { cors } from "hono/cors";

export const createApp = () => {
  const app = new Hono();

  app.use(
    "/*",
    cors({
      origin: CONSTANTS.ALLOWED_DOMAINS,
      allowHeaders: [
        "Content-Type",
        "Authorization",
        "X-Requested-With",
        "Upgrade-Insecure-Requests",
        "Connection",
        "Upgrade",
        "Sec-WebSocket-Key",
        "Sec-WebSocket-Version",
        "Sec-WebSocket-Extensions",
        "Sec-WebSocket-Protocol",
      ],
      allowMethods: ["POST", "GET", "OPTIONS"],
      exposeHeaders: ["Content-Length", "Upgrade", "Connection"],
      maxAge: 600,
      credentials: true,
    })
  );

  return app;
};
