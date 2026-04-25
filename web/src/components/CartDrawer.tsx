"use client";

import { useCart } from "@/app/context/CartContext";
import { X, ShoppingBag, Trash2, ArrowRight, Tag, Check } from "lucide-react";
import Image from "next/image";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { checkoutAction } from "@/app/actions/checkout";
import { validateCouponAction } from "@/app/actions/coupon";

const COUPONS_PLACEHOLDER = null; // coupons are fetched from DB

export default function CartDrawer() {
  const { isCartOpen, setIsCartOpen, cart, removeFromCart, totalPrice, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [isValidating, startValidating] = useTransition();

  if (!isCartOpen) return null;

  const applyCoupon = () => {
    if (!couponInput.trim()) return;
    startValidating(async () => {
      const res = await validateCouponAction(couponInput.trim());
      if (res.valid) {
        setDiscount(res.discount!);
        setAppliedCoupon(res.code!);
        toast.success(`Coupon applied! ${res.discount}% off 🎉`);
      } else {
        toast.error(res.message || "Invalid coupon");
      }
    });
  };

  const removeCoupon = () => {
    setDiscount(0);
    setAppliedCoupon("");
    setCouponInput("");
  };

  const discountAmount = (totalPrice * discount) / 100;
  const finalTotal = totalPrice - discountAmount;

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setIsProcessing(true);
    try {
      const result = await checkoutAction(cart);
      if (result.success) {
        toast.success("Order placed successfully!");
        clearCart();
        setIsCartOpen(false);
        setDiscount(0);
        setAppliedCoupon("");
      } else {
        toast.error(result.message || "Checkout failed");
      }
    } catch {
      toast.error("An unexpected error occurred during checkout");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md h-full bg-[#080612]/95 border-l border-white/10 shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 overflow-hidden backdrop-blur-xl">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[80px] pointer-events-none" />

        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center border border-blue-500/30">
              <ShoppingBag size={20} className="text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-black uppercase tracking-widest text-white">Your Cart</h2>
              {cart.length > 0 && (
                <p className="text-[10px] text-zinc-500 font-bold">{cart.reduce((s,i)=>s+i.quantity,0)} items</p>
              )}
            </div>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-zinc-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar relative z-10">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
              <ShoppingBag size={64} className="text-zinc-500" />
              <p className="text-zinc-400 font-bold uppercase tracking-widest text-sm">Your cart is empty</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 group hover:border-white/10 transition-all">
                <div className="w-20 h-20 rounded-xl bg-black/50 overflow-hidden relative border border-white/10">
                  {item.imageUrl ? (
                    <Image src={item.imageUrl} alt={item.name} fill unoptimized className="object-cover opacity-80" />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/50 to-purple-900/50" />
                  )}
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-white text-sm line-clamp-2 pr-2">{item.name}</h4>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-zinc-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="flex justify-between items-end mt-2">
                    <span className="text-xs font-black text-zinc-500">QTY: {item.quantity}</span>
                    <span className="font-black text-blue-400">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-white/10 bg-white/5 relative z-10 space-y-4">

            {/* Coupon */}
            {appliedCoupon ? (
              <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-green-500/10 border border-green-500/20">
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-green-400" />
                  <span className="text-xs font-black text-green-400 uppercase tracking-widest">{appliedCoupon}</span>
                  <span className="text-xs text-zinc-400">— {discount}% off</span>
                </div>
                <button onClick={removeCoupon} className="text-zinc-500 hover:text-red-400 transition-colors">
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <div className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-2xl bg-white/5 border border-white/10">
                  <Tag size={14} className="text-zinc-500 shrink-0" />
                  <input
                    value={couponInput}
                    onChange={e => setCouponInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && applyCoupon()}
                    placeholder="Coupon code"
                    className="bg-transparent text-sm text-white placeholder-zinc-600 outline-none flex-1 font-medium"
                  />
                </div>
                <button
                  onClick={applyCoupon}
                  disabled={isValidating}
                  className="px-4 py-2.5 rounded-2xl bg-violet-600/20 border border-violet-500/30 text-violet-400 text-xs font-black uppercase tracking-widest hover:bg-violet-600/30 transition-colors disabled:opacity-50"
                >
                  {isValidating ? "..." : "Apply"}
                </button>
              </div>
            )}

            {/* Totals */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-zinc-400">Subtotal</span>
                <span className="font-black text-white">${totalPrice.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold text-green-400">Discount ({discount}%)</span>
                  <span className="font-black text-green-400">-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-2 border-t border-white/10">
                <span className="font-bold uppercase tracking-widest text-zinc-400 text-sm">Total</span>
                <span className="text-2xl font-black text-white">${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-black uppercase tracking-widest rounded-2xl flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(109,40,217,0.3)] hover:shadow-[0_0_30px_rgba(109,40,217,0.5)] transition-all disabled:opacity-50"
            >
              {isProcessing ? "Processing..." : "Secure Checkout"}
              {!isProcessing && <ArrowRight size={18} />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
