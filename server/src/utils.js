import { IncomingMessage, ServerResponse } from "http";
import { is, set, string } from "valibot";

export const isDev = process.env.NODE_ENV === "development";

const status = {
  ok: 200,
  forbidden: 403,
};

const createHeaders = (
  /** @type {string} */ type,
  /** @type {string | undefined} */ origin
) => ({
  "Access-Control-Allow-Headers": "content-type",
  "Access-Control-Allow-Methods": "GET",
  "Content-Type": type,
  ...(origin && { "Access-Control-Allow-Origin": origin }),
});

export const createResponse = (
  /** @type {ServerResponse<IncomingMessage> & { req: IncomingMessage; }} */ response,
  /** @type {{ code: keyof typeof status, type: string, value: string, origin?: string }} */ {
    code,
    type,
    origin,
    value,
  }
) => {
  response.writeHead(status[code], createHeaders(type, origin));
  response.end(value);
};

const allowedOrigins = new Set(
  (process.env.ALLOWED_DOMAINS || "")
    .split(",")
    .map((domain) => domain.replace(/\/+$/, "")) // Remove trailing slashes from allowed domains
);

const validOrigins = is(set(string()), allowedOrigins);

export const isValidOrigin = (/** @type {IncomingMessage} */ request) => {
  if (isDev) {
    return true;
  }
  const origin = request.headers.origin || "";
  return validOrigins ? allowedOrigins.has(origin) : false;
};
<<<<<<< HEAD

export const { stringify, parse } = JSON;
=======
>>>>>>> 2e67cff (removed old version, updated schema for yjs and added nicer scripts and env management)
