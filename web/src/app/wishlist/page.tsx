"use client";

import { useWishlist } from "@/app/context/WishlistContext";
import { useCart } from "@/app/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { Heart, Package, Zap, ArrowLeft } from "lucide-react";
import AddToCartButton from "@/components/AddToCartButton";

export default function WishlistPage() {
  const { wishlist, toggleWishlist } = useWishlist();

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center border border-red-500/30">
                <Heart size={20} className="text-red-400" fill="currentColor" />
              </div>
              <h1 className="text-4xl font-black uppercase tracking-tighter text-white">My Wishlist</h1>
            </div>
            <p className="text-zinc-500 text-sm ml-[52px]">
              {wishlist.length === 0 ? "No saved items" : `${wishlist.length} item${wishlist.length !== 1 ? "s" : ""} saved`}
            </p>
          </div>
          <Link
            href="/products"
            className="flex items-center gap-2 text-zinc-400 hover:text-white text-sm font-bold uppercase tracking-widest transition-colors"
          >
            <ArrowLeft size={16} /> Back to Shop
          </Link>
        </div>

        {/* Empty state */}
        {wishlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20 mb-6">
              <Heart size={40} className="text-red-400/40" />
            </div>
            <h2 className="text-2xl font-black text-white uppercase tracking-widest mb-3">Nothing saved yet</h2>
            <p className="text-zinc-500 mb-8 max-w-sm">
              Browse our catalog and tap the ❤️ button on any product to save it here.
            </p>
            <Link
              href="/products"
              className="flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-red-600 to-pink-600 text-white font-black uppercase tracking-widest text-sm hover:scale-105 transition-all shadow-[0_0_20px_rgba(239,68,68,0.3)]"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((item) => (
              <div
                key={item.id}
                className="glass-panel rounded-[28px] overflow-hidden group hover:-translate-y-1 transition-all duration-300
                           border border-white/5 hover:border-white/10"
              >
                {/* Image */}
                <Link href={`/products/${item.id}`} className="block">
                  <div className="relative aspect-square bg-black/40 overflow-hidden">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        unoptimized
                        className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-tr from-blue-900 to-purple-900" />
                    )}

                    {/* Type badge */}
                    <div className="absolute top-3 right-3">
                      <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        item.type === "PHYSICAL"
                          ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                          : "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                      }`}>
                        {item.type === "PHYSICAL" ? <Package size={9} /> : <Zap size={9} />}
                        {item.type}
                      </span>
                    </div>

                    {/* Wishlist toggle — filled heart, click to remove */}
                    <button
                      onClick={() => toggleWishlist(item)}
                      className="absolute top-3 left-3 w-9 h-9 bg-red-500/20 border border-red-500/40
                                 rounded-full flex items-center justify-center text-red-400
                                 hover:bg-red-500/30 hover:scale-110 active:scale-95
                                 transition-all shadow-[0_0_10px_rgba(239,68,68,0.2)]"
                      aria-label="Remove from wishlist"
                    >
                      <Heart size={15} fill="currentColor" />
                    </button>
                  </div>
                </Link>

                {/* Info */}
                <div className="p-5">
                  <Link href={`/products/${item.id}`}>
                    <h3 className="font-black text-white text-base line-clamp-1 mb-1 hover:text-blue-300 transition-colors">
                      {item.name}
                    </h3>
                  </Link>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">
                      ${item.price.toFixed(2)}
                    </span>
                    <AddToCartButton product={{
                      id: item.id,
                      name: item.name,
                      price: item.price,
                      imageUrl: item.imageUrl,
                    }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
