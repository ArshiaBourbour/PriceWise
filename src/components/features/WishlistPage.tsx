'use client';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useWishlistStore } from '@/store';
import { EmptyState } from '@/components/ui/States';

export default function WishlistPage() {
  const router = useRouter();
  const { items, remove } = useWishlistStore();

  return (
    <div className="px-5 py-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-[18px] font-bold">❤️ علاقه‌مندی‌های من</h1>
          <p className="text-[12px] text-white/35 mt-0.5">{items.length} مورد</p>
        </div>
        <button onClick={() => router.push('/')}
          className="text-[12px] px-4 py-1.5 rounded-xl font-medium"
          style={{ background: 'rgba(99,102,241,0.13)', border: '1px solid rgba(99,102,241,0.38)', color: '#6366f1' }}>
          + افزودن
        </button>
      </div>

      {!items.length ? (
        <EmptyState icon="🤍" title="علاقه‌مندی خالی است"
          body="روی 🤍 روی کارت‌های محصول کلیک کن تا اینجا اضافه بشه" />
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((item, i) => (
            <motion.div key={item.id}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => router.push(`/product/${item.productId}`)}
              className="glass-card-hover flex items-center gap-3 p-3 cursor-pointer"
            >
              <div className="text-3xl shrink-0">{item.emoji}</div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold truncate">{item.name}</div>
                <div className="text-[11px] text-white/35 mt-0.5">{item.brand} · {item.cat}</div>
              </div>
              <div className="text-left shrink-0">
                <div className="text-[11px] font-medium mb-1" style={{ color: '#6366f1' }}>مشاهده قیمت ↗</div>
                <div className="text-[10px] text-white/25">{item.stores} فروشگاه</div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); remove(item.productId); toast.info('حذف شد'); }}
                className="p-1.5 rounded-lg text-white/35 hover:text-red-400 hover:bg-red-500/10 transition-all shrink-0"
              >
                <Trash2 size={13} />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
