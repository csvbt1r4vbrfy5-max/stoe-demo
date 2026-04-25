"use client";

import { useState, useTransition } from "react";
import { createCouponAction, updateCouponAction, deleteCouponAction } from "@/app/actions/coupon";
import { Coupon } from "@prisma/client";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Check, X, Tag, ToggleLeft, ToggleRight } from "lucide-react";

export default function CouponsManager({ initialCoupons }: { initialCoupons: Coupon[] }) {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isPending, startTransition] = useTransition();

  const resetForm = () => {
    setCode(""); setDiscount(""); setIsActive(true);
    setShowForm(false); setEditingId(null);
  };

  const startEdit = (c: Coupon) => {
    setEditingId(c.id);
    setCode(c.code);
    setDiscount(String(c.discount));
    setIsActive(c.isActive);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    fd.set("code", code);
    fd.set("discount", discount);
    fd.set("isActive", String(isActive));

    startTransition(async () => {
      const res = editingId
        ? await updateCouponAction(editingId, fd)
        : await createCouponAction(fd);

      if (res.success) {
        toast.success(res.message);
        resetForm();
        // Refresh: refetch from server would require router.refresh() — simpler to update locally
        window.location.reload();
      } else {
        toast.error(res.message);
      }
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const res = await deleteCouponAction(id);
      if (res.success) {
        toast.success("Coupon deleted");
        setCoupons(prev => prev.filter(c => c.id !== id));
      } else {
        toast.error(res.message);
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Add button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl
                     bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500
                     text-white font-black uppercase tracking-widest text-xs
                     shadow-[0_0_20px_rgba(109,40,217,0.3)] hover:shadow-[0_0_30px_rgba(109,40,217,0.5)]
                     transition-all"
        >
          <Plus size={16} /> New Coupon
        </button>
      )}

      {/* Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="glass-panel rounded-3xl p-8 space-y-6 border border-violet-500/20 shadow-[0_0_30px_rgba(109,40,217,0.1)]"
        >
          <h3 className="text-lg font-black uppercase tracking-widest text-white">
            {editingId ? "Edit Coupon" : "New Coupon"}
          </h3>

          <div className="grid sm:grid-cols-2 gap-4">
            {/* Code */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-2">
                Coupon Code
              </label>
              <div className="flex items-center gap-2 glass-input px-4 py-3 rounded-2xl">
                <Tag size={14} className="text-zinc-500 shrink-0" />
                <input
                  value={code}
                  onChange={e => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. SAVE20"
                  required
                  className="bg-transparent text-white text-sm font-black tracking-widest uppercase outline-none flex-1 placeholder-zinc-600"
                />
              </div>
            </div>

            {/* Discount */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-2">
                Discount (%)
              </label>
              <div className="flex items-center gap-2 glass-input px-4 py-3 rounded-2xl">
                <input
                  type="number"
                  min="1" max="100"
                  value={discount}
                  onChange={e => setDiscount(e.target.value)}
                  placeholder="10"
                  required
                  className="bg-transparent text-white text-sm font-black outline-none flex-1 placeholder-zinc-600"
                />
                <span className="text-zinc-500 font-black">%</span>
              </div>
            </div>
          </div>

          {/* Active toggle */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsActive(v => !v)}
              className={`transition-colors ${isActive ? "text-green-400" : "text-zinc-600"}`}
            >
              {isActive ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
            </button>
            <span className="text-sm font-bold text-zinc-400">
              {isActive ? "Active" : "Inactive"}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600
                         text-white font-black uppercase tracking-widest text-xs transition-all disabled:opacity-50"
            >
              <Check size={14} />
              {isPending ? "Saving..." : editingId ? "Update" : "Create"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl border border-white/10 text-zinc-400
                         hover:text-white hover:border-white/20 font-black uppercase tracking-widest text-xs transition-all"
            >
              <X size={14} /> Cancel
            </button>
          </div>
        </form>
      )}

      {/* Coupons table */}
      <div className="glass-panel rounded-3xl overflow-hidden">
        <div className="px-8 py-5 border-b border-white/10 bg-white/5 flex items-center justify-between">
          <h3 className="font-black uppercase tracking-widest text-white text-sm">Active Coupons</h3>
          <span className="px-3 py-1 bg-violet-500/20 rounded-xl text-xs font-black text-violet-400 border border-violet-500/30 uppercase tracking-widest">
            {coupons.length} Total
          </span>
        </div>

        {coupons.length === 0 ? (
          <div className="p-16 text-center text-zinc-500">
            <Tag size={40} className="mx-auto mb-4 opacity-30" />
            <p className="font-bold uppercase tracking-widest text-sm">No coupons yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] border-b border-white/5 bg-black/20">
                  <th className="px-8 py-5">Code</th>
                  <th className="px-8 py-5">Discount</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5">Created</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {coupons.map(c => (
                  <tr key={c.id} className="group hover:bg-white/5 transition-colors">
                    <td className="px-8 py-5">
                      <span className="font-mono font-black text-white tracking-widest text-sm bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
                        {c.code}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
                        {c.discount}%
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        c.isActive
                          ? "bg-green-500/20 text-green-400 border-green-500/30"
                          : "bg-zinc-500/20 text-zinc-500 border-zinc-500/30"
                      }`}>
                        {c.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-xs text-zinc-500">
                      {new Date(c.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => startEdit(c)}
                          className="p-2 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20 transition-all"
                          title="Edit"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(c.id)}
                          disabled={isPending}
                          className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-all disabled:opacity-50"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
