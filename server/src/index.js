#!/usr/bin/env node

import "dotenv/config";
import { WebSocketServer } from "ws";
import { createServer } from "http";
import * as map from "lib0/map";

<<<<<<< HEAD
import { isValidOrigin, createResponse, stringify, parse } from "./utils.js";
=======
import { isValidOrigin, createResponse } from "./utils.js";
>>>>>>> 2e67cff (removed old version, updated schema for yjs and added nicer scripts and env management)

const wsReadyStateConnecting = 0;
const wsReadyStateOpen = 1;

<<<<<<< HEAD
const PING_TIMEOUT = 30000;
const { PORT = 3000 } = process.env;
=======
const pingTimeout = 30000;
const port = process.env.PORT || 4444;
>>>>>>> 2e67cff (removed old version, updated schema for yjs and added nicer scripts and env management)

const wss = new WebSocketServer({ noServer: true });

const server = createServer((request, response) => {
  if (!isValidOrigin(request)) {
    createResponse(response, {
      code: "forbidden",
      type: "text/plain",
      value: "Origin denied",
    });
    return;
  }

  createResponse(response, {
    code: "ok",
    type: "application/json",
    origin: request.headers.origin,
<<<<<<< HEAD
    value: stringify({ status: "ok" }),
=======
    value: JSON.stringify({ status: "ok" }),
>>>>>>> 2e67cff (removed old version, updated schema for yjs and added nicer scripts and env management)
  });
});

const topics = new Map();

const send = (
  /** @type {{ readyState: number; close: () => void; send: (arg0: string) => void; }} */ conn,
  /** @type {{ type: string; }} */ message
) => {
  if (
    conn.readyState !== wsReadyStateConnecting &&
    conn.readyState !== wsReadyStateOpen
  ) {
    conn.close();
  }
  try {
<<<<<<< HEAD
    conn.send(stringify(message));
=======
    conn.send(JSON.stringify(message));
>>>>>>> 2e67cff (removed old version, updated schema for yjs and added nicer scripts and env management)
  } catch (e) {
    conn.close();
  }
};

const onconnection = (
  /** @type {{ close: any; ping?: any; on?: any; readyState?: number; send?: (arg0: string) => void; }} */ conn
) => {
  const subscribedTopics = new Set();
  let closed = false;
  let pongReceived = true;
  const pingInterval = setInterval(() => {
    if (!pongReceived) {
      conn.close();
      clearInterval(pingInterval);
    } else {
      pongReceived = false;
      try {
        conn.ping();
      } catch (e) {
        conn.close();
      }
    }
<<<<<<< HEAD
  }, PING_TIMEOUT);
=======
  }, pingTimeout);
>>>>>>> 2e67cff (removed old version, updated schema for yjs and added nicer scripts and env management)

  conn.on("pong", () => {
    pongReceived = true;
  });

  conn.on("close", () => {
    subscribedTopics.forEach((topicName) => {
      const subs = topics.get(topicName) || new Set();
      subs.delete(conn);
      if (subs.size === 0) {
        topics.delete(topicName);
      }
    });
    subscribedTopics.clear();
    closed = true;
  });

  conn.on("message", (/** @type {{ toString: () => string; }} */ msg) => {
    /**
     * @type {{ type: any; topics?: any; topic?: any; clients?: any; }}
     */
    let message;
    if (typeof msg === "string" || msg instanceof Buffer) {
<<<<<<< HEAD
      message = parse(msg.toString());
    } else {
      //@ts-ignore
=======
      message = JSON.parse(msg.toString());
    } else {
      // @ts-ignore
>>>>>>> 2e67cff (removed old version, updated schema for yjs and added nicer scripts and env management)
      message = msg;
    }

    if (message && message.type && !closed) {
      switch (message.type) {
        case "subscribe":
          (message.topics || []).forEach((/** @type {any} */ topicName) => {
            if (typeof topicName === "string") {
              const topic = map.setIfUndefined(
                topics,
                topicName,
                () => new Set()
              );
              topic.add(conn);
              subscribedTopics.add(topicName);
            }
          });
          break;
        case "unsubscribe":
          (message.topics || []).forEach((/** @type {any} */ topicName) => {
            const subs = topics.get(topicName);
            if (subs) {
              subs.delete(conn);
              if (subs.size === 0) {
                topics.delete(topicName);
              }
            }
            subscribedTopics.delete(topicName);
          });
          break;
        case "publish":
          if (message.topic) {
            const receivers = topics.get(message.topic);
            if (receivers) {
              message.clients = receivers.size; // Add additional fields as needed
              receivers.forEach(
                (
                  /** @type {{ readyState: number; close: () => void; send: (arg0: string) => void; }} */ receiver
                ) => send(receiver, message)
              );
            }
          }
          break;
        case "ping":
          // @ts-ignore
          send(conn, { type: "pong" });
          break;
        // Handle other message types as necessary
      }
    }
  });
};

wss.on("connection", onconnection);

server.on("upgrade", (request, socket, head) => {
  if (!isValidOrigin(request)) {
    socket.destroy();
    return;
  }

  const handleAuth = (/** @type {any} */ ws) => {
    wss.emit("connection", ws, request);
  };
  wss.handleUpgrade(request, socket, head, handleAuth);
});

<<<<<<< HEAD
server.listen(PORT);

console.log("Server listening on ", PORT);
=======
server.listen(port);

console.log("Server listening on ", port);
>>>>>>> 2e67cff (removed old version, updated schema for yjs and added nicer scripts and env management)
