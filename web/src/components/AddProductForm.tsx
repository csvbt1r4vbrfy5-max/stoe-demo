"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Plus, X, Package, DollarSign, FileText, ImageIcon, Type, Sparkles } from "lucide-react";
import { createProductAction, updateProductAction } from "@/app/actions/product";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number | string;
  type: "PHYSICAL" | "DIGITAL";
  imageUrl: string | null;
}

interface AddProductFormProps {
  onSuccess?: () => void;
  product?: Product;
  isOpen?: boolean;
  onClose?: () => void;
  hideTrigger?: boolean;
}

export default function AddProductForm({ onSuccess, product, isOpen: externalIsOpen, onClose, hideTrigger }: AddProductFormProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isModalOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [mounted, setMounted] = useState(false);
  
  const [imagePreview, setImagePreview] = useState<string | null>(product?.imageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClose = () => {
    if (onClose) onClose();
    else setInternalIsOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const imageFile = fileInputRef.current?.files?.[0];
    if (imageFile) {
      formData.set("image", imageFile);
    }
    
    try {
      let result;
      if (product) {
        result = await updateProductAction(product.id, formData);
      } else {
        result = await createProductAction(formData);
      }
      
      if (result.success) {
        toast.success(result.message);
        setTimeout(() => {
          handleClose();
          setMessage("");
          if (!product) setImagePreview(null);
          e.currentTarget?.reset(); // Reset form
          if (onSuccess) onSuccess();
        }, 500);
      } else {
        toast.error(result.message || "Operation failed.");
        setMessage(result.message || "Operation failed.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
      setMessage("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const modalContent = isModalOpen ? (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 animate-in fade-in duration-300">
      <div className="glass-panel w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 relative">
        
        {/* Glow effects */}
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-600/20 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-600/20 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 p-8 border-b border-white/10 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center border border-blue-500/30">
               <Sparkles className="text-blue-400" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase tracking-widest text-white">{product ? "Edit Product" : "New Product"}</h2>
              <p className="text-zinc-400 text-xs font-bold tracking-widest uppercase mt-1">{product ? "Modify asset details" : "Add asset to catalog"}</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={handleClose}
            className="p-3 hover:bg-white/10 rounded-full transition-colors text-zinc-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="relative z-10 p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {message && (
            <div className="p-4 bg-blue-500/20 text-blue-300 rounded-2xl font-bold tracking-wide border border-blue-500/30 animate-in slide-in-from-top-4 backdrop-blur-md text-center text-sm uppercase">
              {message}
            </div>
          )}

          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2 ml-1">
                <Type size={12} className="text-blue-400" /> Product Name
              </label>
              <input name="name" defaultValue={product?.name} type="text" placeholder="e.g. Premium Wireless Headphones" className="glass-input w-full p-4 rounded-2xl font-medium tracking-wide" required />
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2 ml-1">
                  <DollarSign size={12} className="text-blue-400" /> Price (USD)
                </label>
                <input name="price" defaultValue={product?.price as string} type="number" step="0.01" placeholder="99.00" className="glass-input w-full p-4 rounded-2xl font-medium tracking-wide" required />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2 ml-1">
                  <Package size={12} className="text-blue-400" /> Asset Type
                </label>
                <select name="type" defaultValue={product?.type || "PHYSICAL"} className="glass-input w-full p-4 rounded-2xl font-bold uppercase tracking-widest appearance-none text-xs" required>
                  <option value="PHYSICAL" className="bg-zinc-900">Physical Goods</option>
                  <option value="DIGITAL" className="bg-zinc-900">Digital Asset</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2 ml-1">
                <FileText size={12} className="text-blue-400" /> Description
              </label>
              <textarea name="description" defaultValue={product?.description} rows={3} placeholder="Detail the premium features..." className="glass-input w-full p-4 rounded-2xl font-medium tracking-wide resize-none" required></textarea>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2 ml-1">
                <ImageIcon size={12} className="text-blue-400" /> Cover Asset
              </label>
              <input 
                name="image"
                type="file" 
                accept="image/png, image/jpeg" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleImageChange}
              />
              <div 
                onClick={handleImageClick}
                className="p-8 border border-dashed border-white/20 rounded-3xl text-center space-y-3 hover:border-blue-500/50 transition-all cursor-pointer bg-white/5 group relative overflow-hidden"
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                ) : (
                  <>
                    <div className="mx-auto w-12 h-12 bg-white/10 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-500/20 transition-all duration-300">
                      <Plus size={20} className="text-zinc-300 group-hover:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-bold text-white tracking-wide">Select Image</p>
                      <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mt-1">PNG, JPG (MAX 10MB)</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="pt-6 flex gap-4 border-t border-white/5 mt-6">
            <button 
              type="button"
              onClick={handleClose}
              className="flex-1 py-4 glass-button text-zinc-300 rounded-2xl font-bold uppercase tracking-widest text-xs"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting} 
              className="flex-[2] py-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {isSubmitting ? "Processing..." : product ? "Save Changes" : "Deploy Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  ) : null;

  return (
    <>
      {!hideTrigger && (
        <button 
          onClick={() => setInternalIsOpen(true)}
          className="px-6 py-3 bg-white text-black rounded-full font-black uppercase tracking-widest shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2 relative z-50 cursor-pointer"
        >
          <Plus size={18} strokeWidth={3} />
          New Product
        </button>
      )}

      {mounted && typeof document !== 'undefined' && createPortal(
        modalContent,
        document.body
      )}
    </>
  );
}
