import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";
import BorderGlow from "@/components/BorderGlow";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import ProductFilters from "@/components/ProductFilters";
import AddToCartButton from "@/components/AddToCartButton";
import { ProductType } from "@prisma/client";

export default async function ProductsPage(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const searchParams = await props.searchParams;
  const typeFilter = typeof searchParams.type === 'string' ? searchParams.type as ProductType : undefined;
  const searchQuery = typeof searchParams.q === 'string' ? searchParams.q : undefined;

  // جلب جميع المنتجات بناءً على الفلتر
  const products = await db.product.findMany({
    where: {
      ...(typeFilter && { type: typeFilter }),
      ...(searchQuery && { name: { contains: searchQuery, mode: 'insensitive' } }),
    },
    include: { physicalDetails: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="flex flex-col min-h-screen bg-[#05050A]">
      {/* Page Header */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-900/10 via-transparent to-transparent" />
           <div className="absolute top-[-50%] left-[20%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] opacity-40 mix-blend-screen" />
        </div>

        <div className="container mx-auto px-4 z-10 relative text-center space-y-6">
          <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 font-bold hover:text-white transition-colors text-sm uppercase tracking-widest mb-8">
            <ArrowLeft size={16} /> Back to Home
          </Link>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500">
            Full Catalog
          </h1>
          <p className="text-zinc-400 font-medium tracking-wide max-w-xl mx-auto">
            Browse our complete collection of premium physical goods and exclusive digital assets.
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="pb-32 relative">
        <div className="container mx-auto px-4 z-10 relative">
          <ProductFilters />

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
                <div className="group glass-panel h-full overflow-hidden flex flex-col">
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

          {products.length === 0 && (
            <div className="text-center py-20">
              <p className="text-zinc-500 font-bold uppercase tracking-widest">No products found in the catalog.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
