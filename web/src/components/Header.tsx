"use client";

import Link from "next/link";
import { useCart } from "@/app/context/CartContext";
import { useWishlist } from "@/app/context/WishlistContext";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ShoppingCart, ShieldCheck, Heart, Menu, X, Search } from "lucide-react";
import LiveSearch from "@/components/LiveSearch";

export default function Header() {
  const { totalItems, setIsCartOpen } = useCart();
  const { wishlist } = useWishlist();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);



  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? "glass shadow-2xl py-3 border-b border-white/10" : "bg-transparent py-5"}`}>
      <div className="container mx-auto px-4 lg:px-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl overflow-hidden flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)] group-hover:shadow-[0_0_30px_rgba(147,51,234,0.6)] transition-all duration-300">
             <Image 
               src="/logo.png" 
               alt="Logo" 
               width={48} 
               height={48} 
               className="object-cover group-hover:scale-110 transition-transform duration-500" 
             />
          </div>
          <span className="text-2xl font-black text-white tracking-widest uppercase relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-blue-500 after:transition-all after:duration-300 group-hover:after:w-full">
            ONE<span className="text-blue-500">TO</span>ONE
          </span>
        </Link>
        
        <nav className="flex items-center gap-3 md:gap-4">
          <Link href="/products" className="hidden lg:block text-sm font-bold text-zinc-400 hover:text-white uppercase tracking-widest transition-colors">Products</Link>
          
          <div className="hidden md:block">
            <LiveSearch />
          </div>

          {/* Wishlist button */}
          <Link href="/wishlist" className="relative p-2 rounded-xl hover:bg-white/5 transition-colors group">
            <Heart
              size={22}
              className={`transition-colors ${
                wishlist.length > 0 ? "text-red-400 fill-red-400" : "text-zinc-400 group-hover:text-red-400"
              }`}
            />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full shadow-[0_0_8px_rgba(239,68,68,0.6)]">
                {wishlist.length}
              </span>
            )}
          </Link>
          
          <div className="flex items-center gap-2 md:gap-5 md:border-l border-white/10 md:pl-5">
            <button onClick={() => setIsCartOpen(true)} className="relative cursor-pointer group">
              <div className="p-2 rounded-xl group-hover:bg-white/5 transition-colors">
                <ShoppingCart size={24} className="text-zinc-300 group-hover:text-blue-400 transition-colors" />
              </div>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow-[0_0_10px_rgba(37,99,235,0.8)] animate-in fade-in zoom-in">
                  {totalItems}
                </span>
              )}
            </button>

            <Link 
              href="/admin"
              className="glass-button hidden md:flex items-center gap-2 px-4 py-2 rounded-xl text-zinc-300 hover:text-white"
            >
              <ShieldCheck size={18} className="text-blue-500" />
              <span className="text-xs font-black uppercase tracking-widest">Admin</span>
            </Link>

            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full glass shadow-2xl border-b border-white/10 flex flex-col p-4 gap-4 animate-in slide-in-from-top-2">
          <LiveSearch />
          <div className="flex items-center justify-between mt-2">
            <Link onClick={() => setIsMobileMenuOpen(false)} href="/products" className="text-sm font-bold text-zinc-300 hover:text-white uppercase tracking-widest transition-colors">Browse Products</Link>
            <Link 
              onClick={() => setIsMobileMenuOpen(false)}
              href="/admin"
              className="glass-button flex items-center gap-2 px-4 py-2 rounded-xl text-zinc-300 hover:text-white"
            >
              <ShieldCheck size={18} className="text-blue-500" />
              <span className="text-xs font-black uppercase tracking-widest">Admin</span>
            </Link>
          </div>
        </div>
      )}


    </header>
  );
}
