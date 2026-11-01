"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Mail, Lock, LogIn, Loader2, ArrowLeft, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const { login, isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect
  React.useEffect(() => {
    if (isAuthenticated) {
      if (isAdmin) router.push("/admin");
      else router.push("/");
    }
  }, [isAuthenticated, isAdmin, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch {
      // toast inside AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-slate-950 relative overflow-hidden">
      {/* Ambient background lights */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-indigo-600/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full bg-purple-600/15 blur-3xl pointer-events-none" />

      {/* Back to home link */}
      <Link
        href="/"
        className="absolute top-8 left-8 flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Bosh sahifaga qaytish
      </Link>

      <div className="w-full max-w-md bg-slate-900/80 border border-slate-800/80 backdrop-blur-2xl rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6 relative z-10">
        {/* Logo and title */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform">
              <span className="text-white font-black text-2xl">X</span>
            </div>
          </Link>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Xush kelibsiz
          </h1>
          <p className="text-xs text-slate-400">
            Hisobingizga kirish uchun login va parolingizni kiriting
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-indigo-400" />
              Elektron pochta
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@shop.uz"
              className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-indigo-400" />
              Parol
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-indigo-500 transition-all font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <LogIn className="w-4 h-4" />
            )}
            <span>Tizimga kirish</span>
          </button>
        </form>

        {/* Tezkor Demo Kirish Tugmalari */}
        <div className="space-y-2 pt-2">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 text-center">
            Tezkor sinov hisoblari:
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => {
                setEmail("admin@shop.uz");
                setPassword("admin123");
              }}
              className="px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold transition-all text-center flex flex-col items-center justify-center"
            >
              <span>👑 Admin Hisobi</span>
              <span className="text-[10px] text-amber-500/80 font-normal">admin@shop.uz</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail("user@shop.uz");
                setPassword("user123");
              }}
              className="px-3 py-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-xs font-bold transition-all text-center flex flex-col items-center justify-center"
            >
              <span>👤 Mijoz Hisobi</span>
              <span className="text-[10px] text-indigo-400/80 font-normal">user@shop.uz</span>
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-4 border-t border-slate-800/80 text-center space-y-3 text-xs text-slate-400">
          <p>
            Hali hisobingiz yo'qmi?{" "}
            <Link
              href="/register"
              className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
            >
              Ro'yxatdan o'ting
            </Link>
          </p>

          <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/60 text-[11px] text-slate-500 text-left space-y-1">
            <div className="flex items-center gap-1 text-slate-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Avtomatik yo'naltirish:</span>
            </div>
            <p>
              Agar kiritilgan hisob <strong>ADMIN</strong> bo'lsa, siz avtomatik ravishda boshqaruv paneliga (<code>/admin</code>) o'tkazilasiz.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
