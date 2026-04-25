"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface CompareItem {
  id: string;
  name: string;
  price: number;
  imageUrl?: string | null;
  type: "PHYSICAL" | "DIGITAL";
  description: string;
}

interface CompareContextType {
  compareList: CompareItem[];
  toggleCompare: (item: CompareItem) => void;
  isCompared: (id: string) => boolean;
  clearCompare: () => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const CompareProvider = ({ children }: { children: React.ReactNode }) => {
  const [compareList, setCompareList] = useState<CompareItem[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("one-to-one-compare");
    if (saved) {
      try { setCompareList(JSON.parse(saved)); } catch { /* ignore */ }
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem("one-to-one-compare", JSON.stringify(compareList));
  }, [compareList]);

  const toggleCompare = (item: CompareItem) => {
    setCompareList(prev => {
      if (prev.find(i => i.id === item.id)) return prev.filter(i => i.id !== item.id);
      if (prev.length >= 2) return [prev[1], item]; // max 2 items
      return [...prev, item];
    });
  };

  const isCompared = (id: string) => compareList.some(i => i.id === id);

  const clearCompare = () => {
    setCompareList([]);
    localStorage.removeItem("one-to-one-compare");
  };

  return (
    <CompareContext.Provider value={{ compareList, toggleCompare, isCompared, clearCompare }}>
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used within CompareProvider");
  return ctx;
};
