import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format Toman price with Persian locale */
export function formatPrice(price: number): string {
  return price.toLocaleString('fa-IR');
}

/** Short format: 31,500,000 → ۳۱.۵ میلیون */
export function formatPriceShort(price: number): string {
  if (price >= 1_000_000) {
    const m = price / 1_000_000;
    return `${(m % 1 === 0 ? m.toFixed(0) : m.toFixed(1)).toLocaleString('fa-IR')} میلیون`;
  }
  if (price >= 1_000) {
    return `${Math.round(price / 1000).toLocaleString('fa-IR')} هزار`;
  }
  return formatPrice(price);
}

/** Relative time in Persian */
export function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60_000);
  const h = Math.floor(diff / 3_600_000);
  const d = Math.floor(diff / 86_400_000);
  if (m < 1) return 'همین الان';
  if (m < 60) return `${m} دقیقه پیش`;
  if (h < 24) return `${h} ساعت پیش`;
  if (d < 7) return `${d} روز پیش`;
  return new Date(iso).toLocaleDateString('fa-IR');
}

/** Format percentage change with arrow */
export function formatChange(pct: number | null): string {
  if (pct == null) return '—';
  if (pct === 0) return '—';
  return pct < 0 ? `▼ ${Math.abs(pct)}٪` : `▲ ${pct}٪`;
}

/** Color class for price change */
export function changeColor(pct: number | null): string {
  if (!pct) return 'text-white/40';
  return pct < 0 ? 'text-emerald-400' : 'text-red-400';
}

/** AI score color */
export function scoreColor(score: number): string {
  if (score >= 80) return 'text-emerald-400';
  if (score >= 60) return 'text-yellow-400';
  if (score >= 40) return 'text-orange-400';
  return 'text-red-400';
}

/** Debounce */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T, delay: number
): (...args: Parameters<T>) => void {
  let t: ReturnType<typeof setTimeout>;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
}

/** Truncate text */
export function truncate(s: string, n: number): string {
  return s.length > n ? s.slice(0, n).trim() + '…' : s;
}

/** Safe localStorage get */
export function lsGet<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch { return fallback; }
}

/** Safe localStorage set */
export function lsSet(key: string, value: unknown): void {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignore */ }
}

/** Normalize search query — Finglish → Persian */
export function normalizeQuery(q: string): string {
  const map: Record<string, string> = {
    iphone: 'آیفون', iphon: 'آیفون', samsung: 'سامسونگ',
    laptop: 'لپتاپ', macbook: 'مک بوک', airpod: 'ایرپاد',
    playstation: 'پلی استیشن', ps5: 'پلی استیشن ۵',
    nintendo: 'نینتندو', switch: 'سوییچ', logitech: 'لاجیتک',
    razer: 'ریزر', hyperx: 'هایپر ایکس', sony: 'سونی',
    headphone: 'هدفون', headset: 'هدست', monitor: 'مانیتور',
    keyboard: 'کیبورد', mouse: 'موس',
  };
  const lower = q.toLowerCase();
  for (const [k, v] of Object.entries(map)) {
    if (lower.includes(k)) return q.replace(new RegExp(k, 'gi'), v);
  }
  return q;
}
