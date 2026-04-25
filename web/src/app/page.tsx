import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";
import BorderGlow from "@/components/BorderGlow";
import { ArrowRight } from "lucide-react";
import ProductFilters from "@/components/ProductFilters";
import AddToCartButton from "@/components/AddToCartButton";
import WishlistButton from "@/components/WishlistButton";
import CompareButton from "@/components/CompareButton";
import { ProductType } from "@prisma/client";

export default async function Home(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const searchParams = await props.searchParams;
  const typeFilter = typeof searchParams.type === 'string' ? searchParams.type as ProductType : undefined;
  const searchQuery = typeof searchParams.q === 'string' ? searchParams.q : undefined;

  const products = await db.product.findMany({
    where: {
      isActive: true,
      ...(typeFilter && { type: typeFilter }),
      ...(searchQuery && { name: { contains: searchQuery, mode: 'insensitive' } }),
    },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      type: true,
      imageUrl: true,
      physicalDetails: { select: { stockQuantity: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 8,
  });

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden pt-24 pb-12">
        {/* Subtle extra glow layers on top of body bg */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[30%] w-[700px] h-[700px] bg-violet-700/15 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-[-5%]   w-[500px] h-[500px] bg-blue-700/15  rounded-full blur-[100px]" />
        </div>

        <div className="container mx-auto px-4 z-10">
          {/* Top badge */}
          <div className="flex justify-center mb-10">
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-black uppercase tracking-[0.25em] backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
              Next-Gen Gaming Store
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-center text-6xl md:text-8xl font-black tracking-tighter leading-[0.88] mb-6">
            <span className="block text-white">YOUR ULTIMATE</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-violet-400 to-purple-500
                            drop-shadow-[0_0_40px_rgba(139,92,246,0.6)]">
              GAMING STORE
            </span>
          </h1>

          <p className="text-center text-lg text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Premium physical gear & exclusive digital assets — all in one place.
            Elevate your setup, dominate your game.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-14">
            <Link
              href="#products"
              className="group flex items-center gap-3 px-8 py-4 rounded-full font-black uppercase tracking-widest text-sm
                         bg-gradient-to-r from-blue-600 to-violet-600
                         hover:from-blue-500 hover:to-violet-500
                         shadow-[0_0_30px_rgba(109,40,217,0.4)] hover:shadow-[0_0_50px_rgba(109,40,217,0.6)]
                         transition-all duration-300 hover:scale-105 text-white"
            >
              Shop Now
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/products"
              className="px-8 py-4 glass-button rounded-full font-bold uppercase tracking-widest text-sm text-zinc-300 hover:text-white transition-all"
            >
              View Catalog
            </Link>
          </div>

          {/* Hero image */}
          <div className="relative max-w-4xl mx-auto">
            {/* Glow behind image */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-violet-600/20 rounded-[32px] blur-3xl scale-105" />

            <div className="relative rounded-[32px] overflow-hidden border border-white/10
                            shadow-[0_30px_80px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.05)]">
              <Image
                src="/hero.png"
                alt="Premium Gaming Store"
                width={1200}
                height={600}
                unoptimized
                priority
                className="w-full h-auto object-cover"
              />
              {/* Overlay gradient at bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#080612]/60 via-transparent to-transparent" />
            </div>

            {/* Floating stat chips */}
            <div className="absolute -top-4 -left-4 md:-left-8 px-4 py-2.5 rounded-2xl
                            bg-[#0d0b1e]/80 border border-white/10 backdrop-blur-xl
                            shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-0.5">Products</p>
              <p className="text-2xl font-black text-white">14+</p>
            </div>

            <div className="absolute -top-4 -right-4 md:-right-8 px-4 py-2.5 rounded-2xl
                            bg-[#0d0b1e]/80 border border-white/10 backdrop-blur-xl
                            shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-0.5">Categories</p>
              <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">2</p>
            </div>

            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-6 py-2.5 rounded-2xl
                            bg-[#0d0b1e]/80 border border-violet-500/20 backdrop-blur-xl
                            shadow-[0_8px_32px_rgba(0,0,0,0.4)] flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <p className="text-xs font-black uppercase tracking-widest text-zinc-300">Instant Digital Delivery</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories & Products Section */}
      <section id="products" className="py-32 relative">
        <div className="container mx-auto px-4 z-10 relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="space-y-2">
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase">Our Collection</h2>
              <p className="text-zinc-400 font-medium tracking-wide">Select from our elite tier of products.</p>
            </div>
            <ProductFilters />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <BorderGlow 
                key={product.id}
                borderRadius={32}
                backgroundColor="transparent"
                animated={true}
                className="hover:-translate-y-2 transition-all duration-500"
                glowColor={product.type === 'PHYSICAL' ? '40 80 80' : '280 80 80'}
              >
                {/* Card — relative so buttons can float over it */}
                <div className="group glass-panel h-full overflow-hidden flex flex-col relative">

                  {/* Wishlist + Compare — stacked top-left */}
                  <div className="absolute top-4 left-4 z-30 flex flex-col gap-2">
                    <WishlistButton product={{
                      id: product.id, name: product.name,
                      price: Number(product.price), imageUrl: product.imageUrl,
                      type: product.type
                    }} />
                    <CompareButton product={{
                      id: product.id, name: product.name,
                      price: Number(product.price), imageUrl: product.imageUrl,
                      type: product.type, description: product.description
                    }} />
                  </div>

                  <Link href={`/products/${product.id}`} className="block">
                    <div className="relative aspect-square w-full overflow-hidden bg-black/50 p-6">
                       <div className="absolute top-4 right-4 z-10">
                          <span className={`px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-widest shadow-lg ${
                            product.type === 'PHYSICAL' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                          }`}>
                            {product.type}
                          </span>
                       </div>
                       <div className="w-full h-full relative rounded-2xl overflow-hidden border border-white/5">
                         {product.imageUrl ? (
                           <Image 
                              src={product.imageUrl} 
                              alt={product.name} 
                              fill 
                              unoptimized
                              className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                           />
                         ) : (
                           <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:opacity-60 group-hover:scale-110 transition-all duration-500 bg-gradient-to-tr from-blue-900 to-purple-900" />
                         )}
                       </div>
                    </div>
                    <div className="px-8 pt-6 pb-2">
                      <h3 className="font-black text-xl leading-tight line-clamp-1 mb-2 text-white group-hover:text-blue-300 transition-colors">{product.name}</h3>
                      <p className="text-sm text-zinc-400 line-clamp-2 leading-relaxed">{product.description}</p>
                    </div>
                  </Link>
                  <div className="px-8 pb-8 pt-4 flex items-center justify-between border-t border-white/10 mt-auto">
                    <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-200">
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(product.price))}
                    </span>
                    <AddToCartButton product={{
                      id: product.id,
                      name: product.name,
                      price: Number(product.price),
                      imageUrl: product.imageUrl
                    }} />
                  </div>
                </div>
              </BorderGlow>
            ))}
          </div>
          
          <div className="mt-20 text-center">
             <Link href="/products" className="inline-flex items-center gap-2 text-blue-400 font-black hover:text-blue-300 uppercase tracking-[0.2em] transition-colors group">
               View Full Catalog 
               <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
             </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

