import Link from "next/link";
import { ArrowLeft, Hexagon } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-[#05050A] text-center px-4 relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[80px] pointer-events-none mix-blend-screen" />

      <div className="relative z-10 glass-panel p-12 rounded-[40px] border border-white/5 max-w-xl w-full shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
        <div className="w-24 h-24 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
          <Hexagon size={48} className="text-red-500" />
        </div>
        
        <h1 className="text-7xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-500 tracking-tighter">
          404
        </h1>
        <h2 className="text-2xl font-black text-white uppercase tracking-widest mb-4">
          Page Not Found
        </h2>
        <p className="text-zinc-400 mb-10 text-sm leading-relaxed">
          The asset you are looking for does not exist in our vaults. It may have been moved, deleted, or never existed.
        </p>
        
        <Link 
          href="/" 
          className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-black uppercase tracking-widest rounded-2xl transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)]"
        >
          <ArrowLeft size={18} />
          Return to Hub
        </Link>
      </div>
    </div>
  );
}
