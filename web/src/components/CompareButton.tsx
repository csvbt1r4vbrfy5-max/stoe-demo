"use client";

import { useCompare } from "@/app/context/CompareContext";
import { GitCompare } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface Props {
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl?: string | null;
    type: "PHYSICAL" | "DIGITAL";
    description: string;
  };
}

export default function CompareButton({ product }: Props) {
  const { toggleCompare, isCompared, compareList } = useCompare();
  const compared = isCompared(product.id);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleCompare(product);
    if (!compared) {
      const count = compareList.length + 1;
      toast(`${count === 2 ? "Ready to compare! " : ""}${product.name} added to compare`, {
        icon: "⚖️",
        action: count === 2 ? {
          label: "Compare Now",
          onClick: () => window.location.href = "/compare",
        } : undefined,
      });
    }
  };

  return (
    <button
      onClick={handleClick}
      aria-label="Compare product"
      title={compared ? "Remove from compare" : "Add to compare"}
      className={`w-9 h-9 rounded-full flex items-center justify-center
                  backdrop-blur-md border transition-all duration-200 hover:scale-110 active:scale-95
                  ${compared
                    ? "bg-blue-500/20 border-blue-500/40 text-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.3)]"
                    : "bg-black/40 border-white/10 text-zinc-400 hover:text-blue-400 hover:border-blue-500/30"
                  }`}
    >
      <GitCompare size={15} />
    </button>
  );
}
