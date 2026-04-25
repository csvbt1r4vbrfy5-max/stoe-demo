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

    const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

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
          create: cartItems.map(item => ({
            productId: item.id,
            quantity: item.quantity,
            priceAtPurchase: item.price
          }))
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
