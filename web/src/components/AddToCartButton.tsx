"use client";

import { useCart } from "@/app/context/CartContext";
import { ShoppingCart, Check } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl?: string | null;
}

export default function AddToCartButton({ product }: { product: Product }) {
  const { addToCart, setIsCartOpen } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl || undefined,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 1800);

    toast.custom((t) => (
      <div className="flex items-center gap-4 bg-[#0d0b1e] border border-white/10 rounded-2xl px-4 py-3 shadow-[0_8px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl min-w-[300px]">
        {/* Product image */}
        <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/10 bg-black/50 relative shrink-0">
          {product.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-tr from-blue-900 to-purple-900" />
          )}
        </div>
        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-black uppercase tracking-widest text-green-400 mb-0.5">Added to Cart ✓</p>
          <p className="text-sm font-bold text-white truncate">{product.name}</p>
        </div>
        {/* View cart */}
        <button
          onClick={() => { toast.dismiss(t); setIsCartOpen(true); }}
          className="shrink-0 px-3 py-1.5 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 text-xs font-black uppercase tracking-widest hover:bg-blue-600/30 transition-colors"
        >
          View
        </button>
      </div>
    ), { duration: 3000 });
  };

  return (
    <button
      onClick={handleAdd}
      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 active:scale-95
                  ${added
                    ? "bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.5)] scale-110"
                    : "bg-white text-black hover:scale-110 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                  }`}
    >
      {added
        ? <Check size={20} className="text-white" />
        : <ShoppingCart size={20} className="ml-[-2px]" />
      }
    </button>
  );
}
