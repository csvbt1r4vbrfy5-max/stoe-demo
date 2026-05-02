import { cookies } from "next/headers";

// نستخدم كلمة مرور المشرف كمفتاح لتشفير الجلسة
const SECRET_KEY = process.env.ADMIN_PASSWORD || "super-secret-default-key-change-it";

async function getSignatureKey(secret: string) {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function signToken(payload: string): Promise<string> {
  const key = await getSignatureKey(SECRET_KEY);
  const enc = new TextEncoder();
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  const sigHex = Array.from(new Uint8Array(signature)).map(b => b.toString(16).padStart(2, '0')).join('');
  return `${payload}.${sigHex}`;
}

export async function verifyToken(token: string): Promise<string | null> {
  try {
    const [payload, sigHex] = token.split(".");
    if (!payload || !sigHex) return null;
    
    const key = await getSignatureKey(SECRET_KEY);
    const enc = new TextEncoder();
    const sigBytes = new Uint8Array(sigHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
    
    const isValid = await crypto.subtle.verify("HMAC", key, sigBytes, enc.encode(payload));
    return isValid ? payload : null;
  } catch {
    return null;
  }
}

export async function checkAdmin() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("admin_session")?.value;
  
  if (!sessionToken) return false;
  
  const payloadStr = await verifyToken(sessionToken);
  if (!payloadStr) return false;
  
  try {
    const payload = JSON.parse(payloadStr);
    return payload.role === "ADMIN" && payload.exp > Date.now();
  } catch {
    return false;
  }
}
