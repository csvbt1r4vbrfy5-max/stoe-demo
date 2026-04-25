import { db } from "@/lib/db";
import { Package, ShoppingCart, Hexagon } from "lucide-react";
import BorderGlow from "@/components/BorderGlow";
import AddProductForm from "@/components/AddProductForm";
import ProductActions from "./components/ProductActions";

export default async function AdminPage() {
  // جلب البيانات بالتوازي لأفضل أداء
  const [products, physicalCount, digitalCount] = await Promise.all([
    db.product.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        type: true,
        imageUrl: true,
        physicalDetails: { select: { stockQuantity: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    }),
    db.product.count({ where: { type: 'PHYSICAL' } }),
    db.product.count({ where: { type: 'DIGITAL' } }),
  ]);

  const stats = [
    { label: "Total Assets", value: products.length, icon: Hexagon, color: "text-blue-400", glow: "220 80 80", bg: "bg-blue-500/20" },
    { label: "Physical Goods", value: physicalCount, icon: Package, color: "text-orange-400", glow: "30 80 80", bg: "bg-orange-500/20" },
    { label: "Digital Goods", value: digitalCount, icon: ShoppingCart, color: "text-purple-400", glow: "280 80 80", bg: "bg-purple-500/20" },
  ];

  return (
    <main className="flex-1 p-8 md:p-16 space-y-12 h-screen overflow-y-auto custom-scrollbar relative">
      {/* Background ambient glow */}
      <div className="absolute top-[10%] right-[10%] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        <div>
          <h1 className="text-5xl font-black tracking-tighter mb-2 uppercase text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400">Command Center</h1>
          <p className="text-blue-400 font-black text-xs uppercase tracking-[0.2em]">Asset Management Interface v2.0</p>
        </div>

        <AddProductForm />
      </header>

      {/* Stats Grid - الإحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
        {stats.map((stat, i) => (
          <BorderGlow
            key={i}
            borderRadius={32}
            backgroundColor="transparent"
            glowColor={stat.glow}
            animated={true}
          >
            <div className="glass-panel p-8 h-full flex flex-col justify-between min-h-[160px]">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-14 h-14 rounded-[20px] ${stat.bg} border border-white/5 flex items-center justify-center ${stat.color} shadow-lg`}>
                  <stat.icon size={28} />
                </div>
                <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center bg-white/5 text-zinc-500">
                   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/></svg>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                <p className="text-4xl font-black text-white tracking-tighter">{stat.value}</p>
              </div>
            </div>
          </BorderGlow>
        ))}
      </div>

      {/* Product Table - جدول المنتجات */}
      <BorderGlow
        borderRadius={36}
        backgroundColor="transparent"
        glowColor="220 80 80"
        animated={true}
      >
        <section className="glass-panel overflow-hidden h-full">
          <div className="p-8 border-b border-white/10 flex items-center justify-between bg-white/5">
            <h2 className="text-2xl font-black uppercase tracking-widest text-white">Asset Inventory</h2>
            <div className="px-4 py-2 bg-blue-500/20 rounded-xl text-xs font-black text-blue-400 uppercase tracking-widest border border-blue-500/30">
              {products.length} Logs Found
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] border-b border-white/5 bg-black/20">
                  <th className="px-8 py-6">Asset Designation</th>
                  <th className="px-8 py-6">Classification</th>
                  <th className="px-8 py-6">Value (USD)</th>
                  <th className="px-8 py-6 text-right">Directives</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {products.map((product) => (
                  <tr key={product.id} className="group hover:bg-white/5 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-black/50 overflow-hidden relative border border-white/10 shadow-lg">
                           {product.imageUrl ? (
                             <img src={product.imageUrl} alt={product.name} className="object-cover w-full h-full opacity-80 group-hover:opacity-100 transition-opacity" />
                           ) : (
                             <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-tr from-blue-900/50 to-purple-900/50" />
                           )}
                        </div>
                        <div>
                          <p className="font-black text-lg text-white tracking-wide mb-1">{product.name}</p>
                          <p className="text-xs text-zinc-500 font-medium line-clamp-1 max-w-xs">{product.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg ${
                        product.type === 'PHYSICAL' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                      }`}>
                        {product.type}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-200">
                        ${Number(product.price).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <ProductActions product={{
                        ...product,
                        price: Number(product.price)
                      }} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </BorderGlow>
    </main>
  );
}
