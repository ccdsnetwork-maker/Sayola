import { randomBytes } from "crypto";

export function generateRequestId() {
  const random = randomBytes(4).toString("hex").toUpperCase();
  return `SKG-${new Date().getFullYear()}-${random}`;
}
