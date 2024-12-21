import crypto from "crypto";

export function generateSixDigitNumber(): number {
  return Math.floor(100000 + Math.random() * 900000);
}

export function generateRandomToken(length: number): string {
  // Calculate the number of bytes needed to get the desired length in hex
  const byteLength = Math.ceil(length / 2); // 2 hex characters per byte
  return crypto.randomBytes(byteLength).toString("hex").slice(0, length);
}
