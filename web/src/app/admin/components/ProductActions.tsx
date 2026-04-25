"use client";

import { useState } from "react";
import { deleteProductAction } from "@/app/actions/product";
import { toast } from "sonner";
import AddProductForm from "@/components/AddProductForm";
import { createPortal } from "react-dom";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number | string;
  type: "PHYSICAL" | "DIGITAL";
  imageUrl: string | null;
}

interface ProductActionsProps {
  product: Product;
}

export default function ProductActions({ product }: ProductActionsProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteProductAction(product.id);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to delete product.");
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  const confirmModal = showConfirm ? (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 animate-in fade-in duration-300">
      <div className="glass-panel w-full max-w-md rounded-3xl shadow-2xl p-8 relative overflow-hidden text-center">
        <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-red-600/20 rounded-full blur-[60px] pointer-events-none" />
        
        <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center border border-red-500/30 mx-auto mb-6">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-400"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/></svg>
        </div>
        
        <h3 className="text-xl font-black text-white uppercase tracking-widest mb-2">Delete Asset?</h3>
        <p className="text-sm font-medium text-zinc-400 mb-8">This action cannot be undone. Are you sure you want to delete <strong className="text-white">{product.name}</strong>?</p>
        
        <div className="flex gap-4">
          <button 
            onClick={() => setShowConfirm(false)}
            disabled={isDeleting}
            className="flex-1 py-3 glass-button text-zinc-300 rounded-xl font-bold uppercase tracking-widest text-xs"
          >
            Cancel
          </button>
          <button 
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1 py-3 bg-red-600/80 hover:bg-red-600 text-white rounded-xl font-black uppercase tracking-widest text-xs shadow-[0_0_20px_rgba(220,38,38,0.3)] transition-all"
          >
            {isDeleting ? "Deleting..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={() => setIsEditOpen(true)}
          className="p-3 bg-white/5 hover:bg-blue-600 hover:text-white rounded-xl transition-all border border-white/10 hover:border-blue-500 shadow-lg"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
        </button>
        <button 
          onClick={() => setShowConfirm(true)}
          className="p-3 bg-white/5 hover:bg-red-600 hover:text-white text-red-400 rounded-xl transition-all border border-white/10 hover:border-red-500 shadow-lg"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
        </button>
      </div>

      <AddProductForm 
        hideTrigger 
        isOpen={isEditOpen} 
        onClose={() => setIsEditOpen(false)} 
        product={product} 
      />

      {typeof document !== 'undefined' && createPortal(confirmModal, document.body)}
    </>
  );
}
