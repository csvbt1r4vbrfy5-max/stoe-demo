"use client";

import { useCart } from "@/app/context/CartContext";
import { useState } from "react";
import Link from "next/link";

export default function CheckoutPage() {
  const { cart, totalPrice, clearCart } = useCart();
  const [isOrdered, setIsOrdered] = useState(false);

  const handleOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOrdered(true);
    clearCart();
  };

  if (isOrdered) {
    return (
      <div className="container mx-auto px-4 py-24 text-center space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto text-green-600 shadow-xl shadow-green-500/20">
           <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
             <path d="M20 6L9 17l-5-5"/>
           </svg>
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight">Order Confirmed!</h1>
          <p className="text-zinc-500 max-w-sm mx-auto text-lg leading-relaxed">
            Thank you for choosing <span className="font-bold text-blue-600">one to one</span>. Your premium selection is being prepared.
          </p>
        </div>
        <Link href="/" className="inline-block px-10 py-4 bg-blue-600 text-white rounded-full font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all hover:scale-105 active:scale-95">
           Back to Store
        </Link>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
       <div className="container mx-auto px-4 py-24 text-center">
         <p className="text-zinc-500 mb-8">No items in cart to checkout.</p>
         <Link href="/" className="px-6 py-3 bg-blue-600 text-white rounded-full">Back to Shop</Link>
       </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto grid lg:grid-cols-5 gap-12">
        <div className="lg:col-span-3 space-y-8">
           <h1 className="text-4xl font-extrabold tracking-tight mb-8">Checkout</h1>
           
           <form onSubmit={handleOrder} className="space-y-8">
              <section className="space-y-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-zinc-950 text-white flex items-center justify-center text-xs">1</span>
                  Shipping Information
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="First Name" className="w-full glass p-4 rounded-2xl outline-none focus:border-blue-600 transition-all" required />
                  <input type="text" placeholder="Last Name" className="w-full glass p-4 rounded-2xl outline-none focus:border-blue-600 transition-all" required />
                  <input type="email" placeholder="Email Address" className="w-full glass p-4 rounded-2xl col-span-2 outline-none focus:border-blue-600 transition-all" required />
                  <input type="text" placeholder="Street Address" className="w-full glass p-4 rounded-2xl col-span-2 outline-none focus:border-blue-600 transition-all" required />
                  <input type="text" placeholder="City" className="w-full glass p-4 rounded-2xl outline-none focus:border-blue-600 transition-all" required />
                  <input type="text" placeholder="ZIP Code" className="w-full glass p-4 rounded-2xl outline-none focus:border-blue-600 transition-all" required />
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-zinc-950 text-white flex items-center justify-center text-xs">2</span>
                  Payment Details
                </h2>
                <div className="glass p-6 rounded-2xl space-y-4 border-2 border-blue-600/20 bg-blue-600/5">
                   <p className="text-sm font-medium text-zinc-600 mb-4">Select Payment Method</p>
                   <div className="flex items-center gap-4">
                      <div className="p-3 border-2 border-blue-600 rounded-xl bg-white flex items-center gap-2 cursor-pointer shadow-sm">
                         <div className="w-4 h-4 rounded-full border-4 border-blue-600" />
                         <span className="font-bold text-sm">Credit Card</span>
                      </div>
                      <div className="p-3 border-2 border-transparent rounded-xl flex items-center gap-2 cursor-wait opacity-50 select-none grayscale">
                        <div className="w-4 h-4 rounded-full border-2 border-zinc-300" />
                        <span className="font-medium text-sm">PayPal</span>
                      </div>
                   </div>
                   
                   <div className="pt-4 space-y-4">
                      <input type="text" placeholder="Card Number" className="w-full p-4 rounded-xl border-0 bg-white shadow-sm outline-none focus:ring-2 focus:ring-blue-600/20 transition-all" />
                      <div className="grid grid-cols-3 gap-4">
                        <input type="text" placeholder="MM/YY" className="p-4 rounded-xl border-0 bg-white shadow-sm outline-none focus:ring-2 focus:ring-blue-600/20 transition-all" />
                        <input type="text" placeholder="CVC" className="p-4 rounded-xl border-0 bg-white shadow-sm outline-none focus:ring-2 focus:ring-blue-600/20 transition-all" />
                      </div>
                   </div>
                </div>
              </section>

              <button type="submit" className="w-full py-5 bg-zinc-950 dark:bg-white text-white dark:text-black rounded-full font-black text-lg shadow-xl hover:scale-[1.01] active:scale-95 transition-all">
                Complete Purchase
              </button>
           </form>
        </div>

        <div className="lg:col-span-2 pt-16">
          <div className="glass p-8 rounded-3xl sticky top-24 space-y-6">
            <h2 className="text-2xl font-bold">In your bag</h2>
            
            <div className="max-h-[300px] overflow-auto space-y-4 pr-2 custom-scrollbar">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center shrink-0">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-blue-600 opacity-20"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between">
                      <span className="font-bold text-sm line-clamp-1">{item.name}</span>
                      <span className="font-black text-sm text-blue-600">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-zinc-500">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t space-y-2">
               <div className="flex justify-between text-sm">
                 <span className="text-zinc-500">Subtotal</span>
                 <span className="font-medium">${totalPrice.toFixed(2)}</span>
               </div>
               <div className="flex justify-between text-sm">
                 <span className="text-zinc-500">Shipping</span>
                 <span className="text-green-500 font-medium">Free</span>
               </div>
               <div className="flex justify-between pt-4">
                 <span className="text-lg font-bold">Total Price</span>
                 <span className="text-2xl font-black text-blue-600">${totalPrice.toFixed(2)}</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
