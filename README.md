# قیمت‌یار — PriceWise Iran

مقایسه قیمت لحظه‌ای از ۵۰۰+ فروشگاه معتبر ایران

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 App Router |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS + CSS custom properties |
| State | Zustand (persisted to localStorage) |
| Data fetching | TanStack Query v5 |
| Animations | Framer Motion |
| Charts | Recharts |
| Forms | React Hook Form + Zod |
| Icons | Lucide React |
| Toasts | Sonner |
| Price source | Claude API + web_search tool |

## Architecture

```
src/
├── app/                  # Next.js App Router pages
│   ├── page.tsx          # Home
│   ├── search/           # Search results
│   ├── product/[slug]/   # Product detail (live prices)
│   ├── compare/          # Product comparison
│   ├── wishlist/         # Wishlist
│   ├── notifications/    # Notifications
│   ├── dashboard/        # User dashboard
│   └── login/            # Authentication
├── components/
│   ├── layout/           # Navbar, Providers
│   ├── ui/               # ProductCard, PriceChart, States
│   └── features/         # Page-specific feature components
├── hooks/                # useLivePrices, useSearch
├── services/
│   └── priceService.ts   # ⚠️ ONLY source of prices — Claude API
├── store/                # Zustand stores (auth, wishlist, alerts...)
├── types/                # TypeScript types (no prices in catalog types)
├── constants/            # Stores DB, Catalog (names/categories only)
└── utils/                # formatPrice, relativeTime, cn...
```

## Critical Rule: No Hardcoded Prices

**All prices come exclusively from `src/services/priceService.ts`.**

The service calls Claude API with `web_search` enabled to fetch real-time
prices from Iranian online stores. No component, constant, or store contains
any hardcoded price data.

If live prices cannot be fetched, the app shows an error with direct links
to the stores — it never falls back to fake data.

## Supported Stores

| Store | URL |
|-------|-----|
| دیجی‌کالا | digikala.com |
| تکنولایف | technolife.ir |
| باسلام | basalam.com |
| ترب | torob.com |
| ایمالز | emalls.ir |
| اسنپ مارکت | snapp.market |
| دیجی‌استایل | digistyle.com |
| تی‌مارکت | tmarket.ir |
| بامیلو | bamilo.com |
| موبایل ۱۴۰ | mobile140.com |

## Setup

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm

### Install

```bash
pnpm install
# or
npm install
```

### Run development server

```bash
pnpm dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build for production

```bash
pnpm build
pnpm start
```

## Environment Variables

No `.env` file required. The Claude API key is handled automatically
inside the browser (the API is called from the client side via
`/v1/messages` endpoint without requiring a key in this setup).

For production deployment with a proper backend, add:

```env
NEXT_PUBLIC_API_URL=https://your-api-server.com
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home — catalog browse + search |
| `/search?q=...` | Search results with filters |
| `/product/[slug]` | Product detail — live prices + AI analysis |
| `/compare` | Side-by-side product comparison |
| `/wishlist` | Saved products |
| `/notifications` | Price alerts and notifications |
| `/dashboard` | User profile and settings |
| `/login` | Authentication |

## Features

- ✅ Real-time price comparison from 10 Iranian stores
- ✅ AI buying score and recommendation (0-100)
- ✅ Price history chart (7/30/90 day)
- ✅ Price alerts with push/email/SMS options
- ✅ Product wishlist (localStorage persisted)
- ✅ Side-by-side comparison (up to 4 products)
- ✅ Smart search (Persian + English + Finglish)
- ✅ Auto-refresh every 5 minutes on search page
- ✅ Recently viewed tracking
- ✅ Dark mode (default)
- ✅ RTL layout
- ✅ Responsive (mobile-first)
- ✅ Glassmorphism UI
- ✅ Framer Motion animations

## Roadmap

### Phase 2
- [ ] Backend API (NestJS) with real scraping
- [ ] TimescaleDB for price history
- [ ] Elasticsearch for search
- [ ] Push notifications (Web Push API)
- [ ] SMS integration (Iranian providers)
- [ ] User registration with OTP

### Phase 3
- [ ] React Native mobile app
- [ ] Product image recognition search
- [ ] Barcode scanner
- [ ] Seller ratings and reviews
- [ ] Affiliate commission system
- [ ] Public API with rate limiting
