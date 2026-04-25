import { db } from "@/lib/db";
import { ShoppingCart } from "lucide-react";
import BorderGlow from "@/components/BorderGlow";
import OrderStatusSelect from "./OrderStatusSelect";

export default async function AdminOrdersPage() {
  const orders = await db.order.findMany({
    select: {
      id: true,
      status: true,
      totalAmount: true,
      createdAt: true,
      user: { select: { name: true, email: true } },
      items: {
        select: {
          id: true,
          quantity: true,
          product: { select: { name: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const statusColors: Record<string, string> = {
    PENDING:    "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    PAID:       "bg-blue-500/20 text-blue-400 border-blue-500/30",
    PROCESSING: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
    SHIPPED:    "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    DELIVERED:  "bg-green-500/20 text-green-400 border-green-500/30",
    CANCELLED:  "bg-red-500/20 text-red-400 border-red-500/30",
  };

  return (
    <main className="flex-1 p-8 md:p-16 space-y-12 h-screen overflow-y-auto relative">
      <div className="absolute top-[10%] right-[10%] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

      <header className="relative z-10">
        <h1 className="text-5xl font-black tracking-tighter mb-2 uppercase text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400">
          Orders
        </h1>
        <p className="text-blue-400 font-black text-xs uppercase tracking-[0.2em]">
          {orders.length} orders total
        </p>
      </header>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 relative z-10">
        {["PENDING","PAID","PROCESSING","SHIPPED","DELIVERED","CANCELLED"].map(status => {
          const count = orders.filter(o => o.status === status).length;
          return (
            <div key={status} className={`glass-panel p-4 rounded-2xl border ${statusColors[status].split(" ")[2]}`}>
              <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1">{status}</p>
              <p className={`text-2xl font-black ${statusColors[status].split(" ")[1]}`}>{count}</p>
            </div>
          );
        })}
      </div>

      {/* Orders table */}
      <BorderGlow borderRadius={36} backgroundColor="transparent" glowColor="220 80 80" animated={true} className="relative z-10">
        <section className="glass-panel overflow-hidden h-full">
          <div className="p-8 border-b border-white/10 bg-white/5 flex items-center justify-between">
            <h2 className="text-2xl font-black uppercase tracking-widest text-white">Order Log</h2>
            <div className="px-4 py-2 bg-blue-500/20 rounded-xl text-xs font-black text-blue-400 uppercase tracking-widest border border-blue-500/30">
              {orders.length} Records
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="p-16 text-center text-zinc-500">
              <ShoppingCart size={48} className="mx-auto mb-4 opacity-30" />
              <p className="font-bold uppercase tracking-widest text-sm">No orders yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] border-b border-white/5 bg-black/20">
                    <th className="px-8 py-6">Order ID</th>
                    <th className="px-8 py-6">Customer</th>
                    <th className="px-8 py-6">Items</th>
                    <th className="px-8 py-6">Total</th>
                    <th className="px-8 py-6">Date</th>
                    <th className="px-8 py-6">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {orders.map((order) => (
                    <tr key={order.id} className="group hover:bg-white/5 transition-colors">
                      <td className="px-8 py-6">
                        <span className="font-mono text-xs text-zinc-500">{order.id.slice(0, 8)}...</span>
                      </td>
                      <td className="px-8 py-6">
                        <p className="font-black text-white text-sm">{order.user.name ?? "—"}</p>
                        <p className="text-xs text-zinc-500">{order.user.email}</p>
                      </td>
                      <td className="px-8 py-6">
                        <div className="space-y-1">
                          {order.items.map((item) => (
                            <p key={item.id} className="text-xs text-zinc-400 line-clamp-1">
                              {item.product.name} <span className="text-zinc-600">×{item.quantity}</span>
                            </p>
                          ))}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-200">
                          ${Number(order.totalAmount).toFixed(2)}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-xs text-zinc-400">
                          {new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </BorderGlow>
    </main>
  );
}
