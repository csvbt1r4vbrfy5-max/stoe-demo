"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function addReviewAction(productId: string, formData: FormData) {
  const author = (formData.get("author") as string)?.trim();
  const rating = parseInt(formData.get("rating") as string, 10);
  const comment = (formData.get("comment") as string)?.trim();

  if (!author || !comment || isNaN(rating) || rating < 1 || rating > 5) {
    return { success: false, message: "Please fill all fields correctly." };
  }

  await db.review.create({
    data: { productId, author, rating, comment },
  });

  revalidatePath(`/products/${productId}`);
  return { success: true, message: "Review added!" };
}
