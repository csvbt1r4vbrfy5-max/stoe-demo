"use client";

import { useCart } from "@/app/context/CartContext";
import Link from "next/link";
import Image from "next/image";

export default function CartPage() {
  const { cart, removeFromCart, totalPrice, totalItems, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-24 h-24 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mx-auto text-zinc-400">
           <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
             <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
           </svg>
        </div>
        <h1 className="text-3xl font-bold">Your cart is empty</h1>
        <p className="text-zinc-500 max-w-sm mx-auto">Looks like you haven't added anything to your cart yet. Explore our collection to find something you love.</p>
        <Link href="/" className="inline-block px-8 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-all">
           Go Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-extrabold tracking-tight mb-8">Shopping Cart</h1>
      
      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          {cart.map((item) => (
            <div key={item.id} className="glass p-6 rounded-3xl flex items-center gap-6 group hover:shadow-lg transition-all">
              <div className="w-24 h-24 bg-zinc-100 dark:bg-zinc-900 rounded-2xl flex items-center justify-center overflow-hidden">
                {item.imageUrl ? (
                  <Image src={item.imageUrl} alt={item.name} width={96} height={96} unoptimized className="object-cover" />
                ) : (
                  <div className="text-blue-600/20">
                     <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                  </div>
                )}
              </div>
              
              <div className="flex-grow">
                <h3 className="text-xl font-bold">{item.name}</h3>
                <p className="text-zinc-500 text-sm">Quantity: {item.quantity}</p>
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 text-sm font-medium hover:underline mt-2"
                >
                  Remove Item
                </button>
              </div>
              
              <div className="text-right">
                <p className="text-xl font-black text-blue-600">${(item.price * item.quantity).toFixed(2)}</p>
                <p className="text-xs text-zinc-400">${item.price.toFixed(2)} each</p>
              </div>
            </div>
          ))}

          <button 
            onClick={clearCart}
            className="text-zinc-500 hover:text-red-500 transition-colors text-sm font-medium"
          >
            Clear Cart
          </button>
        </div>

        <div className="space-y-6">
          <div className="glass p-8 rounded-3xl space-y-6">
            <h2 className="text-2xl font-bold">Order Summary</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>Subtotal ({totalItems} items)</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>Shipping</span>
                <span className="text-green-500">Free</span>
              </div>
              <div className="pt-4 border-t flex justify-between items-end">
                <span className="text-lg font-bold">Total</span>
                <span className="text-3xl font-black text-blue-600">${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <Link href="/checkout" className="w-full inline-block text-center py-4 bg-blue-600 text-white rounded-full font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all hover:scale-[1.02] active:scale-95">
              Proceed to Checkout
            </Link>
          </div>
          
          <div className="glass p-6 rounded-3xl">
             <p className="text-xs text-zinc-500 text-center">
               Secure checkout powered by <span className="font-bold">one to one</span>. Payments are simulated for this demo.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
