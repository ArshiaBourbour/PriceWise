'use client';
import { useEffect, useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { RefreshCw, SlidersHorizontal, X } from 'lucide-react';
import ProductCard from '@/components/ui/ProductCard';
import { LoadingSpinner, EmptyState } from '@/components/ui/States';
import { CATALOG, CATEGORIES, CATEGORY_EMOJIS } from '@/constants';
import { searchProductsAI, normalizeQuery } from '@/services/priceService';
import { useSearchStore } from '@/store';
import { cn } from '@/utils';
import type { ProductCatalogItem, ProductCategory } from '@/types';

type SortMode = 'relevant' | 'az' | 'za' | 'hot';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const rawQ = searchParams.get('q') ?? '';
  const { addQuery } = useSearchStore();

  const [results, setResults] = useState<ProductCatalogItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sort, setSort] = useState<SortMode>('relevant');
  const [filterOpen, setFilterOpen] = useState(false);
  const [catFilter, setCatFilter] = useState<ProductCategory | 'همه'>('همه');
  const [onlyHot, setOnlyHot] = useState(false);
  const [refreshAt, setRefreshAt] = useState(Date.now());
  const [countdown, setCountdown] = useState(300);

  // Countdown timer
  useEffect(() => {
    const id = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) { setRefreshAt(Date.now()); return 300; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // Fetch results
  useEffect(() => {
    if (!rawQ) return;
    const q = normalizeQuery(rawQ);
    addQuery(q);

    // Check local catalog first
    const local = CATALOG.filter(
      (p) =>
        p.name.toLowerCase().includes(q.toLowerCase()) ||
        p.brand.toLowerCase().includes(q.toLowerCase()) ||
        p.id.toLowerCase().includes(q.toLowerCase()) ||
        p.cat.includes(q)
    );

    if (local.length >= 2) {
      setResults(local);
      setError(null);
      return;
    }

    // Fall back to AI search
    setLoading(true);
    setError(null);
    searchProductsAI(q)
      .then((r) => setResults(r))
      .catch((e) => setError(e instanceof Error ? e.message : 'خطای جستجو'))
      .finally(() => setLoading(false));
  }, [rawQ, refreshAt]);

  // Apply filters + sort
  const filtered = useMemo(() => {
    let r = [...results];
    if (catFilter !== 'همه') r = r.filter((p) => p.cat === catFilter);
    if (onlyHot) r = r.filter((p) => p.hot);
    if (sort === 'hot') r = [...r].sort((a, b) => (b.hot ? 1 : 0) - (a.hot ? 1 : 0));
    if (sort === 'az') r = [...r].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === 'za') r = [...r].sort((a, b) => b.name.localeCompare(a.name));
    return r;
  }, [results, catFilter, onlyHot, sort]);

  const mins = Math.floor(countdown / 60);
  const secs = countdown % 60;

  if (loading) return <LoadingSpinner message="در حال جستجو در فروشگاه‌های ایران..." sub="دیجی‌کالا · تکنولایف · باسلام · ترب..." />;

  return (
    <div className="px-5 py-6">
      {/* Header */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-[18px] font-bold">«{rawQ}»</h1>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold"
            style={{ background: 'rgba(16,185,129,0.11)', border: '1px solid rgba(16,185,129,0.28)', color: '#10b981' }}>
            <span className="live-dot" />Live
          </div>
        </div>
        <p className="text-[12px] text-white/35">
          {filtered.length} محصول · بروزرسانی: {new Date().toLocaleTimeString('fa-IR')}
        </p>
      </div>

      {/* Refresh bar */}
      <div className="flex items-center gap-3 px-3 py-2 rounded-xl mb-4 text-[12px]"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)' }}>
        <span className="text-white/60">🔄 بروزرسانی خودکار</span>
        <div className="flex-1 h-[3px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{ width: `${(countdown / 300) * 100}%`, background: 'linear-gradient(90deg,#6366f1,#8b5cf6)' }}
          />
        </div>
        <span className="text-white/35 text-[11px] tabular-nums min-w-[35px]">
          {mins}:{String(secs).padStart(2, '0')}
        </span>
        <button
          onClick={() => setRefreshAt(Date.now())}
          className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg transition-all"
          style={{ background: 'rgba(99,102,241,0.13)', border: '1px solid rgba(99,102,241,0.38)', color: '#6366f1' }}
        >
          <RefreshCw size={10} />الان
        </button>
      </div>

      {/* Sort + Filter row */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <div className="flex gap-1.5 flex-wrap flex-1">
          {([['relevant','مرتبط‌ترین'],['hot','پرطرفدار'],['az','الف-ی'],['za','ی-الف']] as [SortMode, string][]).map(([v, l]) => (
            <button key={v} onClick={() => setSort(v)}
              className={cn('text-[11px] px-3 py-1 rounded-full transition-all',
                sort === v ? 'chip-active' : 'chip')}>
              {l}
            </button>
          ))}
        </div>
        <button
          onClick={() => setFilterOpen((o) => !o)}
          className={cn('flex items-center gap-1.5 text-[12px] px-3 py-1.5 rounded-lg transition-all',
            filterOpen ? 'text-indigo-400 border-indigo-500/40 bg-indigo-500/10' : 'btn-ghost')}
        >
          <SlidersHorizontal size={13} />فیلتر
        </button>
      </div>

      {/* Filter panel */}
      {filterOpen && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[12.5px] font-semibold">فیلتر پیشرفته</span>
            <button onClick={() => setFilterOpen(false)} className="text-white/40 hover:text-white transition-colors"><X size={15} /></button>
          </div>
          <p className="text-[11px] text-white/40 mb-2">دسته‌بندی</p>
          <div className="flex flex-wrap gap-1.5 mb-3">
            <button onClick={() => setCatFilter('همه')} className={cn('chip', catFilter === 'همه' && 'chip-active')}>همه</button>
            {CATEGORIES.map((c) => (
              <button key={c} onClick={() => setCatFilter(c)} className={cn('chip', catFilter === c && 'chip-active')}>
                {CATEGORY_EMOJIS[c]} {c}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2 text-[12px] text-white/60 cursor-pointer">
            <input type="checkbox" checked={onlyHot} onChange={(e) => setOnlyHot(e.target.checked)}
              className="accent-indigo-500 w-4 h-4 cursor-pointer" />
            فقط محصولات پرطرفدار
          </label>
        </motion.div>
      )}

      {error && (
        <div className="rounded-2xl p-4 mb-4" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)' }}>
          <p className="text-[13px] text-red-400 font-semibold mb-1">⚠️ خطای جستجو</p>
          <p className="text-[12px] text-white/55">{error}</p>
        </div>
      )}

      {!filtered.length && !loading && !error && (
        <EmptyState icon="🔍" title="محصولی یافت نشد" body="جستجو را تغییر بده یا دسته‌بندی دیگری امتحان کن" />
      )}

      <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(158px, 1fr))' }}>
        {filtered.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>
    </div>
  );
}
