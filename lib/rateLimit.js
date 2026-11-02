// lib/rateLimit.js
// In-memory sliding-window rate limiter & spam protection utilities

const store = new Map();

/**
 * Clean up expired rate-limit records periodically
 */
function cleanupExpired() {
  const now = Date.now();
  for (const [key, data] of store.entries()) {
    if (now > data.resetTime) {
      store.delete(key);
    }
  }
}

// Cleanup every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(cleanupExpired, 5 * 60 * 1000).unref?.();
}

/**
 * Get client IP address from Next.js request headers
 */
export function getClientIp(req) {
  const xForwardedFor = req.headers.get("x-forwarded-for");
  if (xForwardedFor) {
    return xForwardedFor.split(",")[0].trim();
  }
  return req.headers.get("x-real-ip") || "127.0.0.1";
}

/**
 * Rate limit checker
 * @param {string} key Identifier (e.g. IP + endpoint)
 * @param {number} maxRequests Maximum requests allowed within window
 * @param {number} windowSeconds Time window in seconds
 * @returns {{ allowed: boolean, remaining: number, resetSeconds: number }}
 */
export function checkRateLimit(key, maxRequests = 5, windowSeconds = 60) {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;

  let record = store.get(key);

  if (!record || now > record.resetTime) {
    record = {
      count: 1,
      resetTime: now + windowMs,
    };
    store.set(key, record);
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetSeconds: windowSeconds,
    };
  }

  record.count += 1;
  const resetSeconds = Math.max(1, Math.ceil((record.resetTime - now) / 1000));

  if (record.count > maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetSeconds,
    };
  }

  return {
    allowed: true,
    remaining: maxRequests - record.count,
    resetSeconds,
  };
}

/**
 * Spam detection helper for text submissions
 */
export function isSpamContent({ name = "", email = "", message = "" }) {
  const combined = `${name} ${message}`.toLowerCase();

  // 1. Common spam keywords
  const spamKeywords = [
    "viagra",
    "casino",
    "crypto profit",
    "whatsapp girls",
    "loan approval",
    "seo ranking guaranteed",
    "backlinks for sale",
    "bit.ly/",
    "t.co/",
    "tinyurl.com/",
    "telegram channel @",
    "investment doubled",
  ];

  for (const kw of spamKeywords) {
    if (combined.includes(kw)) {
      return { isSpam: true, reason: `Suspicious promotional keyword detected: ${kw}` };
    }
  }

  // 2. Excess repetitive characters (e.g. aaaaaaa or !!!!!!!)
  if (/(.)\1{7,}/.test(combined)) {
    return { isSpam: true, reason: "Excessive repetitive characters detected" };
  }

  // 3. Excess links in short message
  const urlMatches = (message || "").match(/https?:\/\/[^\s]+/g);
  if (urlMatches && urlMatches.length > 2) {
    return { isSpam: true, reason: "Message contains excessive links" };
  }

  // 4. Basic email validity pattern
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email && !emailRegex.test(email)) {
    return { isSpam: true, reason: "Invalid email format" };
  }

  return { isSpam: false };
}
