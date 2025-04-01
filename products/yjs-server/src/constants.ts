import "dotenv/config";

const isValidURL = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

export const PORT = parseInt(process.env.PORT || "3000", 10);

export const ALLOWED_DOMAINS = process.env.ALLOWED_DOMAINS
  ? process.env.ALLOWED_DOMAINS.split(",")
      .map((domain) => domain.trim())
      .filter(isValidURL)
  : [];

export const THROTTLE_CONNECTIONS = parseInt(
  process.env.THROTTLE_CONNECTIONS || "15",
  10
);

export const THROTTLE_BAN_TIME = parseInt(
  process.env.THROTTLE_BAN_TIME || "5",
  10
);
