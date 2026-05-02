"use server";

import { checkAdmin } from "@/lib/auth";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createCouponAction(formData: FormData) {
  if (!(await checkAdmin())) {
    return { success: false, message: "Unauthorized" };
  }

  const code = (formData.get("code") as string)?.trim().toUpperCase();
  const discount = parseInt(formData.get("discount") as string, 10);
  const isActive = formData.get("isActive") === "true";

  if (!code || isNaN(discount) || discount < 1 || discount > 100) {
    return { success: false, message: "Invalid coupon data." };
  }

  try {
    await db.coupon.create({ data: { code, discount, isActive } });
    revalidatePath("/admin/coupons");
    return { success: true, message: "Coupon created!" };
  } catch {
    return { success: false, message: "Code already exists or an error occurred." };
  }
}

export async function updateCouponAction(id: string, formData: FormData) {
  if (!(await checkAdmin())) {
    return { success: false, message: "Unauthorized" };
  }

  const code = (formData.get("code") as string)?.trim().toUpperCase();
  const discount = parseInt(formData.get("discount") as string, 10);
  const isActive = formData.get("isActive") === "true";

  if (!code || isNaN(discount) || discount < 1 || discount > 100) {
    return { success: false, message: "Invalid coupon data." };
  }

  try {
    await db.coupon.update({ where: { id }, data: { code, discount, isActive } });
    revalidatePath("/admin/coupons");
    return { success: true, message: "Coupon updated!" };
  } catch {
    return { success: false, message: "Update failed." };
  }
}

export async function deleteCouponAction(id: string) {
  if (!(await checkAdmin())) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    await db.coupon.delete({ where: { id } });
    revalidatePath("/admin/coupons");
    return { success: true };
  } catch {
    return { success: false, message: "Delete failed." };
  }
}

export async function validateCouponAction(code: string) {
  const coupon = await db.coupon.findUnique({
    where: { code: code.trim().toUpperCase() },
  });

  if (!coupon || !coupon.isActive) {
    return { valid: false, message: "Invalid or inactive coupon." };
  }

  return { valid: true, discount: coupon.discount, code: coupon.code };
}
