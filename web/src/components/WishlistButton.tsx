"use client";

import { useWishlist } from "@/app/context/WishlistContext";
import { Heart } from "lucide-react";
import { toast } from "sonner";

interface Props {
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl?: string | null;
    type: "PHYSICAL" | "DIGITAL";
  };
}

export default function WishlistButton({ product }: Props) {
  const { toggleWishlist, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product);
    toast(wishlisted ? "Removed from wishlist" : "Added to wishlist ♥", {
      icon: wishlisted ? "🖤" : "❤️",
    });
  };

  return (
    <button
      onClick={handleClick}
      aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
      className={`w-9 h-9 rounded-full flex items-center justify-center
                  backdrop-blur-md border transition-all duration-200 hover:scale-110 active:scale-95
                  ${wishlisted
                    ? "bg-red-500/20 border-red-500/40 text-red-400 shadow-[0_0_12px_rgba(239,68,68,0.3)]"
                    : "bg-black/40 border-white/10 text-zinc-400 hover:text-red-400 hover:border-red-500/30"
                  }`}
    >
      <Heart size={16} fill={wishlisted ? "currentColor" : "none"} />
    </button>
  );
}
