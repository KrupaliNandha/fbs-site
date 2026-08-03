import crypto from "crypto";

export function generateSecureShareToken(): string {
  // Generates a 16-character secure random base62 string (e.g., f8HkL9QaPmX2Zt99)
  const bytes = crypto.randomBytes(12);
  const charset = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let token = "";
  for (let i = 0; i < bytes.length; i++) {
    token += charset[bytes[i] % charset.length];
  }
  return token;
}
