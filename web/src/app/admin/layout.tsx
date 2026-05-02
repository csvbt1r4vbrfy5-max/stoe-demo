"use client";

import Link from "next/link";
import { LayoutDashboard, ClipboardList, Tag, ArrowLeft, Activity, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { logoutAction } from "@/app/actions/auth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logoutAction(); // Call the secure Server Action to delete the HttpOnly cookie
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-[#05050A] flex flex-col md:flex-row font-sans text-white selection:bg-blue-600/30">
      
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-white/5 bg-black/40 backdrop-blur-xl z-20 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-black shadow-[0_0_15px_rgba(37,99,235,0.4)]">
            1
          </div>
          <span className="font-black tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500">
            one to one
          </span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 bg-white/5 rounded-xl text-white">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar — مشترك لجميع صفحات الأدمن */}
      <aside className={`w-full md:w-72 border-r border-white/5 bg-black/40 backdrop-blur-xl flex-col p-8 space-y-8 md:space-y-12 relative z-10 ${isMobileMenuOpen ? "flex" : "hidden md:flex"}`}>
        <div className="flex items-center gap-4 px-2 group">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-[0_0_20px_rgba(37,99,235,0.4)] group-hover:scale-110 transition-transform duration-300">
            1
          </div>
          <span className="font-black text-2xl tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500">
            one to one
          </span>
        </div>

        <nav className="space-y-2 flex-grow">
          <div className="px-4 mb-4 text-[10px] font-black tracking-[0.2em] uppercase text-zinc-500">Menu</div>
          <Link
            href="/admin"
            className="flex items-center gap-4 px-4 py-3 rounded-2xl text-zinc-400 hover:text-white hover:bg-white/5 transition-all font-bold aria-[current=page]:bg-blue-600/20 aria-[current=page]:text-blue-400 aria-[current=page]:border aria-[current=page]:border-blue-500/20"
          >
            <LayoutDashboard size={20} />
            Command Center
          </Link>
          <Link
            href="/admin/orders"
            className="flex items-center gap-4 px-4 py-3 rounded-2xl text-zinc-400 hover:text-white hover:bg-white/5 transition-all font-bold aria-[current=page]:bg-blue-600/20 aria-[current=page]:text-blue-400 aria-[current=page]:border aria-[current=page]:border-blue-500/20"
          >
            <ClipboardList size={20} />
            Orders
          </Link>
          <Link
            href="/admin/coupons"
            className="flex items-center gap-4 px-4 py-3 rounded-2xl text-zinc-400 hover:text-white hover:bg-white/5 transition-all font-bold aria-[current=page]:bg-blue-600/20 aria-[current=page]:text-blue-400 aria-[current=page]:border aria-[current=page]:border-blue-500/20"
          >
            <Tag size={20} />
            Coupons
          </Link>
          <Link
            href="/"
            className="flex items-center gap-4 px-4 py-3 rounded-2xl text-zinc-400 hover:text-white hover:bg-white/5 transition-all font-bold"
          >
            <ArrowLeft size={20} />
            Return to Surface
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-all font-bold"
          >
            <LogOut size={20} />
            Logout
          </button>
        </nav>

        <div className="p-6 glass-panel rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/20 blur-[30px]" />
          <Activity size={24} className="text-blue-400 mb-4" />
          <p className="text-xs font-black uppercase tracking-widest text-white mb-1">System Online</p>
          <p className="text-[10px] font-bold text-zinc-500 tracking-wider">All diagnostics normal</p>
        </div>
      </aside>

      {/* محتوى الصفحة */}
      <div className="flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
}
