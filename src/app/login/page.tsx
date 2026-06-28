'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/store';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [shake, setShake] = useState(false);
  const [remember, setRemember] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !pass) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      toast.error('لطفاً همه فیلدها را پر کن');
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    login({
      id: crypto.randomUUID(),
      name: email.split('@')[0],
      email,
      joinedAt: new Date().toISOString(),
    });
    toast.success('✅ با موفقیت وارد شدی! خوش برگشتی 🎉');
    router.push('/dashboard');
  };

  return (
    <div className="min-h-[calc(100vh-58px)] flex flex-col items-center justify-center px-5 py-8 gap-6">

      {/* Robot */}
      <motion.div
        animate={shake ? { x: [-8, 8, -5, 5, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="relative flex flex-col items-center"
      >
        {/* Head */}
        <div className="relative w-32 h-32 rounded-full border-2 flex-shrink-0"
          style={{ background: 'linear-gradient(145deg,#2a2a4a,#1a1a3a)', borderColor: 'rgba(99,102,241,0.4)' }}>

          {/* Antenna */}
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-0.5 h-5"
            style={{ background: 'linear-gradient(to top,rgba(255,255,255,0.4),transparent)' }}>
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full"
              style={{ background: '#6366f1', boxShadow: '0 0 12px #6366f1' }}
            />
          </div>

          {/* Bolts */}
          <div className="absolute top-8 left-3 w-2 h-2 rounded-full border"
            style={{ background: 'linear-gradient(145deg,#3a3a5a,#1a1a3a)', borderColor: 'rgba(99,102,241,0.4)' }} />
          <div className="absolute top-8 right-3 w-2 h-2 rounded-full border"
            style={{ background: 'linear-gradient(145deg,#3a3a5a,#1a1a3a)', borderColor: 'rgba(99,102,241,0.4)' }} />

          {/* Ears */}
          <div className="absolute top-12 -left-1 w-2.5 h-4 border rounded-sm"
            style={{ background: 'linear-gradient(to bottom,#3a3a5a,#1a1a3a)', borderColor: 'rgba(99,102,241,0.4)' }} />
          <div className="absolute top-12 -right-1 w-2.5 h-4 border rounded-sm"
            style={{ background: 'linear-gradient(to bottom,#3a3a5a,#1a1a3a)', borderColor: 'rgba(99,102,241,0.4)' }} />

          {/* Eyes */}
          <div className="absolute top-10 left-1/2 -translate-x-1/2 flex gap-5">
            {[0, 1].map((eye) => (
              <div key={eye} className="relative w-8 h-8 rounded-full overflow-hidden"
                style={{ background: 'radial-gradient(circle at 40% 35%,#e8e8ff,#a0a0c0)', boxShadow: '0 0 8px rgba(99,102,241,0.3)' }}>
                <div className="absolute inset-[-3px] border-2 rounded-full opacity-60"
                  style={{ borderColor: 'rgba(99,102,241,0.4)' }} />
                <motion.div
                  animate={typing ? { height: '100%', borderRadius: '50%' } : { height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute top-0 left-0 w-full"
                  style={{ background: '#2a2a4a' }}
                />
                <div className="absolute w-3.5 h-3.5 rounded-full bottom-1 left-1/2 -translate-x-1/2"
                  style={{ background: 'radial-gradient(circle at 40% 35%,#2a2a4a,#0a0a1a)', opacity: typing ? 0 : 1 }} />
              </div>
            ))}
          </div>

          {/* Mouth LEDs */}
          <div className="absolute bottom-7 left-1/2 -translate-x-1/2 flex gap-1.5">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <motion.span key={i}
                animate={typing ? { opacity: i % 2 === 0 ? 0.3 : 1 } : { opacity: 0.7 }}
                transition={{ duration: 0.3 }}
                className="block w-1.5 h-1 rounded-sm"
                style={{ background: '#6366f1' }}
              />
            ))}
          </div>

          {/* Visor */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-24 h-px opacity-40"
            style={{ background: 'linear-gradient(90deg,transparent,rgba(99,102,241,0.8),transparent)' }} />
        </div>

        {/* Neck */}
        <div className="w-4 h-3 border border-t-0 rounded-b-lg -mt-0.5"
          style={{ background: 'linear-gradient(to bottom,#3a3a5a,#2a2a4a)', borderColor: 'rgba(99,102,241,0.4)' }} />

        {/* Body */}
        <div className="relative w-24 h-12 border-2 rounded-xl -mt-0.5"
          style={{ background: 'linear-gradient(145deg,#2e2e4e,#1e1e3e)', borderColor: 'rgba(99,102,241,0.4)' }}>
          <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-16 h-2 rounded bg-black/30" />
          <motion.div
            animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full"
            style={{ background: 'radial-gradient(circle at 40% 35%,#6366f1,#8b5cf6)', boxShadow: '0 0 10px #6366f1' }}
          />
        </div>
      </motion.div>

      {/* Login card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-[400px] rounded-3xl p-8"
        style={{ background: '#12121e', border: '1px solid rgba(255,255,255,0.09)' }}
      >
        <h2 className="text-[20px] font-black text-center mb-1">خوش اومدی 👋</h2>
        <p className="text-[13px] text-white/40 text-center mb-6">برای ادامه وارد حسابت شو</p>

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-3">
            <label className="text-[12px] text-white/60 font-medium block mb-1.5">ایمیل یا نام کاربری</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              autoComplete="username"
              className="w-full rounded-xl px-4 py-2.5 text-[14px] text-white/95 outline-none transition-all"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', fontFamily: 'Vazirmatn,Tahoma,sans-serif' }}
              onFocus={(e) => { e.target.style.borderColor = 'rgba(99,102,241,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.15)'; }}
              onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.09)'; e.target.style.boxShadow = 'none'; }}
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="text-[12px] text-white/60 font-medium block mb-1.5">رمز عبور</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={pass}
                onChange={(e) => { setPass(e.target.value); setTyping(!!e.target.value); }}
                onFocus={() => setTyping(!!pass)}
                onBlur={() => setTyping(false)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full rounded-xl px-4 py-2.5 text-[14px] text-white/95 outline-none transition-all pl-10"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', fontFamily: 'Vazirmatn,Tahoma,sans-serif' }}
                onFocus={(e) => { e.target.style.borderColor = 'rgba(99,102,241,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.15)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.09)'; e.target.style.boxShadow = 'none'; }}
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/35 hover:text-white/70 transition-colors"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between mb-5">
            <label className="flex items-center gap-2 text-[12px] text-white/55 cursor-pointer">
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)}
                className="accent-indigo-500 w-4 h-4 cursor-pointer" />
              مرا به خاطر بسپار
            </label>
            <button type="button" onClick={() => toast.info('🔗 لینک بازیابی ارسال شد')}
              className="text-[12px] text-indigo-400 hover:text-indigo-300 transition-colors">
              فراموشی رمز؟
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-[14px] font-bold text-white transition-opacity disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}
          >
            {loading ? '⏳ در حال ورود...' : 'ورود به قیمت‌یار'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5 text-[12px] text-white/25">
          <div className="flex-1 h-px bg-white/9" />
          <span>یا</span>
          <div className="flex-1 h-px bg-white/9" />
        </div>

        {/* Social */}
        <button
          onClick={() => toast.info('🔜 ورود با گوگل به‌زودی')}
          className="w-full py-2.5 rounded-xl text-[13px] flex items-center justify-center gap-2 transition-all"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', color: 'rgba(255,255,255,0.7)' }}
        >
          <span className="font-black text-[15px]">G</span> ادامه با گوگل
        </button>

        <p className="text-center text-[12.5px] text-white/35 mt-5">
          حساب نداری؟{' '}
          <button onClick={() => toast.info('📝 صفحه ثبت‌نام به‌زودی')}
            className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors">
            ثبت‌نام کن
          </button>
        </p>
      </motion.div>
    </div>
  );
}
