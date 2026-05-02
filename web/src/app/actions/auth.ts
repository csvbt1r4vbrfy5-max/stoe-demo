"use server";

import { cookies } from "next/headers";
import { signToken } from "@/lib/auth";

export async function loginAction(password: string) {
  // نستخدم كلمة المرور المخصصة للمشرف
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

  if (password !== ADMIN_PASSWORD) {
    return { success: false, message: "كلمة المرور غير صحيحة" };
  }

  // Create a signed token that expires in 24 hours
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
  const payload = JSON.stringify({ role: "ADMIN", exp: expiresAt });
  const token = await signToken(payload);

  (await cookies()).set("admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(expiresAt),
  });

  return { success: true };
}

export async function logoutAction() {
  (await cookies()).delete("admin_session");
  return { success: true };
}
