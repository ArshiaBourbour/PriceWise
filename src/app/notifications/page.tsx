'use client';
import { motion } from 'framer-motion';
import { useNotifStore } from '@/store';
import { relativeTime } from '@/utils';
import { EmptyState } from '@/components/ui/States';

const TYPE_ICONS: Record<string, string> = {
  price_drop: '📉', price_rise: '📈', back_in_stock: '📦',
  flash_sale: '⚡', alert_triggered: '🔔', system: 'ℹ️',
};

export default function NotificationsPage() {
  const { notifs, markRead, markAllRead } = useNotifStore();

  return (
    <div className="px-5 py-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-[18px] font-bold">🔔 اعلان‌ها</h1>
        <button onClick={markAllRead}
          className="text-[12px] text-indigo-400 hover:text-indigo-300 transition-colors">
          همه خوانده شد
        </button>
      </div>

      {!notifs.length ? (
        <EmptyState icon="🔔" title="اعلانی وجود ندارد" />
      ) : (
        <div className="flex flex-col gap-2">
          {notifs.map((n, i) => (
            <motion.div key={n.id}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              onClick={() => markRead(n.id)}
              className="rounded-2xl p-4 cursor-pointer transition-all"
              style={{
                background: n.isRead ? 'rgba(255,255,255,0.04)' : 'rgba(99,102,241,0.07)',
                border: `1px solid ${n.isRead ? 'rgba(255,255,255,0.09)' : 'rgba(99,102,241,0.25)'}`,
              }}
            >
              <div className="flex items-start justify-between gap-3 mb-1.5">
                <div className="flex items-start gap-2">
                  <span className="text-base mt-0.5 shrink-0">{TYPE_ICONS[n.type] ?? '📢'}</span>
                  <span className="text-[12.5px] font-semibold">{n.title}</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[10px] text-white/35">{relativeTime(n.time)}</span>
                  {!n.isRead && <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />}
                </div>
              </div>
              <p className="text-[11.5px] text-white/55 leading-relaxed pr-6">{n.body}</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
