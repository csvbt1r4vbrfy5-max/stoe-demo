"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export async function checkoutAction(cartItems: CartItem[]) {
  try {
    if (!cartItems || cartItems.length === 0) {
      return { success: false, message: "Cart is empty" };
    }

    // Securely fetch products from the database to calculate real total amount
    const productIds = cartItems.map(item => item.id);
    const dbProducts = await db.product.findMany({
      where: { id: { in: productIds } }
    });

    let totalAmount = 0;
    const finalItems = [];

    for (const item of cartItems) {
      const product = dbProducts.find(p => p.id === item.id);
      if (!product) continue; // Skip invalid products

      const itemTotal = Number(product.price) * item.quantity;
      totalAmount += itemTotal;

      finalItems.push({
        productId: product.id,
        quantity: item.quantity,
        priceAtPurchase: product.price
      });
    }

    if (finalItems.length === 0) {
      return { success: false, message: "Cart is invalid" };
    }

    // Get or create a default guest user for the demo
    let guestUser = await db.user.findUnique({
      where: { email: "guest@store.com" }
    });

    if (!guestUser) {
      guestUser = await db.user.create({
        data: {
          email: "guest@store.com",
          name: "Guest Customer",
          role: "CUSTOMER",
        }
      });
    }

    // Create the order
    const order = await db.order.create({
      data: {
        userId: guestUser.id,
        totalAmount,
        status: "PENDING",
        items: {
          create: finalItems
        }
      }
    });

    revalidatePath("/admin"); // Refresh admin dashboard stats

    return { success: true, orderId: order.id };
  } catch (error) {
    console.error("Checkout error:", error);
    return { success: false, message: "Checkout failed" };
  }
}
