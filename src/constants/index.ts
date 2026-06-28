import type { ProductCatalogItem, ProductCategory } from '@/types';

// ─── Iranian Stores ───────────────────────────────────────────────────────────
// Only metadata here — NO prices
export const STORES = {
  digikala:   { name: 'دیجی‌کالا',    emoji: '🔴', trust: 4.8, delivery: '۲-۳ روز', searchUrl: 'https://www.digikala.com/search/?q=', isOfficial: true },
  technolife: { name: 'تکنولایف',    emoji: '🔷', trust: 4.4, delivery: '۲-۴ روز', searchUrl: 'https://technolife.ir/search?q=',     isOfficial: true },
  basalam:    { name: 'باسلام',      emoji: '🟢', trust: 4.2, delivery: '۳-۵ روز', searchUrl: 'https://basalam.com/search?q=',        isOfficial: true },
  torob:      { name: 'ترب',         emoji: '🟡', trust: 4.0, delivery: '۲-۵ روز', searchUrl: 'https://torob.com/search/?query=',     isOfficial: true },
  emalls:     { name: 'ایمالز',      emoji: '🔵', trust: 4.1, delivery: '۲-۴ روز', searchUrl: 'https://emalls.ir/search?q=',          isOfficial: true },
  snapp:      { name: 'اسنپ مارکت', emoji: '🟣', trust: 4.3, delivery: '۱-۲ روز', searchUrl: 'https://snapp.market/search?q=',       isOfficial: true },
  digistyle:  { name: 'دیجی‌استایل', emoji: '⚫', trust: 4.5, delivery: '۲-۳ روز', searchUrl: 'https://digistyle.com/search?q=',     isOfficial: true },
  tmarket:    { name: 'تی‌مارکت',   emoji: '🔶', trust: 3.9, delivery: '۳-۵ روز', searchUrl: 'https://tmarket.ir/search?q=',         isOfficial: false },
  bamilo:     { name: 'بامیلو',      emoji: '🟠', trust: 4.0, delivery: '۳-۵ روز', searchUrl: 'https://bamilo.com/search?q=',         isOfficial: false },
  mobile140:  { name: 'موبایل ۱۴۰', emoji: '📞', trust: 3.8, delivery: '۳-۶ روز', searchUrl: 'https://mobile140.com/search?s=',      isOfficial: false },
} as const;

export type StoreId = keyof typeof STORES;

