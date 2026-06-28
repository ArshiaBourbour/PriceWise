'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { useCompareStore } from '@/store';
import { fetchLivePrices } from '@/services/priceService';
import { STORES } from '@/constants';
import { formatPrice, cn } from '@/utils';
import { EmptyState, LoadingSpinner } from '@/components/ui/States';

export default function ComparePage() {
  const router = useRouter();
  const { items, remove, setDetail, setLoading, setError, clear } = useCompareStore();

  // Fetch live prices for items that don't have detail yet
  useEffect(() => {
    items.forEach((item) => {
      if (!item.detail && !item.loading && !item.error) {
        setLoading(item.catalogItem.id, true);
        fetchLivePrices(item.catalogItem)
          .then((d) => setDetail(item.catalogItem.id, d))
          .catch((e) => setError(item.catalogItem.id, e instanceof Error ? e.message : 'خطا'));
      }
    });
  }, [items.length]);

  const rows = [
    {
      label: '💰 کمترین قیمت',
      fn: (d: any) => d?.minPrice ? formatPrice(d.minPrice) + ' ت' : '—',
      rank: (d: any) => d?.minPrice ?? null,
      rankDir: 'asc' as const,
    },
    {
      label: '📊 میانگین قیمت',
      fn: (d: any) => d?.avgPrice ? formatPrice(d.avgPrice) + ' ت' : '—',
      rank: null,
    },
    {
      label: '🤖 امتیاز خرید',
      fn: (d: any) => d?.aiAnalysis?.buyingScore != null ? `${d.aiAnalysis.buyingScore}/100` : '—',
      rank: (d: any) => d?.aiAnalysis?.buyingScore ?? null,
      rankDir: 'desc' as const,
    },
    {
      label: '📉 توصیه AI',
      fn: (d: any) => {
        const r = d?.aiAnalysis?.recommendation;
        if (!r) return '—';
        return r === 'buy_now'
          ? '<span style="color:#10b981">✅ الان بخر</span>'
          : r === 'wait'
          ? '<span style="color:#f59e0b">⏳ صبر کن</span>'
          : '<span style="color:#ef4444">⛔ اجتناب</span>';
      },
      raw: true,
      rank: null,
    },
    {
      label: '🏪 فروشگاه‌ها',
      fn: (d: any) => {
        const n = d?.storePrices?.filter((s: any) => s.price > 0).length;
        return n != null ? `${n} فروشگاه` : '—';
      },
      rank: null,
    },
    {
      label: '✅ موجودی',
      fn: (d: any) => {
        const n = d?.storePrices?.filter((s: any) => s.inStock && s.price > 0).length ?? 0;
        return n > 0
          ? `<span style="color:#10b981">${n} فروشگاه</span>`
          : '<span style="color:#ef4444">ناموجود</span>';
      },
      raw: true,
      rank: null,
    },
    {
      label: '⭐ بهترین فروشگاه',
      fn: (d: any) => {
        const best = d?.storePrices
          ?.filter((s: any) => s.price > 0)
          ?.sort((a: any, b: any) => a.price - b.price)?.[0];
        if (!best) return '—';
        const st = STORES[best.storeId as keyof typeof STORES];
        return st?.name ?? best.storeId ?? '—';
      },
      rank: null,
    },
  ];

  const allMins = items
    .map((i) => i.detail?.minPrice)
    .filter((v): v is number => v != null);
  const globalMin = allMins.length ? Math.min(...allMins) : null;
  const globalMax = allMins.length ? Math.max(...allMins) : null;

  const allScores = items
    .map((i) => i.detail?.aiAnalysis?.buyingScore)
    .filter((v): v is number => v != null);
  const bestScore = allScores.length ? Math.max(...allScores) : null;

  return (
    <div className="px-5 py-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-[18px] font-bold">⚖️ مقایسه محصولات</h1>
          <p className="text-[12px] text-white/35 mt-0.5">
            {items.length} محصول انتخاب شده (حداکثر ۴)
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={clear}
            className="text-[12px] px-3 py-1.5 rounded-xl transition-all"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.28)', color: '#ef4444' }}
          >
            پاک کردن
          </button>
          <button
            onClick={() => router.push('/')}
            className="text-[12px] px-3 py-1.5 rounded-xl"
            style={{ background: 'rgba(99,102,241,0.13)', border: '1px solid rgba(99,102,241,0.38)', color: '#6366f1' }}
          >
            + افزودن
          </button>
        </div>
      </div>

      {!items.length ? (
        <EmptyState
          icon="⚖️"
          title="هنوز محصولی انتخاب نشده"
          body="روی دکمه «⚖️ مقایسه» در کارت‌های محصول کلیک کن"
          action={
            <button
              onClick={() => router.push('/')}
              className="px-6 py-2.5 rounded-xl text-[13px] font-semibold text-white"
              style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}
            >
              مشاهده محصولات
            </button>
          }
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse" style={{ minWidth: `${200 + items.length * 160}px` }}>
            <thead>
              <tr>
                <th className="text-right pb-3 text-[11px] text-white/35 font-medium pr-0 w-[180px]">
                  ویژگی
                </th>
                {items.map((item) => (
                  <th key={item.catalogItem.id} className="pb-3 text-center min-w-[160px]">
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col items-center gap-1"
                    >
                      <div className="text-3xl">{item.catalogItem.emoji}</div>
                      <div className="text-[11px] font-semibold text-white/90 leading-tight max-w-[140px]">
                        {item.catalogItem.name.slice(0, 30)}
                      </div>
                      <div className="text-[10px] text-white/35">{item.catalogItem.brand}</div>
                      <button
                        onClick={() => { remove(item.catalogItem.id); toast.info('از مقایسه حذف شد'); }}
                        className="flex items-center gap-1 text-[10px] text-white/35 hover:text-red-400 transition-colors mt-0.5"
                      >
                        <X size={10} /> حذف
                      </button>
                    </motion.div>
                  </th>
                ))}
                {items.length < 4 && (
                  <th className="pb-3 text-center min-w-[140px]">
                    <div
                      onClick={() => router.push('/')}
                      className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl cursor-pointer transition-all"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px dashed rgba(255,255,255,0.16)' }}
                    >
                      <div className="text-2xl text-white/25">+</div>
                      <div className="text-[11px] text-white/35">افزودن</div>
                    </div>
                  </th>
                )}
              </tr>
            </thead>

            <tbody>
              {rows.map((row, ri) => (
                <tr
                  key={ri}
                  className="border-t transition-colors hover:bg-white/1"
                  style={{ borderColor: 'rgba(255,255,255,0.07)' }}
                >
                  <td className="py-3 text-[11.5px] font-medium text-white/60 pr-0 whitespace-nowrap">
                    {row.label}
                  </td>
                  {items.map((item) => {
                    const d = item.detail;
                    let cellCls = 'text-white/60';

                    if (row.rank) {
                      const val = row.rank(d);
                      if (val != null) {
                        if (row.rankDir === 'asc') {
                          if (val === globalMin) cellCls = 'text-emerald-400 font-bold';
                          else if (val === globalMax) cellCls = 'text-red-400';
                          else cellCls = 'text-amber-400';
                        } else {
                          if (val === bestScore) cellCls = 'text-emerald-400 font-bold';
                        }
                      }
                    }

                    return (
                      <td key={item.catalogItem.id} className={cn('py-3 text-[12px] text-center', cellCls)}>
                        {item.loading ? (
                          <div className="flex justify-center">
                            <div className="w-4 h-4 rounded-full border-2 border-indigo-500/30 border-t-indigo-500 animate-spin" />
                          </div>
                        ) : item.error ? (
                          <span className="text-[10px] text-red-400">خطا</span>
                        ) : row.raw ? (
                          <span dangerouslySetInnerHTML={{ __html: row.fn(d) }} />
                        ) : (
                          row.fn(d)
                        )}
                      </td>
                    );
                  })}
                  {items.length < 4 && <td />}
                </tr>
              ))}

              {/* Buy buttons row */}
              <tr className="border-t" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
                <td className="py-3 text-[11.5px] font-medium text-white/60 pr-0">🛒 خرید</td>
                {items.map((item) => {
                  const best = item.detail?.storePrices
                    ?.filter((s) => s.inStock && s.price > 0)
                    ?.sort((a, b) => a.price - b.price)?.[0];
                  const st = best ? STORES[best.storeId as keyof typeof STORES] : null;
                  const link = best
                    ? best.url?.startsWith('http')
                      ? best.url
                      : `${st?.searchUrl ?? ''}${encodeURIComponent(item.detail?.title ?? item.catalogItem.name)}`
                    : null;

                  return (
                    <td key={item.catalogItem.id} className="py-3 text-center">
                      {item.loading ? (
                        <div className="text-[10px] text-white/35">در حال بارگذاری...</div>
                      ) : link ? (
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-white"
                          style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}
                        >
                          خرید <ExternalLink size={9} />
                        </a>
                      ) : (
                        <span className="text-[11px] text-red-400">ناموجود</span>
                      )}
                    </td>
                  );
                })}
                {items.length < 4 && <td />}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
