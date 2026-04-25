import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 2 });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database with mobile phones and headphones...");

const products = [
    // --- PlayStation Digital Items ---
    {
      name: "PlayStation Plus Premium (12 Months)",
      description: "12-month subscription to PlayStation Plus Premium. Enjoy game catalog, classics catalog, and game trials.",
      price: 159.99,
      type: "DIGITAL" as const,
      imageUrl: "/images/ps_plus.png",
      digitalDetails: {
        fileUrl: "/digital-codes/psplus-premium-12m.txt",
        fileSize: 1024,
        format: "txt"
      }
    },
    {
      name: "PlayStation Store Gift Card ($100)",
      description: "Top up your PlayStation Network wallet with $100 to buy games, DLCs, and movies.",
      price: 100.00,
      type: "DIGITAL" as const,
      imageUrl: "/images/psn_card.png",
      digitalDetails: {
        fileUrl: "/digital-codes/psn-100-usd.txt",
        fileSize: 1024,
        format: "txt"
      }
    },
    {
      name: "EA Sports FC 24 - PS5 Digital Game",
      description: "Full game digital download code for EA Sports FC 24 on PlayStation 5.",
      price: 69.99,
      type: "DIGITAL" as const,
      imageUrl: "/images/ea_fc_24.png",
      digitalDetails: {
        fileUrl: "/digital-codes/ea-fc-24-ps5.txt",
        fileSize: 1024,
        format: "txt"
      }
    },

    // --- Mobile & Mobile Gaming Items ---
    {
      name: "Apple App Store & iTunes Gift Card ($100)",
      description: "Get apps, games, music, movies, and more on your Apple devices.",
      price: 100.00,
      type: "DIGITAL" as const,
      imageUrl: "/images/apple_gift_card.png",
      digitalDetails: {
        fileUrl: "/digital-codes/apple-itunes-100.txt",
        fileSize: 1024,
        format: "txt"
      }
    },
    {
      name: "Google Play Gift Card ($50)",
      description: "Buy Android apps, games, and subscriptions from the Google Play store.",
      price: 50.00,
      type: "DIGITAL" as const,
      imageUrl: "/images/google_play_card.png",
      digitalDetails: {
        fileUrl: "/digital-codes/google-play-50.txt",
        fileSize: 1024,
        format: "txt"
      }
    },
    {
      name: "PUBG Mobile - 8100 UC",
      description: "8100 Unknown Cash (UC) for PUBG Mobile. Use it to buy crates, Royale Pass, and skins.",
      price: 99.99,
      type: "DIGITAL" as const,
      imageUrl: "/images/pubg_mobile.png",
      digitalDetails: {
        fileUrl: "/digital-codes/pubg-8100-uc.txt",
        fileSize: 1024,
        format: "txt"
      }
    },
    {
      name: "Mobile Legends - 5000 Diamonds",
      description: "5000 Diamonds for Mobile Legends: Bang Bang to unlock heroes and premium skins.",
      price: 89.99,
      type: "DIGITAL" as const,
      imageUrl: "/images/mobile_legends.png",
      digitalDetails: {
        fileUrl: "/digital-codes/mlbb-5000-diamonds.txt",
        fileSize: 1024,
        format: "txt"
      }
    }
  ];

  const physicalProducts = [
    {
      name: "PS5 DualSense Wireless Controller",
      description: "The official Sony PS5 DualSense wireless controller. Experience haptic feedback and adaptive triggers for next-gen gaming.",
      price: 69.99,
      type: "PHYSICAL" as const,
      imageUrl: "/images/ps5_controller.png",
      physicalDetails: {
        stockQuantity: 50,
        weight: 0.28,
        dimensions: "16 x 10 x 6 cm",
        color: "White / Black",
      }
    },
    {
      name: "RGB Gaming Headset Pro",
      description: "Premium over-ear gaming headset with 7.1 surround sound, noise-cancelling mic, and RGB LED lighting.",
      price: 79.99,
      type: "PHYSICAL" as const,
      imageUrl: "/images/gaming_headset.png",
      physicalDetails: {
        stockQuantity: 30,
        weight: 0.35,
        dimensions: "20 x 18 x 10 cm",
        color: "Black / Red",
      }
    },
    {
      name: "Mechanical RGB Gaming Keyboard",
      description: "Tenkeyless mechanical gaming keyboard with Cherry MX switches, per-key RGB lighting, and anti-ghosting technology.",
      price: 119.99,
      type: "PHYSICAL" as const,
      imageUrl: "/images/gaming_keyboard.png",
      physicalDetails: {
        stockQuantity: 25,
        weight: 0.85,
        dimensions: "36 x 13 x 4 cm",
        color: "Black",
      }
    },
    {
      name: "High-Performance Gaming Mouse",
      description: "Precision RGB gaming mouse with 25,600 DPI optical sensor, 11 programmable buttons, and ergonomic design.",
      price: 59.99,
      type: "PHYSICAL" as const,
      imageUrl: "/images/gaming_mouse.png",
      physicalDetails: {
        stockQuantity: 40,
        weight: 0.10,
        dimensions: "12.6 x 6.7 x 4.3 cm",
        color: "Black",
      }
    },
    {
      name: "Pro Racing Gaming Chair",
      description: "Ergonomic racing-style gaming chair with lumbar support, adjustable armrests, and full recline. Built for marathon sessions.",
      price: 349.99,
      type: "PHYSICAL" as const,
      imageUrl: "/images/gaming_chair.png",
      physicalDetails: {
        stockQuantity: 10,
        weight: 28.0,
        dimensions: "70 x 55 x 130 cm",
        color: "Black / Red",
      }
    },
    {
      name: "27\" Curved Gaming Monitor 144Hz",
      description: "27-inch Full HD curved gaming monitor with 144Hz refresh rate, 1ms response time, and AMD FreeSync support.",
      price: 289.99,
      type: "PHYSICAL" as const,
      imageUrl: "/images/gaming_monitor.png",
      physicalDetails: {
        stockQuantity: 15,
        weight: 5.5,
        dimensions: "61.5 x 36.5 x 20 cm",
        color: "Black",
      }
    },
    {
      name: "XL RGB Gaming Mousepad",
      description: "Extended XL gaming mousepad with colorful RGB edge lighting, non-slip rubber base, and smooth micro-fiber surface.",
      price: 34.99,
      type: "PHYSICAL" as const,
      imageUrl: "/images/gaming_mousepad.png",
      physicalDetails: {
        stockQuantity: 60,
        weight: 0.45,
        dimensions: "90 x 40 x 0.4 cm",
        color: "Black",
      }
    },
  ];

  for (const item of products) {
    const { digitalDetails, ...productData } = item;
    
    await prisma.product.create({
      data: {
        ...productData,
        digitalDetails: {
          create: digitalDetails
        }
      }
    });
    console.log(`Created digital product: ${productData.name}`);
  }

  for (const item of physicalProducts) {
    const { physicalDetails, ...productData } = item;
    
    await prisma.product.create({
      data: {
        ...productData,
        physicalDetails: {
          create: physicalDetails
        }
      }
    });
    console.log(`Created physical product: ${productData.name}`);
  }

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