// ─── Product Catalog ──────────────────────────────────────────────────────────
// Names, categories, store counts ONLY — zero prices
export const CATALOG: ProductCatalogItem[] = [
  // گوشی
  { id: 'iphone15',      name: 'آیفون ۱۵ ۱۲۸ گیگابایت (نات اکتیو)',     brand: 'Apple',     cat: 'گوشی',       emoji: '📱', stores: 49,  hot: true  },
  { id: 'iphone15pro',   name: 'آیفون ۱۵ پرو ۲۵۶ گیگابایت (نات اکتیو)', brand: 'Apple',     cat: 'گوشی',       emoji: '📱', stores: 15,  hot: true  },
  { id: 's24fe',         name: 'سامسونگ Galaxy S24 FE 256GB',            brand: 'Samsung',   cat: 'گوشی',       emoji: '📱', stores: 37,  hot: true  },
  { id: 's24ultra',      name: 'سامسونگ Galaxy S24 Ultra 256GB',         brand: 'Samsung',   cat: 'گوشی',       emoji: '📱', stores: 21,  hot: true  },
  { id: 'a56',           name: 'سامسونگ Galaxy A56 5G 256GB',            brand: 'Samsung',   cat: 'گوشی',       emoji: '📱', stores: 223, hot: true  },
  { id: 'a36',           name: 'سامسونگ Galaxy A36 5G 256GB',            brand: 'Samsung',   cat: 'گوشی',       emoji: '📱', stores: 191, hot: false },
  { id: 'pixel8',        name: 'گوگل Pixel 8 128GB',                     brand: 'Google',    cat: 'گوشی',       emoji: '📱', stores: 5,   hot: false },
  // لپ‌تاپ
  { id: 'macbookairm3',  name: 'مک‌بوک ایر M3 13 اینچ 8GB 256GB',       brand: 'Apple',     cat: 'لپ‌تاپ',     emoji: '💻', stores: 19,  hot: true  },
  { id: 'macbookprom3',  name: 'مک‌بوک پرو M3 14 اینچ 18GB 512GB',      brand: 'Apple',     cat: 'لپ‌تاپ',     emoji: '💻', stores: 7,   hot: false },
  { id: 'zenbook14',     name: 'ایسوس ZenBook 14 OLED i7 16GB',          brand: 'Asus',      cat: 'لپ‌تاپ',     emoji: '💻', stores: 7,   hot: false },
  { id: 'dellxps15',     name: 'دل XPS 15 i7 16GB RTX 4060',             brand: 'Dell',      cat: 'لپ‌تاپ',     emoji: '💻', stores: 3,   hot: false },
  // هدفون
  { id: 'g733',          name: 'هدست گیمینگ لاجیتک G733 LIGHTSPEED',    brand: 'Logitech',  cat: 'هدفون',      emoji: '🎧', stores: 23,  hot: true  },
  { id: 'g535',          name: 'هدست گیمینگ لاجیتک G535 بی‌سیم',       brand: 'Logitech',  cat: 'هدفون',      emoji: '🎧', stores: 4,   hot: false },
  { id: 'gprox2',        name: 'هدست لاجیتک G Pro X 2 LIGHTSPEED',      brand: 'Logitech',  cat: 'هدفون',      emoji: '🎧', stores: 15,  hot: false },
  { id: 'hyperxcloud2',  name: 'هدست گیمینگ HyperX Cloud II',            brand: 'HyperX',    cat: 'هدفون',      emoji: '🎧', stores: 22,  hot: true  },
  { id: 'xm5',           name: 'هدفون بی‌سیم سونی WH-1000XM5',          brand: 'Sony',      cat: 'هدفون',      emoji: '🎧', stores: 41,  hot: true  },
  { id: 'airpodspro2',   name: 'ایرپاد پرو نسل ۲ USB-C',               brand: 'Apple',     cat: 'هدفون',      emoji: '🎵', stores: 76,  hot: true  },
  { id: 'airpods3',      name: 'ایرپاد نسل سوم MagSafe',                brand: 'Apple',     cat: 'هدفون',      emoji: '🎵', stores: 7,   hot: false },
  { id: 'buds2pro',      name: 'سامسونگ Galaxy Buds2 Pro',               brand: 'Samsung',   cat: 'هدفون',      emoji: '🎵', stores: 10,  hot: false },
  // گیمینگ
  { id: 'ps5',           name: 'کنسول پلی‌استیشن ۵ Slim Digital',       brand: 'Sony',      cat: 'گیمینگ',     emoji: '🎮', stores: 234, hot: true  },
  { id: 'xboxseriesx',   name: 'کنسول Xbox Series X 1TB',                brand: 'Microsoft', cat: 'گیمینگ',     emoji: '🎮', stores: 36,  hot: false },
  { id: 'switcholed',    name: 'نینتندو Switch OLED مدل سفید',           brand: 'Nintendo',  cat: 'گیمینگ',     emoji: '🕹️', stores: 35,  hot: true  },
  { id: 'steamdeck',     name: 'Steam Deck OLED 512GB',                  brand: 'Valve',     cat: 'گیمینگ',     emoji: '🎮', stores: 6,   hot: false },
  { id: 'lg27gp850',     name: 'مانیتور گیمینگ LG 27GP850 165Hz IPS',   brand: 'LG',        cat: 'گیمینگ',     emoji: '🖥️', stores: 9,   hot: true  },
  { id: 'odysseyg5',     name: 'مانیتور سامسونگ Odyssey G5 27 اینچ',    brand: 'Samsung',   cat: 'گیمینگ',     emoji: '🖥️', stores: 29,  hot: true  },
  // ساعت
  { id: 'watch9',        name: 'اپل واچ Series 9 GPS 41mm',              brand: 'Apple',     cat: 'ساعت',       emoji: '⌚', stores: 7,   hot: false },
  { id: 'watch9cell',    name: 'اپل واچ Series 9 Cellular 45mm',         brand: 'Apple',     cat: 'ساعت',       emoji: '⌚', stores: 5,   hot: false },
  { id: 'galaxywatch6',  name: 'سامسونگ Galaxy Watch 6 Classic 47mm',    brand: 'Samsung',   cat: 'ساعت',       emoji: '⌚', stores: 10,  hot: false },
  // تبلت
  { id: 'ipadairm2',     name: 'آیپد ایر ۱۱ اینچ M2 WiFi 256GB',        brand: 'Apple',     cat: 'تبلت',       emoji: '📟', stores: 7,   hot: true  },
  { id: 'ipadprom4',     name: 'آیپد پرو ۱۱ اینچ M4 WiFi 256GB',        brand: 'Apple',     cat: 'تبلت',       emoji: '📟', stores: 13,  hot: true  },
  { id: 'tabs9',         name: 'سامسونگ Galaxy Tab S9 256GB',            brand: 'Samsung',   cat: 'تبلت',       emoji: '📟', stores: 3,   hot: false },
  // اکسسوری
  { id: 'magickeyboard', name: 'Magic Keyboard فارسی با Touch ID',       brand: 'Apple',     cat: 'اکسسوری',    emoji: '⌨️', stores: 6,   hot: false },
  { id: 'magicmouse',    name: 'Magic Mouse 3 Multi-Touch',              brand: 'Apple',     cat: 'اکسسوری',    emoji: '🖱️', stores: 7,   hot: false },
  { id: 'airtag4',       name: 'اپل AirTag بسته ۴ عددی',                brand: 'Apple',     cat: 'اکسسوری',    emoji: '🔵', stores: 8,   hot: false },
  { id: 'mxmaster3',     name: 'موس لاجیتک MX Master 3S',               brand: 'Logitech',  cat: 'اکسسوری',    emoji: '🖱️', stores: 59,  hot: true  },
  { id: 'mxkeys',        name: 'کیبورد لاجیتک MX Keys S',               brand: 'Logitech',  cat: 'اکسسوری',    emoji: '⌨️', stores: 8,   hot: false },
  { id: 'deathadder',    name: 'موس گیمینگ Razer DeathAdder V3',         brand: 'Razer',     cat: 'اکسسوری',    emoji: '🖱️', stores: 12,  hot: true  },
  { id: 'razerkraken',   name: 'هدست Razer BlackShark V2 Pro',           brand: 'Razer',     cat: 'اکسسوری',    emoji: '🎧', stores: 6,   hot: false },
  // ذخیره‌سازی
  { id: 'ssd1tb',        name: 'SSD کینگستون NV3 1 ترابایت NVMe',       brand: 'Kingston',  cat: 'ذخیره‌سازی', emoji: '💾', stores: 3,   hot: true  },
  { id: 'ssd2tb',        name: 'SSD سامسونگ 990 Pro 2 ترابایت',         brand: 'Samsung',   cat: 'ذخیره‌سازی', emoji: '💾', stores: 68,  hot: false },
  { id: 'ram32',         name: 'رم دسکتاپ کینگستون Fury 32GB DDR5',     brand: 'Kingston',  cat: 'ذخیره‌سازی', emoji: '🧮', stores: 4,   hot: false },
  { id: 'usbchub',       name: 'هاب USB-C اپل Multiport 7-in-1',        brand: 'Apple',     cat: 'اکسسوری',    emoji: '🔌', stores: 8,   hot: false },
];

