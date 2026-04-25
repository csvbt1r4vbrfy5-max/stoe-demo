import { db } from "@/lib/db";
import { Tag } from "lucide-react";
import CouponsManager from "./CouponsManager";

export default async function AdminCouponsPage() {
  const coupons = await db.coupon.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <main className="flex-1 p-8 md:p-16 space-y-12 h-screen overflow-y-auto relative">
      <div className="absolute top-[10%] right-[10%] w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />

      <header className="relative z-10">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 bg-violet-500/20 rounded-2xl flex items-center justify-center border border-violet-500/30">
            <Tag size={24} className="text-violet-400" />
          </div>
          <div>
            <h1 className="text-5xl font-black tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400">
              Coupons
            </h1>
            <p className="text-violet-400 font-black text-xs uppercase tracking-[0.2em]">
              Discount Code Management
            </p>
          </div>
        </div>
      </header>

      <div className="relative z-10">
        <CouponsManager initialCoupons={coupons} />
      </div>
    </main>
  );
}
