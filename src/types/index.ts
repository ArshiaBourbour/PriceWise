// ─── Product ──────────────────────────────────────────────────────────────────

export type ProductCategory =
  | 'گوشی' | 'لپ‌تاپ' | 'هدفون' | 'گیمینگ'
  | 'ساعت'  | 'تبلت'   | 'اکسسوری' | 'ذخیره‌سازی'
  | 'دوربین' | 'سایر';

export interface ProductCatalogItem {
  id: string;
  name: string;
  brand: string;
  cat: ProductCategory;
  emoji: string;
  stores: number;
  hot: boolean;
  // NO prices here — prices only from API
}

export interface StorePrice {
  storeId: string;
  price: number;          // Tomans — from live API only
  inStock: boolean;
  url: string;
  warranty?: string;
  lastUpdated: string;
}

export interface PriceHistoryPoint {
  date: string;
  price: number | null;
}

export interface AIAnalysis {
  buyingScore: number;
  recommendation: 'buy_now' | 'wait' | 'avoid';
  recommendationText: string;
  reasons: { type: 'positive' | 'warning' | 'negative'; text: string }[];
  priceDropProbability: number;
  stockShortageProbability: number;
  estimatedFutureTrend: 'rising' | 'falling' | 'stable';
}

export interface LiveProductDetail {
  productId: string;
  title: string;
  brand: string;
  cat: string;
  emoji: string;
  minPrice: number;
  avgPrice: number;
  maxPrice: number;
  priceChange: number | null;
  storePrices: StorePrice[];
  history: (number | null)[];
  historyLabels: string[];
  aiAnalysis: AIAnalysis | null;
  sources: string[];
  fetchedAt: string;
}

// ─── Search ───────────────────────────────────────────────────────────────────

export interface SearchResult {
  items: ProductCatalogItem[];
  total: number;
  query: string;
  page: number;
}

export interface SearchFilters {
  minPrice?: number;
  maxPrice?: number;
  onlyDiscounted: boolean;
  onlyInStock: boolean;
  categories: ProductCategory[];
}

// ─── User & Auth ──────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  joinedAt: string;
}

export interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
}

// ─── Wishlist ─────────────────────────────────────────────────────────────────

export interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  brand: string;
  emoji: string;
  cat: ProductCategory;
  stores: number;
  addedAt: string;
  // NO prices stored
}

// ─── Alerts ───────────────────────────────────────────────────────────────────

export interface PriceAlert {
  id: string;
  productId: string;
  productName: string;
  productEmoji: string;
  targetPrice: number;
  notifyVia: ('push' | 'email' | 'sms')[];
  isActive: boolean;
  createdAt: string;
}

// ─── Notifications ────────────────────────────────────────────────────────────

export type NotifType =
  | 'price_drop' | 'price_rise' | 'back_in_stock'
  | 'flash_sale' | 'alert_triggered' | 'system';

export interface Notification {
  id: string;
  type: NotifType;
  title: string;
  body: string;
  productId?: string;
  time: string;
  isRead: boolean;
}

// ─── Compare ─────────────────────────────────────────────────────────────────

export interface CompareItem {
  catalogItem: ProductCatalogItem;
  detail?: LiveProductDetail;
  loading?: boolean;
  error?: string;
}

// ─── API ─────────────────────────────────────────────────────────────────────

export interface ApiError {
  message: string;
  code?: string;
}
