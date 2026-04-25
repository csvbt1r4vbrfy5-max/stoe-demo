"use client";

import { useCompare } from "@/app/context/CompareContext";
import Image from "next/image";
import Link from "next/link";
import { X, Package, Zap, GitCompare, ShoppingCart, ArrowLeft } from "lucide-react";
import AddToCartButton from "@/components/AddToCartButton";

export default function ComparePage() {
  const { compareList, clearCompare, toggleCompare } = useCompare();

  if (compareList.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center text-center px-4">
        <GitCompare size={64} className="text-zinc-600 mb-6" />
        <h1 className="text-3xl font-black text-white uppercase tracking-widest mb-4">No Products to Compare</h1>
        <p className="text-zinc-400 mb-8">Add products using the ⚖️ button on any product card.</p>
        <Link href="/products" className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 text-white font-black uppercase tracking-widest text-sm hover:scale-105 transition-all">
          <ArrowLeft size={16} /> Browse Products
        </Link>
      </div>
    );
  }

  if (compareList.length === 1) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center text-center px-4">
        <GitCompare size={64} className="text-violet-500/50 mb-6" />
        <h1 className="text-3xl font-black text-white uppercase tracking-widest mb-4">Add One More Product</h1>
        <p className="text-zinc-400 mb-2">You have <span className="text-white font-bold">{compareList[0].name}</span> selected.</p>
        <p className="text-zinc-500 mb-8">Select one more product to compare.</p>
        <Link href="/products" className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 text-white font-black uppercase tracking-widest text-sm hover:scale-105 transition-all">
          Browse Products
        </Link>
      </div>
    );
  }

  const [a, b] = compareList;

  const rows = [
    { label: "Price", a: `$${a.price.toFixed(2)}`, b: `$${b.price.toFixed(2)}` },
    { label: "Type", a: a.type, b: b.type },
    { label: "Description", a: a.description, b: b.description },
  ];

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="container mx-auto px-4 max-w-5xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter text-white">Compare Products</h1>
            <p className="text-zinc-500 text-sm mt-1">Side-by-side comparison</p>
          </div>
          <button
            onClick={clearCompare}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 transition-all text-sm font-bold"
          >
            <X size={14} /> Clear
          </button>
        </div>

        {/* Products side by side */}
        <div className="grid grid-cols-2 gap-8 mb-12">
          {[a, b].map((p) => (
            <div key={p.id} className="glass-panel rounded-[28px] overflow-hidden">
              {/* Image */}
              <div className="relative aspect-square bg-black/40">
                {p.imageUrl ? (
                  <Image src={p.imageUrl} alt={p.name} fill unoptimized className="object-cover" />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-900 to-purple-900" />
                )}
                <button
                  onClick={() => toggleCompare(p)}
                  className="absolute top-3 right-3 w-8 h-8 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 text-zinc-400 hover:text-red-400 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Info */}
              <div className="p-6">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-3 ${
                  p.type === "PHYSICAL"
                    ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                    : "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                }`}>
                  {p.type === "PHYSICAL" ? <Package size={10} /> : <Zap size={10} />}
                  {p.type}
                </span>
                <h2 className="font-black text-white text-lg leading-tight mb-1">{p.name}</h2>
                <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400 mb-4">
                  ${p.price.toFixed(2)}
                </p>
                <AddToCartButton product={{ id: p.id, name: p.name, price: p.price, imageUrl: p.imageUrl }} />
              </div>
            </div>
          ))}
        </div>

        {/* Comparison table */}
        <div className="glass-panel rounded-[28px] overflow-hidden">
          <div className="p-6 border-b border-white/10 bg-white/5">
            <h2 className="font-black text-white uppercase tracking-widest text-sm">Detailed Comparison</h2>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-zinc-500 w-1/4">Feature</th>
                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-blue-400 w-[37.5%]">{a.name}</th>
                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-violet-400 w-[37.5%]">{b.name}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {rows.map((row) => (
                <tr key={row.label} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-5 text-xs font-black uppercase tracking-widest text-zinc-500">{row.label}</td>
                  <td className="px-6 py-5 text-sm text-white font-medium">{row.a}</td>
                  <td className="px-6 py-5 text-sm text-white font-medium">{row.b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
