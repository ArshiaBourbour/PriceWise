'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LogOut, Heart, Bell, GitCompare, Clock, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  useAuthStore, useWishlistStore, useNotifStore,
  useCompareStore, useAlertsStore, useRecentlyViewedStore,
} from '@/store';
import { relativeTime } from '@/utils';
import { EmptyState } from '@/components/ui/States';

export default function DashboardPage() {
  const router = useRouter();
  const { isLoggedIn, user, logout } = useAuthStore();
  const wishlist = useWishlistStore((s) => s.items);
  const unread = useNotifStore((s) => s.unreadCount());
  const cmpCount = useCompareStore((s) => s.items.length);
  const { alerts, remove: removeAlert } = useAlertsStore();
  const { items: recent } = useRecentlyViewedStore();

  useEffect(() => {
    if (!isLoggedIn) router.push('/login');
  }, [isLoggedIn]);

  if (!isLoggedIn || !user) return null;

  const initial = user.name.charAt(0).toUpperCase();
  const stats = [
    { icon: '❤️', label: 'علاقه‌مندی', value: wishlist.length, href: '/wishlist' },
    { icon: '🔔', label: 'اعلان خوانده‌نشده', value: unread, href: '/notifications' },
    { icon: '⚖️', label: 'در مقایسه', value: cmpCount, href: '/compare' },
    { icon: '🔔', label: 'هشدار فعال', value: alerts.filter((a) => a.isActive).length, href: '#' },
  ];

  return (
    <div className="px-5 py-6 max-w-xl mx-auto">
      {/* Profile header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 p-5 rounded-3xl mb-6"
        style={{
          background: 'linear-gradient(135deg,rgba(99,102,241,0.08),rgba(139,92,246,0.05))',
          border: '1px solid rgba(99,102,241,0.3)',
        }}
      >
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-black text-white shrink-0"
          style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 4px 16px rgba(99,102,241,0.3)' }}
        >
          {initial}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[18px] font-bold">{user.name}</div>
          <div className="text-[12.5px] text-white/40 truncate">{user.email}</div>
          <div className="text-[10.5px] text-white/25 mt-0.5">
            عضو از {new Date(user.joinedAt).toLocaleDateString('fa-IR')}
          </div>
        </div>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            onClick={() => s.href !== '#' && router.push(s.href)}
            className="glass-card-hover text-center p-3 cursor-pointer rounded-2xl"
          >
            <div className="text-xl mb-1">{s.icon}</div>
            <div className="text-[20px] font-black" style={{ color: '#6366f1' }}>{s.value}</div>
            <div className="text-[9px] text-white/30 mt-0.5 leading-tight">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Recently viewed */}
      <section className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Clock size={14} className="text-white/40" />
          <h2 className="text-[13px] font-semibold">آخرین بازدیدها</h2>
        </div>
        {!recent.length ? (
          <div className="text-center py-6 text-[13px] text-white/30">هنوز محصولی مشاهده نکردی</div>
        ) : (
          <div className="flex flex-col gap-2">
            {recent.slice(0, 5).map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => router.push(`/product/${p.id}`)}
                className="glass-card-hover flex items-center gap-3 p-3 cursor-pointer rounded-2xl"
              >
                <div className="text-2xl shrink-0">{p.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-[12.5px] font-medium truncate">{p.name}</div>
                  <div className="text-[10.5px] text-white/35">{p.brand}</div>
                </div>
                <div className="text-[11px] font-medium shrink-0" style={{ color: '#6366f1' }}>
                  مشاهده قیمت ↗
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Active alerts */}
      {alerts.length > 0 && (
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Bell size={14} className="text-white/40" />
            <h2 className="text-[13px] font-semibold">هشدارهای فعال</h2>
          </div>
          <div className="flex flex-col gap-2">
            {alerts.filter((a) => a.isActive).map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center gap-3 p-3 rounded-2xl"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)' }}
              >
                <span className="text-xl shrink-0">{a.productEmoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-[12.5px] font-medium truncate">{a.productName}</div>
                  <div className="text-[11px]" style={{ color: '#6366f1' }}>
                    هدف: {a.targetPrice.toLocaleString('fa-IR')} تومان
                  </div>
                </div>
                <button
                  onClick={() => { removeAlert(a.id); toast.info('هشدار حذف شد'); }}
                  className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all shrink-0"
                >
                  <Trash2 size={13} />
                </button>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Logout */}
      <button
        onClick={() => { logout(); toast.success('از حساب خارج شدید'); router.push('/'); }}
        className="w-full py-3 rounded-2xl text-[14px] font-semibold flex items-center justify-center gap-2 transition-all"
        style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#ef4444' }}
      >
        <LogOut size={15} />
        خروج از حساب
      </button>
    </div>
  );
}
