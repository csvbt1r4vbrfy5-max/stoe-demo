"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, Package, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface SearchResult {
  id: string;
  name: string;
  price: number;
  imageUrl: string | null;
  type: "PHYSICAL" | "DIGITAL";
}

export default function LiveSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Debounce search
  useEffect(() => {
    if (!query.trim()) { setResults([]); setOpen(false); return; }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results || []);
        setOpen(true);
      } catch { /* silent */ }
      finally { setLoading(false); }
    }, 280);
    return () => clearTimeout(timer);
  }, [query]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && query.trim()) {
      router.push(`/products?q=${encodeURIComponent(query)}`);
      setOpen(false);
    }
    if (e.key === "Escape") setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-64">
      {/* Input */}
      <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border transition-all duration-200
                       ${open ? "border-violet-500/40 bg-violet-500/5 shadow-[0_0_15px_rgba(109,40,217,0.15)]" : "border-white/10 bg-white/5"}
                       backdrop-blur-md`}>
        <Search size={15} className={open ? "text-violet-400" : "text-zinc-500"} />
        <input
          ref={inputRef}
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKey}
          onFocus={() => query && setOpen(true)}
          placeholder="Search products..."
          className="bg-transparent text-sm text-white placeholder-zinc-500 outline-none flex-1 font-medium"
        />
        {query && (
          <button onClick={() => { setQuery(""); setResults([]); setOpen(false); }}>
            <X size={14} className="text-zinc-500 hover:text-white transition-colors" />
          </button>
        )}
        {loading && (
          <div className="w-3 h-3 border border-violet-400 border-t-transparent rounded-full animate-spin" />
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full left-0 right-0 mt-2 z-[200]
                        glass-panel rounded-2xl overflow-hidden
                        shadow-[0_20px_60px_rgba(0,0,0,0.5)]
                        border border-white/10 animate-in fade-in slide-in-from-top-2 duration-200">
          {results.length === 0 ? (
            <div className="p-6 text-center text-zinc-500 text-sm font-medium">
              No results for &quot;{query}&quot;
            </div>
          ) : (
            <>
              {results.map((r) => (
                <Link
                  key={r.id}
                  href={`/products/${r.id}`}
                  onClick={() => { setOpen(false); setQuery(""); }}
                  className="flex items-center gap-4 px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                >
                  <div className="w-10 h-10 rounded-xl bg-black/50 overflow-hidden relative border border-white/10 shrink-0">
                    {r.imageUrl ? (
                      <Image src={r.imageUrl} alt={r.name} fill unoptimized className="object-cover opacity-80" />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/50 to-purple-900/50" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">{r.name}</p>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${
                      r.type === "PHYSICAL" ? "text-orange-400" : "text-purple-400"
                    }`}>
                      {r.type === "PHYSICAL" ? <Package size={10} className="inline mr-1" /> : <Zap size={10} className="inline mr-1" />}
                      {r.type}
                    </span>
                  </div>
                  <span className="text-sm font-black text-blue-400 shrink-0">
                    ${r.price.toFixed(2)}
                  </span>
                </Link>
              ))}
              <Link
                href={`/products?q=${encodeURIComponent(query)}`}
                onClick={() => { setOpen(false); }}
                className="block px-4 py-3 text-center text-xs font-black uppercase tracking-widest text-violet-400
                           hover:text-violet-300 hover:bg-violet-500/5 transition-colors"
              >
                View all results →
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
