import jwt            from "jsonwebtoken";
import { cookies }    from "next/headers";

const JWT_SECRET  = process.env.JWT_SECRET || "kala-samputah-secret-change-in-prod";
const TOKEN_NAME  = "ks_user_token";
const MAX_AGE     = 60 * 60 * 24 * 7; // 7 days

export function signUserToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: MAX_AGE });
}

export function verifyUserToken(token) {
  try { return jwt.verify(token, JWT_SECRET); }
  catch { return null; }
}

export function getUserSession() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(TOKEN_NAME)?.value;
    if (!token) return null;
    return verifyUserToken(token);
  } catch { return null; }
}

export { TOKEN_NAME as USER_TOKEN_NAME, MAX_AGE as USER_MAX_AGE };
