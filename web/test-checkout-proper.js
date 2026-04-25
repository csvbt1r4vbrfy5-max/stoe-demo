require('dotenv').config({ path: '.env' });
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

async function testCheckout() {
  try {
    console.log("Connecting with string:", process.env.DATABASE_URL);
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);
    const db = new PrismaClient({ adapter });

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
    await db.$disconnect();
    await pool.end();
  } catch (error) {
    console.error("Checkout error:", error);
  }
}

testCheckout();
