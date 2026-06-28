'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '@/components/ui/ProductCard';
import { CATALOG, CATEGORIES, CATEGORY_EMOJIS, QUICK_SEARCHES } from '@/constants';
import { cn } from '@/utils';
import type { ProductCategory } from '@/types';

export default function HomePage() {
  const router = useRouter();
  const [q, setQ] = useState('');
  const [activeCategory, setActiveCategory] = useState<'همه' | ProductCategory>('همه');

  const filtered = activeCategory === 'همه'
    ? CATALOG
    : CATALOG.filter((p) => p.cat === activeCategory);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    router.push(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <div className="relative min-h-screen">
      {/* Orbs */}
      <div className="fixed w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: 'rgba(99,102,241,0.12)', filter: 'blur(90px)', top: -150, right: -120, animation: 'orbFloat 8s ease-in-out infinite' }} />
      <div className="fixed w-[350px] h-[350px] rounded-full pointer-events-none" style={{ background: 'rgba(139,92,246,0.08)', filter: 'blur(90px)', bottom: 60, left: -80, animation: 'orbFloat 8s ease-in-out infinite', animationDelay: '-3s' }} />

      {/* Ticker */}
      <div className="overflow-hidden border-b" style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.09)', padding: '7px 0' }}>
        <div className="ticker-inner">
          {[...CATALOG.slice(0, 14), ...CATALOG.slice(0, 14)].map((p, i) => (
            <div key={i} className="flex items-center gap-2 px-6 text-[11.5px] text-white/60 whitespace-nowrap border-l border-white/9">
              <span>{p.emoji}</span>
              <span className="text-white/90 font-medium">{p.brand} {p.name.split(' ').slice(-2).join(' ')}</span>
              <span className="text-[10px]">{p.stores} فروشگاه</span>
              {p.hot && <span className="text-amber-400">🔥</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 pb-8 relative z-10">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center py-10 max-w-xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11.5px] font-medium mb-5"
            style={{ background: 'rgba(99,102,241,0.13)', border: '1px solid rgba(99,102,241,0.38)', color: '#6366f1' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            قیمت لحظه‌ای از ۵۰۰+ فروشگاه
          </div>

          <h1 className="text-[clamp(24px,4.5vw,42px)] font-black leading-[1.18] tracking-tight mb-3">
            بهترین قیمت را{' '}
            <span style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6,#06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              هوشمند
            </span>{' '}
            پیدا کن
          </h1>

          <p className="text-[14px] text-white/60 leading-relaxed mb-7">
            مقایسه Real-time قیمت از همه فروشگاه‌های معتبر ایران
          </p>

          {/* Search */}
          <form onSubmit={handleSearch}
            className="flex gap-2 max-w-[510px] mx-auto rounded-[20px] p-1.5"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.09)', backdropFilter: 'blur(24px)' }}
          >
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="G733، آیفون ۱۵، PS5، MX Master، SSD..."
              className="flex-1 bg-transparent border-none outline-none text-white/95 text-[14px] placeholder-white/35 font-vazir px-2 min-w-0"
              dir="rtl"
            />
            <button type="submit"
              className="text-[13px] font-bold text-white px-6 py-2.5 rounded-2xl shrink-0"
              style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
              جستجو کن
            </button>
          </form>

          {/* Quick search tags */}
          <div className="flex flex-wrap gap-2 justify-center mt-4">
            {QUICK_SEARCHES.map((s) => (
              <button key={s.label}
                onClick={() => router.push(`/search?q=${encodeURIComponent(s.query)}`)}
                className="text-[12px] text-white/55 px-3 py-1 rounded-full transition-all hover:text-white/90"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)' }}>
                {s.emoji} {s.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <div className="flex border-y mb-6" style={{ borderColor: 'rgba(255,255,255,0.09)' }}>
          {[['۵۰۰+', 'فروشگاه'], ['۲M+', 'محصول'], ['Real‑time', 'بروزرسانی'], ['رایگان', 'همیشه']].map(([n, l]) => (
            <div key={l} className="flex-1 text-center py-3.5 border-l last:border-l-0" style={{ borderColor: 'rgba(255,255,255,0.09)' }}>
              <div className="text-[20px] font-black" style={{ color: '#6366f1' }}>{n}</div>
              <div className="text-[10px] text-white/35 mt-0.5">{l}</div>
            </div>
          ))}
        </div>

        {/* Category filter + live indicator */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="flex gap-1.5 flex-wrap">
            <button
              onClick={() => setActiveCategory('همه')}
              className={cn('chip', activeCategory === 'همه' && 'chip-active')}
            >همه</button>
            {CATEGORIES.map((cat) => (
              <button key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn('chip', activeCategory === cat && 'chip-active')}
              >
                {CATEGORY_EMOJIS[cat]} {cat}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold"
              style={{ background: 'rgba(16,185,129,0.11)', border: '1px solid rgba(16,185,129,0.28)', color: '#10b981' }}>
              <span className="live-dot" />Live
            </div>
            <span className="text-[10px] text-white/35">
              {new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>

        {/* Product grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="grid gap-3"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(158px, 1fr))' }}
          >
            {filtered.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
