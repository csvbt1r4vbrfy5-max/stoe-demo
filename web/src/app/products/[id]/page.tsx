import { db } from "@/lib/db";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Star, Package, Zap } from "lucide-react";
import AddToCartButton from "@/components/AddToCartButton";
import ReviewForm from "@/components/ReviewForm";

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const product = await db.product.findUnique({
    where: { id },
    include: {
      physicalDetails: true,
      digitalDetails: true,
      reviews: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!product) notFound();

  const avgRating = product.reviews.length
    ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
    : 0;

  const isPhysical = product.type === "PHYSICAL";

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* Back */}
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white text-sm font-bold uppercase tracking-widest transition-colors mb-10"
        >
          <ArrowLeft size={16} /> Back to Catalog
        </Link>

        {/* Product grid */}
        <div className="grid lg:grid-cols-2 gap-16 mb-20">
          {/* Image */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-violet-600/20 rounded-[32px] blur-3xl scale-95 group-hover:scale-100 transition-transform duration-700" />
            <div className="relative aspect-square rounded-[32px] overflow-hidden border border-white/10
                            shadow-[0_30px_80px_rgba(0,0,0,0.5)] bg-black/40">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  unoptimized
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-900 to-purple-900" />
              )}
              {/* Type badge */}
              <div className="absolute top-5 right-5">
                <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg ${
                  isPhysical
                    ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                    : "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                }`}>
                  {isPhysical ? <Package size={11} /> : <Zap size={11} />}
                  {product.type}
                </span>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center space-y-8">
            {/* Rating summary */}
            {product.reviews.length > 0 && (
              <div className="flex items-center gap-3">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(s => (
                    <Star
                      key={s} size={18}
                      fill={avgRating >= s ? "#f59e0b" : "transparent"}
                      stroke={avgRating >= s ? "#f59e0b" : "#52525b"}
                    />
                  ))}
                </div>
                <span className="text-sm font-bold text-zinc-400">
                  {avgRating.toFixed(1)} ({product.reviews.length} review{product.reviews.length !== 1 ? "s" : ""})
                </span>
              </div>
            )}

            <div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white leading-tight mb-4">
                {product.name}
              </h1>
              <p className="text-zinc-400 leading-relaxed text-base">{product.description}</p>
            </div>

            {/* Physical details */}
            {isPhysical && product.physicalDetails && (
              <div className="glass-panel rounded-2xl p-6 grid grid-cols-2 gap-4">
                {product.physicalDetails.stockQuantity !== undefined && (
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Stock</p>
                    <p className={`text-base font-black ${product.physicalDetails.stockQuantity > 0 ? "text-green-400" : "text-red-400"}`}>
                      {product.physicalDetails.stockQuantity > 0 ? `${product.physicalDetails.stockQuantity} units` : "Out of Stock"}
                    </p>
                  </div>
                )}
                {product.physicalDetails.weight && (
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Weight</p>
                    <p className="text-base font-black text-white">{product.physicalDetails.weight} kg</p>
                  </div>
                )}
                {product.physicalDetails.dimensions && (
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Dimensions</p>
                    <p className="text-base font-black text-white">{product.physicalDetails.dimensions}</p>
                  </div>
                )}
                {product.physicalDetails.color && (
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Color</p>
                    <p className="text-base font-black text-white">{product.physicalDetails.color}</p>
                  </div>
                )}
              </div>
            )}

            {/* Digital info */}
            {!isPhysical && product.digitalDetails && (
              <div className="glass-panel rounded-2xl p-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center border border-purple-500/30">
                  <Zap size={22} className="text-purple-400" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Digital Delivery</p>
                  <p className="text-sm font-bold text-white">Instant download after purchase</p>
                </div>
              </div>
            )}

            {/* Price + CTA */}
            <div className="flex items-center gap-6">
              <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">
                {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(product.price))}
              </span>
              <AddToCartButton
                product={{
                  id: product.id,
                  name: product.name,
                  price: Number(product.price),
                  imageUrl: product.imageUrl,
                }}
              />
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Existing reviews */}
          <div>
            <h2 className="text-2xl font-black uppercase tracking-widest mb-8 text-white">
              Reviews ({product.reviews.length})
            </h2>
            {product.reviews.length === 0 ? (
              <div className="glass-panel rounded-2xl p-8 text-center text-zinc-500">
                <Star size={40} className="mx-auto mb-3 opacity-30" />
                <p className="font-bold">No reviews yet. Be the first!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {product.reviews.map((review) => (
                  <div key={review.id} className="glass-panel rounded-2xl p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-black text-white text-sm">{review.author}</p>
                        <p className="text-[10px] text-zinc-500">
                          {new Date(review.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                        </p>
                      </div>
                      <div className="flex gap-0.5">
                        {[1,2,3,4,5].map(s => (
                          <Star
                            key={s} size={14}
                            fill={review.rating >= s ? "#f59e0b" : "transparent"}
                            stroke={review.rating >= s ? "#f59e0b" : "#52525b"}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-zinc-400 leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Write review */}
          <div>
            <h2 className="text-2xl font-black uppercase tracking-widest mb-8 text-white">
              Write a Review
            </h2>
            <div className="glass-panel rounded-2xl p-8">
              <ReviewForm productId={product.id} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
