import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  AuthState, User, WishlistItem, PriceAlert,
  Notification, CompareItem, ProductCatalogItem,
} from '@/types';
import { lsGet } from '@/utils';

// ─── Auth ─────────────────────────────────────────────────────────────────────

interface AuthStore extends AuthState {
  login: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      user: null,
      login: (user) => set({ isLoggedIn: true, user }),
      logout: () => set({ isLoggedIn: false, user: null }),
    }),
    { name: 'pw-auth', storage: createJSONStorage(() => localStorage) }
  )
);

// ─── Wishlist ─────────────────────────────────────────────────────────────────

interface WishlistStore {
  items: WishlistItem[];
  add: (p: ProductCatalogItem) => void;
  remove: (id: string) => void;
  has: (id: string) => boolean;
  clear: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      add: (p) => {
        if (get().has(p.id)) return;
        const item: WishlistItem = {
          id: crypto.randomUUID(),
          productId: p.id,
          name: p.name,
          brand: p.brand,
          emoji: p.emoji,
          cat: p.cat,
          stores: p.stores,
          addedAt: new Date().toISOString(),
          // NO price stored
        };
        set((s) => ({ items: [...s.items, item] }));
      },
      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.productId !== id) })),
      has: (id) => get().items.some((i) => i.productId === id),
      clear: () => set({ items: [] }),
    }),
    { name: 'pw-wishlist', storage: createJSONStorage(() => localStorage) }
  )
);

// ─── Alerts ───────────────────────────────────────────────────────────────────

interface AlertsStore {
  alerts: PriceAlert[];
  add: (alert: Omit<PriceAlert, 'id' | 'createdAt'>) => void;
  remove: (id: string) => void;
  toggle: (id: string) => void;
  has: (productId: string) => boolean;
}

export const useAlertsStore = create<AlertsStore>()(
  persist(
    (set, get) => ({
      alerts: [],
      add: (alert) => {
        const a: PriceAlert = {
          ...alert,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ alerts: [a, ...s.alerts].slice(0, 20) }));
      },
      remove: (id) => set((s) => ({ alerts: s.alerts.filter((a) => a.id !== id) })),
      toggle: (id) =>
        set((s) => ({
          alerts: s.alerts.map((a) => a.id === id ? { ...a, isActive: !a.isActive } : a),
        })),
      has: (productId) => get().alerts.some((a) => a.productId === productId && a.isActive),
    }),
    { name: 'pw-alerts', storage: createJSONStorage(() => localStorage) }
  )
);

// ─── Notifications ────────────────────────────────────────────────────────────

const DEFAULT_NOTIFS: Notification[] = [
  {
    id: '1',
    type: 'system',
    title: 'خوش آمدید به قیمت‌یار 🎯',
    body: 'قیمت لحظه‌ای از ۵۰۰+ فروشگاه ایران. روی هر محصول کلیک کنید تا قیمت واقعی را ببینید.',
    time: new Date().toISOString(),
    isRead: false,
  },
  {
    id: '2',
    type: 'price_drop',
    title: 'هشدار قیمت فعال است 🔔',
    body: 'پس از ثبت هشدار، به محض کاهش قیمت به شما اطلاع می‌دهیم.',
    time: new Date(Date.now() - 3600_000).toISOString(),
    isRead: true,
  },
];

interface NotifStore {
  notifs: Notification[];
  add: (n: Omit<Notification, 'id' | 'isRead' | 'time'>) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  unreadCount: () => number;
}

export const useNotifStore = create<NotifStore>()(
  persist(
    (set, get) => ({
      notifs: DEFAULT_NOTIFS,
      add: (n) => {
        const notif: Notification = {
          ...n,
          id: crypto.randomUUID(),
          isRead: false,
          time: new Date().toISOString(),
        };
        set((s) => ({ notifs: [notif, ...s.notifs].slice(0, 50) }));
      },
      markRead: (id) =>
        set((s) => ({ notifs: s.notifs.map((n) => n.id === id ? { ...n, isRead: true } : n) })),
      markAllRead: () => set((s) => ({ notifs: s.notifs.map((n) => ({ ...n, isRead: true })) })),
      unreadCount: () => get().notifs.filter((n) => !n.isRead).length,
    }),
    { name: 'pw-notifs', storage: createJSONStorage(() => localStorage) }
  )
);

// ─── Compare ─────────────────────────────────────────────────────────────────

interface CompareStore {
  items: CompareItem[];
  add: (p: ProductCatalogItem) => boolean;  // returns false if full or duplicate
  remove: (id: string) => void;
  setDetail: (id: string, detail: CompareItem['detail']) => void;
  setLoading: (id: string, loading: boolean) => void;
  setError: (id: string, error: string) => void;
  has: (id: string) => boolean;
  clear: () => void;
}

export const useCompareStore = create<CompareStore>()((set, get) => ({
  items: [],
  add: (p) => {
    if (get().items.length >= 4 || get().has(p.id)) return false;
    set((s) => ({ items: [...s.items, { catalogItem: p }] }));
    return true;
  },
  remove: (id) => set((s) => ({ items: s.items.filter((i) => i.catalogItem.id !== id) })),
  setDetail: (id, detail) =>
    set((s) => ({
      items: s.items.map((i) => i.catalogItem.id === id ? { ...i, detail, loading: false } : i),
    })),
  setLoading: (id, loading) =>
    set((s) => ({ items: s.items.map((i) => i.catalogItem.id === id ? { ...i, loading } : i) })),
  setError: (id, error) =>
    set((s) => ({ items: s.items.map((i) => i.catalogItem.id === id ? { ...i, error, loading: false } : i) })),
  has: (id) => get().items.some((i) => i.catalogItem.id === id),
  clear: () => set({ items: [] }),
}));

// ─── Recently Viewed ──────────────────────────────────────────────────────────
// Stores catalog metadata ONLY — no prices

interface RecentlyViewedStore {
  items: ProductCatalogItem[];
  add: (p: ProductCatalogItem) => void;
  clear: () => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedStore>()(
  persist(
    (set) => ({
      items: [],
      add: (p) =>
        set((s) => ({
          items: [p, ...s.items.filter((i) => i.id !== p.id)].slice(0, 10),
        })),
      clear: () => set({ items: [] }),
    }),
    { name: 'pw-recent', storage: createJSONStorage(() => localStorage) }
  )
);

// ─── Search history ───────────────────────────────────────────────────────────

interface SearchStore {
  recent: string[];
  addQuery: (q: string) => void;
  clear: () => void;
}

export const useSearchStore = create<SearchStore>()(
  persist(
    (set) => ({
      recent: [],
      addQuery: (q) =>
        set((s) => ({ recent: [q, ...s.recent.filter((r) => r !== q)].slice(0, 10) })),
      clear: () => set({ recent: [] }),
    }),
    { name: 'pw-search-history', storage: createJSONStorage(() => localStorage) }
  )
);
