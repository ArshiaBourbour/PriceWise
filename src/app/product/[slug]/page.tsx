'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Heart, Bell, GitCompare, ExternalLink, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { useLivePrices } from '@/hooks/useLivePrices';
import PriceChart from '@/components/ui/PriceChart';
import { LoadingSpinner, ErrorState, EmptyState } from '@/components/ui/States';
import { CATALOG, STORES } from '@/constants';
import { useWishlistStore, useCompareStore, useAlertsStore, useNotifStore, useRecentlyViewedStore } from '@/store';
import { formatPrice, cn } from '@/utils';
import type { ProductCatalogItem } from '@/types';

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertPrice, setAlertPrice] = useState('');
  const [notifyVia, setNotifyVia] = useState({ push: true, email: true, sms: false });
  const [period, setPeriod] = useState<7 | 30 | 90>(7);

  const product = CATALOG.find((p) => p.id === slug);
  const { data: detail, isLoading, error, refetch } = useLivePrices(product ?? null);
  const { add: addRecent } = useRecentlyViewedStore();

  const { add: addWish, remove: removeWish, has: inWish } = useWishlistStore();
  const { add: addCmp, remove: removeCmp, has: inCmp } = useCompareStore();
  const { add: addAlert, has: hasAlert } = useAlertsStore();
  const { add: addNotif } = useNotifStore();

  const isWished = product ? inWish(product.id) : false;
  const isCompared = product ? inCmp(product.id) : false;

  // Track recently viewed
  useEffect(() => {
    if (product) addRecent(product);
  }, [product?.id]);

  // Pre-fill alert price when detail loads
  useEffect(() => {
    if (detail?.minPrice) {
      setAlertPrice(String(Math.round(detail.minPrice * 0.9)));
    }
  }, [detail?.minPrice]);

  if (!product) {
    return (
      <div className="px-5 py-6">
        <button onClick={() => router.back()} className="flex items-center gap-1.5 text-[13px] text-white/55 hover:text-white mb-4 transition-colors">
          <ArrowRight size={14} />بازگشت
        </button>
        <EmptyState icon="🔍" title="محصول یافت نشد" body="این محصول در کاتالوگ ما وجود ندارد" />
      </div>
    );
  }

  const sortedStores = detail ? [...detail.storePrices].sort((a, b) => a.price - b.price) : [];

  const handleSaveAlert = () => {
    const v = parseInt(alertPrice);
    if (!v || isNaN(v) || v <= 0) { toast.error('یه قیمت معتبر وارد کن'); return; }
    addAlert({
      productId: product.id,
      productName: product.name,
      productEmoji: product.emoji,
      targetPrice: v,
      notifyVia: (Object.keys(notifyVia) as ('push' | 'email' | 'sms')[]).filter((k) => notifyVia[k]),
      isActive: true,
    });
    addNotif({
      type: 'alert_triggered',
      title: `🔔 هشدار برای ${product.name.slice(0, 28)}...`,
      body: `وقتی قیمت به ${formatPrice(v)} تومان برسد اطلاع می‌دیم.`,
    });
    setAlertOpen(false);
    toast.success('هشدار با موفقیت ثبت شد! 🔔');
  };

  return (
    <div className="px-5 py-6 relative z-10">
      <button onClick={() => router.back()}
        className="flex items-center gap-1.5 text-[13px] text-white/55 hover:text-white mb-5 transition-colors">
        <ArrowRight size={14} />بازگشت
      </button>

      {isLoading && <LoadingSpinner message="در حال دریافت قیمت لحظه‌ای..." sub="بررسی موجودی در همه فروشگاه‌ها" />}

      {!isLoading && (
        <div className="grid gap-4 md:grid-cols-[260px_1fr]">
          {/* Left column */}
          <div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="aspect-square rounded-3xl flex items-center justify-center text-8xl mb-3 glass-card"
            >
              {product.emoji}
            </motion.div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => { if (isWished) { removeWish(product.id); toast.info('از علاقه‌مندی‌ها حذف شد'); } else { addWish(product); toast.success('به علاقه‌مندی‌ها اضافه شد ❤️'); } }}
                className={cn('flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[12px] font-medium transition-all btn-ghost', isWished && 'bg-red-500/10 border-red-500/30 text-red-400')}
              >
                <Heart size={13} fill={isWished ? 'currentColor' : 'none'} />
                {isWished ? 'در علاقه‌مندی' : 'علاقه‌مندی'}
              </button>
              <button
                onClick={() => { if (isCompared) { removeCmp(product.id); toast.info('از مقایسه حذف شد'); } else { addCmp(product); toast.success('به مقایسه اضافه شد'); } }}
                className={cn('flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[12px] font-medium transition-all btn-ghost', isCompared && 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400')}
              >
                <GitCompare size={13} />مقایسه
              </button>
              <button
                onClick={() => setAlertOpen(true)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[12px] font-semibold transition-all"
                style={{ background: 'rgba(99,102,241,0.13)', border: '1px solid rgba(99,102,241,0.38)', color: '#6366f1' }}
              >
                <Bell size={13} />هشدار
              </button>
            </div>
          </div>

          {/* Right column */}
          <div>
            <motion.h1 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="text-[18px] font-black leading-snug mb-2">
              {detail?.title ?? product.name}
            </motion.h1>

            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className="text-[12px] text-white/35 px-3 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)' }}>
                {product.brand}
              </span>
              <span className="text-[11px] text-white/35">{product.cat}</span>
              <span className="text-[11px] text-white/25">{product.stores} فروشگاه</span>
            </div>

            {error ? (
              <ErrorState
                message={error instanceof Error ? error.message : 'خطای ناشناخته'}
                productName={product.name}
              />
            ) : detail ? (
              <>
                {/* AI Analysis */}
                {detail.aiAnalysis && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="ai-box mb-4">
                    <div className="text-[11.5px] font-semibold mb-3" style={{ color: '#6366f1' }}>🤖 تحلیل هوشمند قیمت</div>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <span className={cn('inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11.5px] font-semibold mb-2',
                          detail.aiAnalysis.recommendation === 'buy_now' ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/28' :
                          detail.aiAnalysis.recommendation === 'wait' ? 'text-amber-400 bg-amber-500/10 border border-amber-500/28' :
                          'text-red-400 bg-red-500/10 border border-red-500/28')}>
                          {detail.aiAnalysis.recommendation === 'buy_now' ? '✅' : detail.aiAnalysis.recommendation === 'wait' ? '⏳' : '⛔'}{' '}
                          {detail.aiAnalysis.recommendationText}
                        </span>
                        <div className="flex gap-4 text-[10.5px] text-white/35">
                          <span>📉 کاهش قیمت: <strong className="text-white/70">{detail.aiAnalysis.priceDropProbability}٪</strong></span>
                          <span>📦 ناموجودی: <strong className="text-white/70">{detail.aiAnalysis.stockShortageProbability}٪</strong></span>
                        </div>
                      </div>
                      <div className="text-center shrink-0">
                        <div className="text-[36px] font-black leading-none">{detail.aiAnalysis.buyingScore}</div>
                        <div className="text-[9px] text-white/35">از ۱۰۰</div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      {detail.aiAnalysis.reasons.map((r, i) => (
                        <div key={i} className={cn('flex items-start gap-2 text-[11px] text-white/60',
                          r.type === 'positive' ? 'before:content-["✓"] before:text-emerald-400 before:font-bold' :
                          r.type === 'warning' ? 'before:content-["⚠"] before:text-amber-400' :
                          'before:content-["✗"] before:text-red-400 before:font-bold')}>
                          {r.text}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Price summary */}
                <div className="glass-card p-4 mb-4">
                  {[
                    ['کمترین قیمت', detail.minPrice, 'text-emerald-400'],
                    ['میانگین قیمت', detail.avgPrice, 'text-amber-400'],
                    ['بیشترین قیمت', detail.maxPrice, 'text-white/60'],
                  ].map(([label, price, cls]) => (
                    <div key={label as string} className="flex justify-between items-center mb-2 last:mb-0">
                      <span className="text-[11px] text-white/35">{label as string}</span>
                      <span className={cn('text-[13px] font-bold', cls as string)}>
                        {formatPrice(price as number)} تومان
                      </span>
                    </div>
                  ))}
                </div>

                {/* Chart */}
                <div className="glass-card p-4 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[12px] font-semibold text-white/60">📈 تاریخچه قیمت</span>
                    <div className="flex gap-1">
                      {([7, 30, 90] as const).map((d) => (
                        <button key={d}
                          onClick={() => setPeriod(d)}
                          className={cn('text-[10px] px-2 py-0.5 rounded-full transition-all border',
                            period === d ? 'border-indigo-500/40 text-indigo-400 bg-indigo-500/10' : 'border-white/9 text-white/35')}>
                          {d === 7 ? '۷ روز' : d === 30 ? '۳۰ روز' : '۹۰ روز'}
                        </button>
                      ))}
                    </div>
                  </div>
                  <PriceChart
                    history={detail.history.slice(-period)}
                    labels={detail.historyLabels.slice(-period)}
                    minPrice={detail.minPrice}
                    avgPrice={detail.avgPrice}
                  />
                  <div className="flex gap-4 text-[10px] text-white/35 mt-2">
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-indigo-500" />قیمت</span>
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400" />میانگین</span>
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400" />کمترین</span>
                  </div>
                </div>

                {/* Store prices */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-[13px] font-semibold">قیمت در فروشگاه‌ها</h2>
                    <span className="text-[10px] text-white/35">({sortedStores.length} فروشگاه)</span>
                  </div>
                  {sortedStores.map((s, i) => {
                    const st = STORES[s.storeId as keyof typeof STORES];
                    const link = s.url?.startsWith('http') ? s.url : `${st?.searchUrl ?? ''}${encodeURIComponent(detail.title)}`;
                    return (
                      <motion.div key={s.storeId}
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={cn('store-card', i === 0 && 'best')}>
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0"
                          style={{ background: 'rgba(255,255,255,0.06)' }}>
                          {st?.emoji ?? '🏪'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[12.5px] font-semibold">
                            {st?.name ?? s.storeId}
                            {i === 0 && <span className="text-emerald-400 text-[9px] mr-1">— بهترین قیمت</span>}
                          </div>
                          <div className="flex gap-2 text-[10.5px] text-white/35 flex-wrap">
                            <span className="text-amber-400">★ {st?.trust ?? '—'}</span>
                            <span>🚚 {st?.delivery ?? '—'}</span>
                            <span className={s.inStock ? 'text-emerald-400' : 'text-red-400'}>
                              {s.inStock ? '✓ موجود' : '✗ ناموجود'}
                            </span>
                            {s.warranty && <span>{s.warranty}</span>}
                          </div>
                          {i === 0 && (
                            <div className="text-[9px] text-emerald-400 mt-0.5">
                              💰 صرفه‌جویی: {formatPrice(detail.maxPrice - s.price)} تومان
                            </div>
                          )}
                        </div>
                        <div className="text-left shrink-0">
                          <div className="text-[15px] font-black">{formatPrice(s.price)}</div>
                          <div className="text-[9px] text-white/35">تومان</div>
                          {s.inStock ? (
                            <a href={link} target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-1 text-[11px] font-semibold text-white mt-1 px-3 py-1 rounded-lg"
                              style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
                              خرید <ExternalLink size={9} />
                            </a>
                          ) : (
                            <div className="text-[9px] text-red-400 mt-1">ناموجود</div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Compare table */}
                <div className="glass-card p-4 overflow-x-auto">
                  <h3 className="text-[13px] font-semibold mb-3">جدول مقایسه فروشگاه‌ها</h3>
                  <table className="w-full text-[12px] min-w-[400px]">
                    <thead>
                      <tr className="text-right text-[10px] text-white/35 border-b" style={{ borderColor: 'rgba(255,255,255,0.09)' }}>
                        <th className="pb-2 pr-0">فروشگاه</th>
                        <th className="pb-2">قیمت (تومان)</th>
                        <th className="pb-2">موجودی</th>
                        <th className="pb-2">امتیاز</th>
                        <th className="pb-2">ارسال</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedStores.map((s, i) => {
                        const st = STORES[s.storeId as keyof typeof STORES];
                        const link = s.url?.startsWith('http') ? s.url : `${st?.searchUrl ?? ''}${encodeURIComponent(detail.title)}`;
                        return (
                          <tr key={s.storeId} className="border-b hover:bg-white/2 transition-colors" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                            <td className="py-2">
                              <a href={link} target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-1.5 text-white/80 hover:text-white transition-colors">
                                {st?.emoji ?? '🏪'} {st?.name ?? s.storeId}
                                <ExternalLink size={9} className="text-indigo-400" />
                              </a>
                            </td>
                            <td className={cn('py-2 font-bold', i === 0 ? 'text-emerald-400' : 'text-white/90')}>
                              {formatPrice(s.price)}
                            </td>
                            <td className={cn('py-2', s.inStock ? 'text-emerald-400' : 'text-red-400')}>
                              {s.inStock ? '✓ موجود' : '✗'}
                            </td>
                            <td className="py-2 text-amber-400">★ {st?.trust ?? '—'}</td>
                            <td className="py-2 text-white/35">{st?.delivery ?? '—'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}

      {/* Alert Modal */}
      {alertOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5"
          style={{ background: 'rgba(0,0,0,0.78)', backdropFilter: 'blur(12px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setAlertOpen(false); }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-[360px] rounded-3xl p-6"
            style={{ background: '#12121e', border: '1px solid rgba(255,255,255,0.16)', boxShadow: '0 20px 60px rgba(0,0,0,0.6)' }}>
            <h3 className="text-[15px] font-bold mb-1">🔔 هشدار کاهش قیمت</h3>
            <p className="text-[11.5px] text-white/35 mb-4">وقتی قیمت به حد دلخواهت رسید بهت خبر می‌دیم</p>
            <div className="flex items-center gap-3 p-3 rounded-xl mb-4" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)' }}>
              <span className="text-3xl">{product.emoji}</span>
              <div>
                <div className="text-[12.5px] font-medium">{product.name}</div>
                <div className="text-[11px] text-white/35">قیمت فعلی: {detail?.minPrice ? formatPrice(detail.minPrice) : '—'} تومان</div>
              </div>
            </div>
            <label className="text-[11.5px] font-medium text-white/70 block mb-1.5">قیمت هدف (تومان)</label>
            <input
              type="number" value={alertPrice} onChange={(e) => setAlertPrice(e.target.value)}
              className="w-full rounded-xl px-4 py-2.5 text-[14px] text-white/95 mb-1 outline-none transition-all"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.16)', fontFamily: 'Vazirmatn,Tahoma,sans-serif' }}
              placeholder="مثلاً: 28000000"
              onFocus={(e) => { e.target.style.borderColor = 'rgba(99,102,241,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.15)'; }}
              onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.16)'; e.target.style.boxShadow = 'none'; }}
            />
            {detail?.minPrice && alertPrice && (
              <p className="text-[10.5px] text-white/35 mb-3">
                {Math.round(((detail.minPrice - parseInt(alertPrice)) / detail.minPrice) * 100)}٪ کمتر از قیمت فعلی
              </p>
            )}
            <div className="flex gap-2 mb-4">
              {(['push', 'email', 'sms'] as const).map((ch) => (
                <button key={ch} onClick={() => setNotifyVia((v) => ({ ...v, [ch]: !v[ch] }))}
                  className={cn('flex-1 py-2 rounded-xl text-[11px] transition-all',
                    notifyVia[ch] ? 'bg-indigo-500/15 border border-indigo-500/40 text-indigo-400' : 'btn-ghost')}>
                  {ch === 'push' ? '📲 پوش' : ch === 'email' ? '📧 ایمیل' : '💬 SMS'}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setAlertOpen(false)} className="flex-1 py-2.5 rounded-xl text-[12.5px] btn-ghost">انصراف</button>
              <button onClick={handleSaveAlert}
                className="flex-[2] py-2.5 rounded-xl text-[12.5px] font-bold text-white"
                style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
                فعال کردن هشدار ✓
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
