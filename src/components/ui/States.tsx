'use client';
import { STORES } from '@/constants';

// ── Spinner ────────────────────────────────────────────────────────────────────
export function LoadingSpinner({
  message = 'در حال بارگذاری...',
  sub,
}: {
  message?: string;
  sub?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div
        className="w-11 h-11 rounded-full border-[3px] border-indigo-500/20 border-t-indigo-500 animate-spin-slow"
      />
      <p className="text-[13px] text-white/60">{message}</p>
      {sub && <p className="text-[11px] text-white/35">{sub}</p>}
    </div>
  );
}

// ── Error State ────────────────────────────────────────────────────────────────
export function ErrorState({
  message,
  productName,
}: {
  message: string;
  productName?: string;
}) {
  const searchQuery = productName ? encodeURIComponent(productName) : '';

  return (
    <div
      className="rounded-2xl p-4 my-3"
      style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)' }}
    >
      <h4 className="text-[13px] text-red-400 font-semibold mb-2">
        ⚠️ دریافت قیمت لحظه‌ای ناموفق بود
      </h4>
      <p className="text-[12px] text-white/60 leading-relaxed mb-3">{message}</p>
      {productName && (
        <>
          <p className="text-[11px] text-white/40 mb-2">
            مستقیماً در فروشگاه‌ها جستجو کنید:
          </p>
          <div className="flex flex-wrap gap-2">
            {Object.values(STORES).map((store) => (
              <a
                key={store.name}
                href={`${store.searchUrl}${searchQuery}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] px-3 py-1 rounded-lg transition-all text-white/60 hover:text-white"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)' }}
              >
                {store.emoji} {store.name} ↗
              </a>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── Empty State ────────────────────────────────────────────────────────────────
export function EmptyState({
  icon,
  title,
  body,
  action,
}: {
  icon: string;
  title: string;
  body?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="text-center py-14">
      <div className="text-5xl mb-3 opacity-30">{icon}</div>
      <h3 className="text-[15px] font-semibold text-white/60 mb-2">{title}</h3>
      {body && <p className="text-[13px] text-white/35 leading-relaxed">{body}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

// ── Skeleton Card ─────────────────────────────────────────────────────────────
export function SkeletonCard() {
  return (
    <div
      className="rounded-2xl p-3 animate-pulse"
      style={{ background: 'rgba(255,255,255,0.045)', border: '1px solid rgba(255,255,255,0.09)' }}
    >
      <div className="aspect-square rounded-xl mb-3" style={{ background: 'rgba(255,255,255,0.06)' }} />
      <div className="h-2.5 rounded-full mb-2" style={{ background: 'rgba(255,255,255,0.06)', width: '40%' }} />
      <div className="h-3 rounded-full mb-1.5" style={{ background: 'rgba(255,255,255,0.06)' }} />
      <div className="h-3 rounded-full mb-3" style={{ background: 'rgba(255,255,255,0.06)', width: '75%' }} />
      <div className="h-4 rounded-full" style={{ background: 'rgba(255,255,255,0.06)', width: '55%' }} />
    </div>
  );
}
