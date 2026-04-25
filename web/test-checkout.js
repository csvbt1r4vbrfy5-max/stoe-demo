const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();

async function testCheckout() {
  try {
    let guestUser = await db.user.findUnique({
      where: { email: "guest@store.com" }
    });

    if (!guestUser) {
      console.log("Creating guest user...");
      guestUser = await db.user.create({
        data: {
          email: "guest@store.com",
          name: "Guest Customer",
          role: "CUSTOMER",
        }
      });
    }
    console.log("Guest User:", guestUser);

    const product = await db.product.findFirst();
    if (!product) {
      console.log("No product found.");
      return;
    }

    console.log("Creating order...");
    const order = await db.order.create({
      data: {
        userId: guestUser.id,
        totalAmount: 100,
        status: "PENDING",
        items: {
          create: [{
            productId: product.id,
            quantity: 1,
            priceAtPurchase: 100
          }]
        }
      }
    });

    console.log("Order created:", order);
  } catch (error) {
    console.error("Checkout error:", error);
  } finally {
    await db.$disconnect();
  }
}

testCheckout();
