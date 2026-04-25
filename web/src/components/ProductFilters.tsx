"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";

export default function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentType = searchParams.get("type");
  const currentSearch = searchParams.get("q") || "";

  const [searchValue, setSearchValue] = useState(currentSearch);

  // Sync state if URL changes
  useEffect(() => {
    setSearchValue(searchParams.get("q") || "");
  }, [searchParams]);

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    return params.toString();
  };

  const setFilter = (type: string | null) => {
    router.push(`?${createQueryString("type", type || "")}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`?${createQueryString("q", searchValue)}`);
  };

  return (
    <div className="flex flex-col items-center justify-center mb-16 gap-6 w-full md:w-auto">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="w-full max-w-md relative group z-20">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search size={20} className="text-zinc-500 group-focus-within:text-blue-400 transition-colors" />
        </div>
        <input 
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search for an asset..."
          className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-full pl-12 pr-6 py-4 outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all shadow-[0_0_20px_rgba(0,0,0,0.5)] focus:shadow-[0_0_30px_rgba(37,99,235,0.2)] placeholder:text-zinc-500"
        />
        <button type="submit" className="hidden">Search</button>
      </form>

      {/* Type Filters */}
      <div className="flex flex-wrap items-center justify-center gap-3 p-1.5 glass-panel rounded-full relative z-20">
        <button 
          onClick={() => setFilter(null)}
          className={`px-6 md:px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
            !currentType 
              ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]" 
              : "text-zinc-400 hover:text-white hover:bg-white/5"
          }`}
        >
          All Assets
        </button>
        <button 
          onClick={() => setFilter("PHYSICAL")}
          className={`px-6 md:px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
            currentType === "PHYSICAL" 
              ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]" 
              : "text-zinc-400 hover:text-white hover:bg-white/5"
          }`}
        >
          Physical Goods
        </button>
        <button 
          onClick={() => setFilter("DIGITAL")}
          className={`px-6 md:px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
            currentType === "DIGITAL" 
              ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]" 
              : "text-zinc-400 hover:text-white hover:bg-white/5"
          }`}
        >
          Digital Items
        </button>
      </div>
    </div>
  );
}
