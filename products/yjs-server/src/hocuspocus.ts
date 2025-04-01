import * as CONSTANTS from "./constants";
import { Server } from "@hocuspocus/server";
import { Throttle } from "@hocuspocus/extension-throttle";
import { Logger } from "@hocuspocus/extension-logger";

export const createHocuspocus = () =>
  Server.configure({
    extensions: [
      new Logger({
        onLoadDocument: true,
        onConnect: true,
        onDisconnect: true,
        onUpgrade: true,
        onRequest: true,
      }),
      new Throttle({
        throttle: CONSTANTS.THROTTLE_CONNECTIONS,
        banTime: CONSTANTS.THROTTLE_BAN_TIME,
      }),
    ],
  });
