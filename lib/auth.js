import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "kala-samputah-secret-change-in-prod";
const TOKEN_NAME = "ks_admin_token";
const MAX_AGE    = 60 * 60 * 8; // 8 hours

/** Sign a JWT and return it */
export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: MAX_AGE });
}

/** Verify a JWT string — returns payload or null */
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

/**
 * Read the admin token from cookies (server-side only).
 * Returns the decoded payload if valid, otherwise null.
 */
export function getAdminSession() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(TOKEN_NAME)?.value;
    if (!token) return null;
    return verifyToken(token);
  } catch {
    return null;
  }
}

export { TOKEN_NAME, MAX_AGE };
