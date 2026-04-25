"use client";

import Link from "next/link";
import { useCart } from "@/app/context/CartContext";
import { useWishlist } from "@/app/context/WishlistContext";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, ShieldCheck, Heart } from "lucide-react";
import LiveSearch from "@/components/LiveSearch";

export default function Header() {
  const { totalItems, setIsCartOpen } = useCart();
  const { wishlist } = useWishlist();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogin = () => {
    if (username === "1231" && password === "1231") {
      setIsModalOpen(false);
      router.push("/admin");
    } else {
      alert("البيانات غير صحيحة!");
    }
  };

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
        
        <nav className="flex items-center gap-4">
          <Link href="/products" className="text-sm font-bold text-zinc-400 hover:text-white uppercase tracking-widest transition-colors">Products</Link>
          <LiveSearch />

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
          
          <div className="flex items-center gap-5 border-l border-white/10 pl-5">
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

            <button 
              onClick={() => setIsModalOpen(true)}
              className="glass-button flex items-center gap-2 px-4 py-2 rounded-xl text-zinc-300 hover:text-white"
            >
              <ShieldCheck size={18} className="text-blue-500" />
              <span className="text-xs font-black uppercase tracking-widest">Admin</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Admin Login Modal (Premium Neon Glass) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-xl p-4 animate-in fade-in duration-300">
          <div className="glass-panel w-full max-w-md rounded-[32px] p-10 animate-in zoom-in-95 duration-500 shadow-[0_0_50px_rgba(37,99,235,0.15)] relative overflow-hidden">
            {/* Decorative Glow */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-600/30 rounded-full blur-[50px] pointer-events-none"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-600/20 rounded-full blur-[50px] pointer-events-none"></div>

            <div className="relative z-10">
              <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-blue-500/30 shadow-[0_0_20px_rgba(37,99,235,0.2)]">
                <ShieldCheck size={32} className="text-blue-400" />
              </div>
              <h2 className="text-3xl font-black mb-8 text-center text-white tracking-tight">System Access</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-2 text-zinc-400 ml-1">Username</label>
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="glass-input w-full p-4 rounded-2xl font-medium tracking-wide"
                    placeholder="Enter clearance code"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-2 text-zinc-400 ml-1">Password</label>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="glass-input w-full p-4 rounded-2xl font-medium tracking-widest"
                    placeholder="••••••••"
                  />
                </div>
                <div className="pt-4">
                  <button 
                    onClick={handleLogin}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-black uppercase tracking-widest py-4 rounded-2xl transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] active:scale-[0.98]"
                  >
                    Authenticate
                  </button>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="w-full mt-4 text-zinc-500 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors py-2"
                  >
                    Cancel / Go Back
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
