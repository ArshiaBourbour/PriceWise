'use client';
import { motion } from 'framer-motion';
import { Heart, GitCompare } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useWishlistStore, useCompareStore } from '@/store';
import { cn } from '@/utils';
import { toast } from 'sonner';
import type { ProductCatalogItem } from '@/types';

interface ProductCardProps {
  product: ProductCatalogItem;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const router = useRouter();
  const { add: addWish, remove: removeWish, has: inWish } = useWishlistStore();
  const { add: addCmp, remove: removeCmp, has: inCmp, items: cmpItems } = useCompareStore();

  const isWished = inWish(product.id);
  const isCompared = inCmp(product.id);

  const handleWish = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isWished) {
      removeWish(product.id);
      toast.info('از علاقه‌مندی‌ها حذف شد');
    } else {
      addWish(product);
      toast.success('به علاقه‌مندی‌ها اضافه شد ❤️');
    }
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCompared) {
      removeCmp(product.id);
      toast.info('از مقایسه حذف شد');
    } else {
      const ok = addCmp(product);
      if (!ok) {
        toast.error(cmpItems.length >= 4 ? 'حداکثر ۴ محصول قابل مقایسه است' : 'قبلاً اضافه شده');
      } else {
        toast.success('به مقایسه اضافه شد ⚖️');
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, type: 'spring', stiffness: 300, damping: 30 }}
      whileHover={{ y: -3 }}
      onClick={() => router.push(`/product/${product.id}`)}
      className="glass-card-hover cursor-pointer relative overflow-hidden group"
      style={{ padding: '13px' }}
    >
      {/* Hot badge */}
      {product.hot && (
        <div
          className="absolute top-2 left-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full"
          style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)', color: '#f59e0b' }}
        >
          🔥 داغ
        </div>
      )}

      {/* Wishlist btn */}
      <button
        onClick={handleWish}
        className={cn(
          'absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all',
          'opacity-0 group-hover:opacity-100',
          isWished && 'opacity-100 bg-red-500/10 text-red-400',
          !isWished && 'bg-white/8 text-white/50 hover:text-red-400'
        )}
        style={{ backdropFilter: 'blur(8px)' }}
        aria-label="علاقه‌مندی"
      >
        <Heart size={12} fill={isWished ? 'currentColor' : 'none'} />
      </button>

      {/* Image area */}
      <div
        className="aspect-square rounded-xl flex items-center justify-center text-4xl mb-3 transition-transform duration-200 group-hover:scale-105"
        style={{ background: 'rgba(255,255,255,0.06)' }}
      >
        {product.emoji}
      </div>

      {/* Info */}
      <div className="text-[10px] text-white/35 mb-1 font-medium">{product.brand}</div>
      <div className="text-[11.5px] text-white/62 leading-[1.5] mb-2 min-h-[34px]">
        {product.name}
      </div>

      {/* Price: never shown from static data — only "view live price" */}
      <div className="text-[11px] font-medium mb-1.5" style={{ color: '#6366f1' }}>
        مشاهده قیمت لحظه‌ای ↗
      </div>

      <div className="flex items-center justify-between text-[10px] text-white/35">
        <span>{product.stores} فروشگاه</span>
        {product.hot && <span style={{ color: '#f59e0b' }}>پرطرفدار</span>}
      </div>

      {/* Compare btn */}
      <button
        onClick={handleCompare}
        className={cn(
          'w-full mt-2 py-1 rounded-lg text-[10px] transition-all',
          isCompared
            ? 'bg-indigo-500/15 border border-indigo-500/40 text-indigo-400'
            : 'bg-white/5 border border-white/9 text-white/35 hover:border-indigo-500/40 hover:text-indigo-400'
        )}
      >
        {isCompared ? '✓ در مقایسه' : '⚖️ مقایسه'}
      </button>
    </motion.div>
  );
}
