#!/usr/bin/env node

import "dotenv/config";
import { WebSocketServer } from "ws";
import { createServer } from "http";
import * as map from "lib0/map";

import { isValidOrigin, createResponse } from "./utils.js";

const wsReadyStateConnecting = 0;
const wsReadyStateOpen = 1;

const pingTimeout = 30000;
const port = process.env.PORT || 4444;

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
    value: JSON.stringify({ status: "ok" }),
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
    conn.send(JSON.stringify(message));
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
  }, pingTimeout);

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
      message = JSON.parse(msg.toString());
    } else {
      // @ts-ignore
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

server.listen(port);

console.log("Server listening on ", port);