// ─── Config ───────────────────────────────────────────────────────────────────

export const APP_CONFIG = {
  name: 'قیمت‌یار',
  nameEn: 'PriceWise Iran',
  tagline: 'مقایسه قیمت لحظه‌ای از ۵۰۰+ فروشگاه ایران',
  maxCompare: 4,
  maxAlerts: 20,
  maxRecentlyViewed: 10,
  refreshIntervalMs: 5 * 60 * 1000,
} as const;

export const CATEGORIES: ProductCategory[] = [
  'گوشی', 'لپ‌تاپ', 'هدفون', 'گیمینگ',
  'ساعت', 'تبلت', 'اکسسوری', 'ذخیره‌سازی', 'دوربین',
];

export const CATEGORY_EMOJIS: Record<ProductCategory, string> = {
  'گوشی': '📱', 'لپ‌تاپ': '💻', 'هدفون': '🎧', 'گیمینگ': '🎮',
  'ساعت': '⌚', 'تبلت': '📟', 'اکسسوری': '🖱️',
  'ذخیره‌سازی': '💾', 'دوربین': '📷', 'سایر': '📦',
};

export const QUICK_SEARCHES = [
  { label: 'G733',       query: 'Logitech G733',  emoji: '🎧' },
  { label: 'آیفون ۱۵',  query: 'iPhone 15',       emoji: '📱' },
  { label: 'PS5',        query: 'PlayStation 5',   emoji: '🎮' },
  { label: 'مک‌بوک',    query: 'MacBook Air M3',  emoji: '💻' },
  { label: 'ایرپاد پرو', query: 'AirPods Pro 2',  emoji: '🎵' },
  { label: 'MX Master',  query: 'MX Master 3S',    emoji: '🖱️' },
  { label: 'SSD',        query: 'Kingston NV3 SSD',emoji: '💾' },
  { label: 'اپل واچ',   query: 'Apple Watch S9',  emoji: '⌚' },
] as const;
