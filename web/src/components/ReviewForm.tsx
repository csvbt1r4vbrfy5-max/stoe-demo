"use client";

import { useState, useTransition } from "react";
import { addReviewAction } from "@/app/actions/review";
import { Star, Send } from "lucide-react";
import { toast } from "sonner";

export default function ReviewForm({ productId }: { productId: string }) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (rating === 0) { toast.error("Please select a rating"); return; }
    const fd = new FormData(e.currentTarget);
    fd.set("rating", String(rating));
    const form = e.currentTarget;
    startTransition(async () => {
      const res = await addReviewAction(productId, fd);
      if (res.success) {
        toast.success("Review submitted!");
        form.reset();
        setRating(0);
      } else {
        toast.error(res.message);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Star picker */}
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-3">Your Rating</p>
        <div className="flex gap-2">
          {[1,2,3,4,5].map((s) => (
            <button
              key={s} type="button"
              onMouseEnter={() => setHovered(s)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => setRating(s)}
            >
              <Star
                size={28}
                className="transition-all duration-150"
                fill={(hovered || rating) >= s ? "#f59e0b" : "transparent"}
                stroke={(hovered || rating) >= s ? "#f59e0b" : "#52525b"}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Name */}
      <div>
        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-2">Your Name</label>
        <input
          name="author" required
          className="glass-input w-full px-4 py-3 rounded-2xl text-sm font-medium"
          placeholder="John Doe"
        />
      </div>

      {/* Comment */}
      <div>
        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-2">Review</label>
        <textarea
          name="comment" required rows={3}
          className="glass-input w-full px-4 py-3 rounded-2xl text-sm font-medium resize-none"
          placeholder="Share your experience..."
        />
      </div>

      <button
        type="submit" disabled={isPending}
        className="flex items-center gap-2 px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-sm
                   bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500
                   shadow-[0_0_20px_rgba(109,40,217,0.3)] hover:shadow-[0_0_30px_rgba(109,40,217,0.5)]
                   transition-all disabled:opacity-50 text-white"
      >
        <Send size={15} />
        {isPending ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}
