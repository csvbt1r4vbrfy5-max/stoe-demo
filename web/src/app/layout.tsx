import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { CompareProvider } from "./context/CompareContext";
import Header from "@/components/Header";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import CartDrawer from "@/components/CartDrawer";

const outfit = Outfit({ 
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ['300', '400', '500', '600', '700', '800', '900']
});

export const metadata: Metadata = {
  title: "one to one | Premium Store",
  description: "Your destination for high-quality physical and digital products.",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("dark", outfit.variable)}>
      <body className="font-sans antialiased min-h-screen flex flex-col selection:bg-blue-600/30 selection:text-blue-200">
        <WishlistProvider>
          <CompareProvider>
            <CartProvider>
              <Header />
              <main className="flex-grow">
                {children}
              </main>

              {/* Footer */}
              <footer className="py-8 mt-auto border-t border-white/5 bg-black/40 backdrop-blur-xl">
                <div className="container mx-auto px-4 text-center text-zinc-500">
                  <p className="text-sm font-medium tracking-wider">© 2026 ONE TO ONE. ALL RIGHTS RESERVED.</p>
                </div>
              </footer>

              <CartDrawer />
            </CartProvider>
          </CompareProvider>
        </WishlistProvider>

        <Toaster
          position="bottom-right"
          toastOptions={{
            className: "glass-panel text-white border-white/10 shadow-[0_0_20px_rgba(37,99,235,0.2)] font-bold tracking-wide",
          }}
        />
      </body>
    </html>
  );
}
