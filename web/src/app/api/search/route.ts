import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? "";
  if (!q.trim()) return NextResponse.json({ results: [] });

  const products = await db.product.findMany({
    where: { name: { contains: q, mode: "insensitive" } },
    take: 6,
    select: { id: true, name: true, price: true, imageUrl: true, type: true },
  });

  return NextResponse.json({
    results: products.map(p => ({ ...p, price: Number(p.price) })),
  });
}
