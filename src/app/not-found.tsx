'use client';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function NotFound() {
  const router = useRouter();
  return (
    <div className="min-h-[calc(100vh-58px)] flex flex-col items-center justify-center text-center px-5">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-[80px] mb-4">🔍</div>
        <h1 className="text-[32px] font-black mb-2">۴۰۴</h1>
        <p className="text-[15px] text-white/55 mb-2">صفحه مورد نظر پیدا نشد</p>
        <p className="text-[13px] text-white/30 mb-8">شاید آدرس اشتباه وارد شده یا صفحه منتقل شده</p>
        <button
          onClick={() => router.push('/')}
          className="px-8 py-3 rounded-2xl text-[14px] font-bold text-white"
          style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}
        >
          برگشت به خانه
        </button>
      </motion.div>
    </div>
  );
}
