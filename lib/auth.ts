import { cookies } from "next/headers";
import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";

function getSessionKey(): Buffer {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET is not set in the environment variables");
  }
  return crypto.createHash("sha256").update(secret).digest();
}

export function hashPassword(password: string): string {
  const randomSalt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, randomSalt, 1000, 64, "sha512").toString("hex");
  return `${randomSalt}:${hash}`;
}

export function verifyPassword(password: string, storedValue: string): boolean {
  try {
    const [salt, hash] = storedValue.split(":");
    if (!salt || !hash) return false;
    const verifyHash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
    return hash === verifyHash;
  } catch {
    return false;
  }
}

export function encryptSession(payload: any): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, getSessionKey(), iv);
  let encrypted = cipher.update(JSON.stringify(payload), "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag().toString("hex");
  return `${iv.toString("hex")}:${encrypted}:${authTag}`;
}

export function decryptSession(token: string): any | null {
  try {
    const [ivHex, encryptedHex, authTagHex] = token.split(":");
    if (!ivHex || !encryptedHex || !authTagHex) return null;
    const iv = Buffer.from(ivHex, "hex");
    const encrypted = Buffer.from(encryptedHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");
    const decipher = crypto.createDecipheriv(ALGORITHM, getSessionKey(), iv);
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(encrypted, undefined, "utf8");
    decrypted += decipher.final("utf8");
    return JSON.parse(decrypted);
  } catch (error) {
    return null;
  }
}

export async function createSession(userId: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const session = encryptSession({ userId, expiresAt: expiresAt.toISOString() });

  const cookieStore = await cookies();
  cookieStore.set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function getSession() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;
  if (!sessionToken) return null;

  const payload = decryptSession(sessionToken);
  if (!payload) return null;

  if (new Date(payload.expiresAt) < new Date()) {
    return null;
  }

  return payload as { userId: string; expiresAt: string };
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}
