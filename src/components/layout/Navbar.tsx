'use client';
import { useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Heart, Bell, GitCompare, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useWishlistStore, useNotifStore, useCompareStore, useAuthStore } from '@/store';
import { cn } from '@/utils';
import { toast } from 'sonner';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [q, setQ] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const wishCount = useWishlistStore((s) => s.items.length);
  const unread = useNotifStore((s) => s.unreadCount());
  const cmpCount = useCompareStore((s) => s.items.length);
  const { isLoggedIn, user, logout } = useAuthStore();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    router.push(`/search?q=${encodeURIComponent(q.trim())}`);
    setQ('');
    inputRef.current?.blur();
  };

  const tabs = [
    { href: '/',             label: 'خانه',         icon: null },
    { href: '/compare',      label: '⚖️ مقایسه',    icon: null, badge: cmpCount >= 2 ? cmpCount : 0 },
    { href: '/wishlist',     label: 'علاقه‌مندی',   icon: null, badge: wishCount },
    { href: '/notifications',label: 'اعلان',        icon: null, badge: unread },
  ];

  return (
    <nav
      className="sticky top-0 z-50 flex items-center gap-3 px-5 h-[58px]"
      style={{
        background: 'rgba(7,7,14,0.88)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(255,255,255,0.09)',
      }}
    >
      {/* Logo */}
      <Link
        href="/"
        className="text-[17px] font-black shrink-0 tracking-tight transition-opacity hover:opacity-80"
        style={{ color: '#6366f1' }}
      >
        قیمت<span className="text-white/95">یار</span>
      </Link>

      {/* Search */}
      <form
        onSubmit={handleSearch}
        className="flex-1 max-w-[440px] flex items-center gap-0 rounded-full px-4 py-1.5 transition-all"
        style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.09)' }}
      >
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="جستجو در ۵۰۰+ فروشگاه ایران..."
          className="flex-1 bg-transparent border-none outline-none text-white/95 text-[13px] placeholder-white/35 font-vazir min-w-0"
          dir="rtl"
        />
        <button
          type="submit"
          className="text-[12px] font-bold text-white px-3 py-1.5 rounded-full shrink-0"
          style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}
        >
          جستجو
        </button>
      </form>

      {/* Tabs */}
      <div className="flex items-center gap-0.5 shrink-0">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                'relative text-[12.5px] px-2.5 py-1.5 rounded-lg transition-all whitespace-nowrap',
                isActive ? 'text-white' : 'text-white/60 hover:text-white hover:bg-white/5'
              )}
            >
              {tab.label}
              {isActive && (
                <span
                  className="absolute bottom-[-1px] right-2.5 left-2.5 h-0.5 rounded-t-sm"
                  style={{ background: 'linear-gradient(90deg,#6366f1,#8b5cf6)' }}
                />
              )}
              {!!tab.badge && (
                <span className="absolute top-0.5 left-0.5 min-w-[16px] h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center px-1 border-2 border-[#07070e]">
                  {tab.badge}
                </span>
              )}
            </Link>
          );
        })}

        {/* Auth */}
        {isLoggedIn && user ? (
          <div className="flex items-center gap-1 mr-1">
            <Link
              href="/dashboard"
              className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-white text-[13px] font-bold shrink-0"
              style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}
              title={`داشبورد ${user.name}`}
            >
              {user.name.charAt(0).toUpperCase()}
            </Link>
            <button
              onClick={() => { logout(); toast.success('از حساب خارج شدید'); }}
              className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all"
              title="خروج"
            >
              <LogOut size={14} />
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="text-[12.5px] font-semibold px-3.5 py-1.5 rounded-lg transition-all shrink-0"
            style={{
              background: 'rgba(99,102,241,0.13)',
              border: '1px solid rgba(99,102,241,0.38)',
              color: '#6366f1',
            }}
          >
            ورود
          </Link>
        )}
      </div>
    </nav>
  );
}
