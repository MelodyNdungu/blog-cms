// Web Crypto API — works in both Next.js Edge (middleware) and Node.js runtimes

export const SESSION_COOKIE = "admin_session";
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function getSecret(): string {
  return process.env.SESSION_SECRET ?? "dev-secret-change-in-production";
}

async function getHmacKey(usage: KeyUsage[]): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    usage
  );
}

export async function createSessionToken(): Promise<string> {
  const key = await getHmacKey(["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode("authenticated"));
  return btoa(String.fromCharCode(...new Uint8Array(sig)));
}

export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  try {
    const expected = await createSessionToken();
    if (expected.length !== token.length) return false;
    let diff = 0;
    for (let i = 0; i < expected.length; i++) {
      diff |= expected.charCodeAt(i) ^ token.charCodeAt(i);
    }
    return diff === 0;
  } catch {
    return false;
  }
}

export async function verifyPassword(input: string): Promise<boolean> {
  const expected = process.env.ADMIN_PASSWORD ?? "admin";
  // Hash both inputs so timingSafeEqual sees equal-length buffers
  const [a, b] = await Promise.all([
    crypto.subtle.digest("SHA-256", new TextEncoder().encode(input)),
    crypto.subtle.digest("SHA-256", new TextEncoder().encode(expected)),
  ]);
  const ua = new Uint8Array(a);
  const ub = new Uint8Array(b);
  let diff = 0;
  for (let i = 0; i < ua.length; i++) diff |= ua[i] ^ ub[i];
  return diff === 0;
}

export async function createMagicToken(): Promise<string> {
  const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes
  const msg = `magic.${expiresAt}`;
  const key = await getHmacKey(["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(msg));
  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(sig)));
  return `${sigB64}.${expiresAt}`;
}

export async function verifyMagicToken(token: string): Promise<boolean> {
  try {
    const lastDot = token.lastIndexOf(".");
    if (lastDot === -1) return false;
    const sigB64 = token.slice(0, lastDot);
    const expiresAt = parseInt(token.slice(lastDot + 1), 10);
    if (isNaN(expiresAt) || Date.now() > expiresAt) return false;
    const msg = `magic.${expiresAt}`;
    const key = await getHmacKey(["verify"]);
    const sigBytes = Uint8Array.from(atob(sigB64), (c) => c.charCodeAt(0));
    return await crypto.subtle.verify("HMAC", key, sigBytes, new TextEncoder().encode(msg));
  } catch {
    return false;
  }
}

export function cookieOptions(maxAge = COOKIE_MAX_AGE) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge,
    path: "/",
  };
}
