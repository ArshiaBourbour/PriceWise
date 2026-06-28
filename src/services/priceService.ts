/**
 * PriceWise Iran — Price Service
 *
 * ╔══════════════════════════════════════════════════╗
 * ║  THIS IS THE ONLY FILE THAT HANDLES PRICES      ║
 * ║  No component, store, or constant may contain   ║
 * ║  hardcoded prices. All prices flow through here. ║
 * ╚══════════════════════════════════════════════════╝
 */

import type { LiveProductDetail, ProductCatalogItem, SearchResult } from '@/types';

const CLAUDE_API = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-6';

// ─── Core API caller ──────────────────────────────────────────────────────────

async function callClaude(
  prompt: string,
  opts: { maxTokens?: number; webSearch?: boolean } = {}
): Promise<string> {
  const { maxTokens = 2000, webSearch = true } = opts;

  const body: Record<string, unknown> = {
    model: MODEL,
    max_tokens: maxTokens,
    messages: [{ role: 'user', content: prompt }],
  };
  if (webSearch) {
    body.tools = [{ type: 'web_search_20250305', name: 'web_search' }];
  }

  const res = await fetch(CLAUDE_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error(`API error ${res.status}: ${res.statusText}`);

  const data = await res.json();
  const text = (data.content as { type: string; text?: string }[])
    .filter((c) => c.type === 'text')
    .map((c) => c.text ?? '')
    .join('');

  if (!text.trim()) throw new Error('پاسخ خالی از سرور');
  return text;
}

/** Extract and parse JSON from Claude response */
function extractJSON<T>(text: string): T {
  const cleaned = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
  const start = Math.min(
    cleaned.includes('[') ? cleaned.indexOf('[') : Infinity,
    cleaned.includes('{') ? cleaned.indexOf('{') : Infinity,
  );
  const end = Math.max(cleaned.lastIndexOf(']'), cleaned.lastIndexOf('}'));
  if (start === Infinity || end === -1) throw new Error('JSON یافت نشد در پاسخ');
  return JSON.parse(cleaned.slice(start, end + 1));
}

// ─── Live Prices ──────────────────────────────────────────────────────────────

/**
 * Fetches LIVE prices for a product from Iranian stores via Claude + web search.
 * This is called when a user opens a product detail page.
 * NEVER returns fake or cached prices.
 */
export async function fetchLivePrices(
  product: ProductCatalogItem
): Promise<LiveProductDetail> {
  const text = await callClaude(
    `You are a live price aggregator for Iranian e-commerce (mid-2025).

Product: "${product.name}" by ${product.brand}

Use web_search to find CURRENT prices from Iranian stores:
digikala.com, technolife.ir, torob.com, basalam.com, emalls.ir, snapp.market, digistyle.com

Return ONLY valid JSON — no markdown:
{
  "title": "exact product name in Farsi",
  "minPrice": <lowest_toman_price_integer>,
  "avgPrice": <average_toman_price_integer>,
  "maxPrice": <highest_toman_price_integer>,
  "priceChange": <weekly_change_percent_or_null>,
  "storePrices": [
    {
      "storeId": "digikala",
      "price": <toman_integer>,
      "inStock": <boolean>,
      "url": "<real_product_or_search_url>",
      "warranty": "<warranty_info_or_null>"
    }
  ],
  "history": [<8_weekly_prices_oldest_first_null_if_unknown>],
  "historyLabels": ["۱ تیر","۵ تیر","۱۰ تیر","۱۵ تیر","۱۸ تیر","۲۰ تیر","۲۵ تیر","امروز"],
  "aiAnalysis": {
    "buyingScore": <0_to_100>,
    "recommendation": "buy_now|wait|avoid",
    "recommendationText": "<one_sentence_Persian>",
    "reasons": [{"type":"positive|warning|negative","text":"<Persian>"}],
    "priceDropProbability": <0_to_100>,
    "stockShortageProbability": <0_to_100>,
    "estimatedFutureTrend": "rising|falling|stable"
  },
  "sources": ["digikala","technolife"]
}

RULES:
- Only include stores where you actually found the product via web search
- Omit stores with no results
- If NO prices found anywhere return: {"error": "prices_not_found"}
- All prices must be in Tomans (not Rials)`,
    { maxTokens: 2500, webSearch: true }
  );

  const data = extractJSON<LiveProductDetail & { error?: string }>(text);

  if (data.error === 'prices_not_found') {
    throw new Error(
      'قیمت لحظه‌ای دریافت نشد. لطفاً مستقیماً به فروشگاه‌ها مراجعه کنید.'
    );
  }

  // Filter out null/zero prices
  data.storePrices = (data.storePrices ?? []).filter(
    (s) => s.price != null && s.price > 0
  );

  if (!data.storePrices.length) {
    throw new Error(
      'هیچ فروشگاهی قیمت این محصول را ندارد. مستقیماً به سایت‌ها مراجعه کنید.'
    );
  }

  return {
    ...data,
    productId: product.id,
    brand: product.brand,
    cat: product.cat,
    emoji: product.emoji,
    fetchedAt: new Date().toISOString(),
  };
}

// ─── Search ───────────────────────────────────────────────────────────────────

/**
 * Search for products not found in local catalog.
 * Returns catalog metadata ONLY — no prices.
 */
export async function searchProductsAI(
  query: string
): Promise<ProductCatalogItem[]> {
  const text = await callClaude(
    `Iranian price comparison site. User searched: "${query}"
Find relevant digital/tech products sold in Iran.
Return ONLY a valid JSON array — no prices, no markdown:
[{
  "id": "lowercase-slug",
  "name": "نام کامل به فارسی",
  "brand": "Brand",
  "cat": "گوشی|لپ‌تاپ|هدفون|گیمینگ|ساعت|تبلت|اکسسوری|ذخیره‌سازی|سایر",
  "emoji": "single emoji",
  "stores": <integer 1-300>,
  "hot": <boolean>
}]
Return [] if nothing relevant found.`,
    { maxTokens: 800, webSearch: false }
  );

  const items = extractJSON<ProductCatalogItem[]>(text);
  return Array.isArray(items) ? items : [];
}

// ─── Price History ────────────────────────────────────────────────────────────

export async function fetchPriceHistory(
  product: ProductCatalogItem,
  days: 7 | 30 | 90 | 365
): Promise<{ prices: (number | null)[]; labels: string[] }> {
  const text = await callClaude(
    `Iranian e-commerce price history for: "${product.name}" by ${product.brand}
Period: last ${days} days. Use web search to find price trends on digikala.com and torob.com.

Return ONLY valid JSON — no markdown:
{
  "prices": [<${Math.min(days, 30)} price points in Tomans, oldest first, null if unknown>],
  "labels": [<matching date labels in Persian shorthand>]
}
If no history found: {"prices": [], "labels": []}`,
    { maxTokens: 600, webSearch: true }
  );

  const data = extractJSON<{ prices: (number | null)[]; labels: string[] }>(text);
  return {
    prices: Array.isArray(data.prices) ? data.prices : [],
    labels: Array.isArray(data.labels) ? data.labels : [],
  };
}
