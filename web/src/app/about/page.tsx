import Link from "next/link";
import { ArrowLeft, ShieldCheck, Diamond, Globe } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-[90vh] bg-[#05050A]">
      <section className="relative pt-32 pb-16 overflow-hidden flex-1">
        <div className="absolute inset-0 z-0 overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-900/10 via-transparent to-transparent" />
           <div className="absolute top-[-20%] left-[20%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] opacity-40 mix-blend-screen" />
           <div className="absolute bottom-[-10%] right-[10%] w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[100px] opacity-30 mix-blend-screen" />
        </div>

        <div className="container mx-auto px-4 z-10 relative">
          <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 font-bold hover:text-white transition-colors text-sm uppercase tracking-widest mb-12">
            <ArrowLeft size={16} /> Back to Home
          </Link>
          
          <div className="max-w-4xl mx-auto text-center space-y-8 mb-20">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500">
              Our Legacy
            </h1>
            <p className="text-xl text-zinc-400 font-medium tracking-wide leading-relaxed">
              مرحباً بكم في <strong className="text-white">قلعة العراقة والتميز</strong>. نحن وجهتكم الأولى للحصول على الأصول الفاخرة، سواء كانت منتجات ملموسة نادرة أو أصولاً رقمية حصرية. تأسسنا عام 1949 لنرسي معايير الفخامة.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="glass-panel p-8 rounded-3xl border border-white/5 relative group hover:-translate-y-2 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/20 text-blue-400">
                <Diamond size={28} />
              </div>
              <h3 className="text-xl font-black text-white mb-4 uppercase tracking-widest">Premium Quality</h3>
              <p className="text-zinc-400 leading-relaxed text-sm">
                نحن نلتزم بتقديم أعلى درجات الجودة في كل منتج يمر عبر بواباتنا. التميز ليس مجرد كلمة، بل هو عهد.
              </p>
            </div>

            <div className="glass-panel p-8 rounded-3xl border border-white/5 relative group hover:-translate-y-2 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 border border-purple-500/20 text-purple-400">
                <ShieldCheck size={28} />
              </div>
              <h3 className="text-xl font-black text-white mb-4 uppercase tracking-widest">Trust & Security</h3>
              <p className="text-zinc-400 leading-relaxed text-sm">
                كل تعاملاتكم محمية وموثوقة. نحن نبني علاقات تدوم أجيالاً مبنية على الثقة المطلقة والشفافية.
              </p>
            </div>

            <div className="glass-panel p-8 rounded-3xl border border-white/5 relative group hover:-translate-y-2 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-600/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="w-14 h-14 bg-orange-500/10 rounded-2xl flex items-center justify-center mb-6 border border-orange-500/20 text-orange-400">
                <Globe size={28} />
              </div>
              <h3 className="text-xl font-black text-white mb-4 uppercase tracking-widest">Global Reach</h3>
              <p className="text-zinc-400 leading-relaxed text-sm">
                رغم جذورنا العريقة، إلا أننا نوصل خدماتنا ومنتجاتنا الفاخرة لعملائنا في كافة أنحاء العالم.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
