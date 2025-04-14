import * as CONSTANTS from "./constants";
import { Logger } from "@hocuspocus/extension-logger";
import { Server } from "@hocuspocus/server";
import type { IncomingMessage } from "http";
import { createNodeWebSocket } from "@hono/node-ws";
import { Hono } from "hono";
import { cors } from "hono/cors";
import pkg from "../package.json";
import { serve } from "@hono/node-server";

export const createApp = () => {
  const hocuspocus = Server.configure({
    // async onAuthenticate(data) {
    //   const { token } = data;
    //   return true;
    // },
    extensions: CONSTANTS.LOG
      ? [
          new Logger({
            onLoadDocument: true,
            onConnect: true,
            onDisconnect: true,
            onUpgrade: true,
            onRequest: true,
          }),
        ]
      : [],
  });

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

  const { injectWebSocket, upgradeWebSocket } = createNodeWebSocket({ app });

  app.get(
    "/sync",
    upgradeWebSocket((c) => ({
      onOpen(_evt, ws) {
        if (!ws.raw) {
          return;
        }
        hocuspocus.handleConnection(
          ws.raw,
          c.req.raw as unknown as IncomingMessage
        );
      },
    }))
  );

  app.get("/status", (c) =>
    c.json({
      status: "ok",
      name: pkg.name,
      version: pkg.version,
    })
  );

  const server = serve({
    fetch: app.fetch,
    port: CONSTANTS.PORT,
  });

  console.log(`${pkg.name}: running on port ${CONSTANTS.PORT}`);

  injectWebSocket(server);

  const stop = (message: string = `${pkg.name}: shutting down`) => {
    console.log(message);
    hocuspocus.closeConnections();
    hocuspocus.destroy();
    process.exit(0);
  };

  return {
    hocuspocus,
    server,
    stop,
    app,
  };
};
