import "dotenv/config";
import { isValidURL } from "./utils";

export const PORT = parseInt(process.env.PORT || "8787", 10);

export const ALLOWED_DOMAINS = process.env.ALLOWED_DOMAINS
  ? process.env.ALLOWED_DOMAINS.split(",").filter(isValidURL)
  : ["https://nodenogg.in"];

export const THROTTLE_CONNECTIONS = parseInt(
  process.env.THROTTLE_CONNECTIONS || "15",
  10
);

export const THROTTLE_BAN_TIME = parseInt(
  process.env.THROTTLE_BAN_TIME || "5",
  10
);

export const LOG = process.env.LOG === "true" || false;
