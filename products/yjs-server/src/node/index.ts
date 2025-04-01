import { createNodeWebSocket } from "@hono/node-ws";
import { serve } from "@hono/node-server";
import { createHocuspocus } from "../hocuspocus.js";
import { createApp } from "../.";
import pkg from "../../package.json";

export const createNodeServer = () => {
  const app = createApp();
  const hocuspocus = createHocuspocus();

  const { upgradeWebSocket, injectWebSocket } = createNodeWebSocket({ app });

  app.get(
    "/ws",
    upgradeWebSocket((c) => ({
      onOpen(_evt, ws) {
        if (!ws.raw) {
          throw new Error("WebSocket is not initialized");
        }

        hocuspocus.handleConnection(ws.raw, c.req.raw as any);
      },
    }))
  );

  app.get("/", (c) => {
    return c.json({
      status: "ok",
      message: `${pkg.name}: running`,
    });
  });

  const server = serve(app);
  injectWebSocket(server);

  const stop = (message: string = `${pkg.name}: shutting down`) => {
    console.log(message);
    hocuspocus.closeConnections();
    hocuspocus.destroy();
    process.exit(0);
  };

  process.on("SIGINT", stop);
  process.on("SIGTERM", stop);
};

createNodeServer();
