"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir, unlink } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function createProductAction(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const price = parseFloat(formData.get("price") as string);
    const type = formData.get("type") as "PHYSICAL" | "DIGITAL";
    const description = formData.get("description") as string;
    const image = formData.get("image") as File | null;

    let imageUrl = null;

    if (image && image.size > 0) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const uploadDir = join(process.cwd(), "public", "uploads");
      
      // Ensure the uploads directory exists
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
      }

      // Generate a unique filename
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const filename = `${uniqueSuffix}-${image.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
      const filepath = join(uploadDir, filename);

      await writeFile(filepath, buffer);
      imageUrl = `/uploads/${filename}`;
    }

    // Save to database
    const product = await db.product.create({
      data: {
        name,
        description,
        price,
        type,
        imageUrl,
      },
    });

    // Create related details based on type
    if (type === "PHYSICAL") {
      await db.physicalProduct.create({
        data: {
          productId: product.id,
          stockQuantity: 10, // Default stock
        }
      });
    } else {
      await db.digitalProduct.create({
        data: {
          productId: product.id,
          fileUrl: "/dummy-file-url.zip", // Placeholder for actual digital file upload
        }
      });
    }

    // Revalidate paths to update the UI
    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/products");

    return { success: true, message: "Product added successfully!" };
  } catch (error) {
    console.error("Failed to create product:", error);
    return { success: false, message: "Failed to create product." };
  }
}

export async function deleteProductAction(id: string) {
  try {
    const product = await db.product.findUnique({ where: { id } });
    
    if (!product) {
      return { success: false, message: "Product not found." };
    }

    // Optional: Delete image file from local storage if exists
    if (product.imageUrl && product.imageUrl.startsWith('/uploads/')) {
      try {
        const filepath = join(process.cwd(), "public", product.imageUrl);
        if (existsSync(filepath)) {
          await unlink(filepath);
        }
      } catch (err) {
        console.error("Failed to delete image file:", err);
      }
    }

    await db.product.delete({
      where: { id }
    });

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/products");

    return { success: true, message: "Product deleted successfully!" };
  } catch (error) {
    console.error("Failed to delete product:", error);
    return { success: false, message: "Failed to delete product." };
  }
}

export async function updateProductAction(id: string, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const price = parseFloat(formData.get("price") as string);
    const type = formData.get("type") as "PHYSICAL" | "DIGITAL";
    const description = formData.get("description") as string;
    const image = formData.get("image") as File | null;

    const existingProduct = await db.product.findUnique({ where: { id } });
    if (!existingProduct) {
      return { success: false, message: "Product not found." };
    }

    let imageUrl = existingProduct.imageUrl;

    if (image && image.size > 0) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const uploadDir = join(process.cwd(), "public", "uploads");
      
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
      }

      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const filename = `${uniqueSuffix}-${image.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
      const filepath = join(uploadDir, filename);

      await writeFile(filepath, buffer);
      imageUrl = `/uploads/${filename}`;
    }

    await db.product.update({
      where: { id },
      data: {
        name,
        description,
        price,
        type,
        imageUrl,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/products");

    return { success: true, message: "Product updated successfully!" };
  } catch (error) {
    console.error("Failed to update product:", error);
    return { success: false, message: "Failed to update product." };
  }
}
