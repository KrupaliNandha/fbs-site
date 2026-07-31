import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "crypto";

const KEY_LENGTH = 64;
const SCRYPT_PARAMS = { N: 32768, r: 8, p: 1 };

function deriveKey(
  password: string,
  salt: string,
  keyLength: number,
  params: typeof SCRYPT_PARAMS,
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scryptCallback(password, salt, keyLength, params, (error, derivedKey) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(derivedKey);
    });
  });
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("base64url");
  const derivedKey = await deriveKey(password, salt, KEY_LENGTH, SCRYPT_PARAMS);

  return [
    "scrypt",
    `N=${SCRYPT_PARAMS.N},r=${SCRYPT_PARAMS.r},p=${SCRYPT_PARAMS.p}`,
    salt,
    derivedKey.toString("base64url"),
  ].join("$");
}

export async function verifyPassword(
  password: string,
  storedHash: string,
): Promise<boolean> {
  const [algorithm, params, salt, key] = storedHash.split("$");

  if (algorithm !== "scrypt" || !params || !salt || !key) {
    return false;
  }

  const parsedParams = Object.fromEntries(
    params.split(",").map((entry) => {
      const [name, value] = entry.split("=");
      return [name, Number(value)];
    }),
  ) as { N: number; r: number; p: number };

  const expectedKey = Buffer.from(key, "base64url");
  const derivedKey = await deriveKey(password, salt, expectedKey.length, {
    N: parsedParams.N,
    r: parsedParams.r,
    p: parsedParams.p,
  });

  return (
    expectedKey.length === derivedKey.length &&
    timingSafeEqual(expectedKey, derivedKey)
  );
}

export function validatePasswordStrength(password: string): string | null {
  if (password.length < 10) {
    return "Password must be at least 10 characters.";
  }

  if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password)) {
    return "Password must include uppercase, lowercase, and numeric characters.";
  }

  return null;
}
