"use client";

import { useState, useTransition } from "react";
import { updateOrderStatusAction } from "@/app/actions/order";
import { OrderStatus } from "@prisma/client";
import { toast } from "sonner";

const STATUS_OPTIONS: OrderStatus[] = ["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

const statusColors: Record<string, string> = {
  PENDING:    "text-yellow-400",
  PAID:       "text-blue-400",
  PROCESSING: "text-indigo-400",
  SHIPPED:    "text-cyan-400",
  DELIVERED:  "text-green-400",
  CANCELLED:  "text-red-400",
};

export default function OrderStatusSelect({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: OrderStatus;
}) {
  const [status, setStatus] = useState(currentStatus);
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as OrderStatus;
    setStatus(newStatus);
    startTransition(async () => {
      const res = await updateOrderStatusAction(orderId, newStatus);
      if (res.success) toast.success(`Order updated to ${newStatus}`);
    });
  };

  return (
    <select
      value={status}
      onChange={handleChange}
      disabled={isPending}
      className={`glass-input text-xs font-black uppercase tracking-wider px-3 py-2 rounded-xl
                  border border-white/10 cursor-pointer transition-all disabled:opacity-50
                  ${statusColors[status]}`}
    >
      {STATUS_OPTIONS.map(s => (
        <option key={s} value={s} className="bg-[#080612] text-white font-bold">
          {s}
        </option>
      ))}
    </select>
  );
}
