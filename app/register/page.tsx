"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Mail, Lock, User, UserPlus, Loader2, ArrowLeft } from "lucide-react";

export default function RegisterPage() {
  const { register, isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
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
    if (!name.trim() || !email.trim() || !password.trim()) return;

    setLoading(true);
    try {
      await register(name.trim(), email.trim(), password);
    } catch {
      // toast inside AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-slate-950 relative overflow-hidden">
      {/* Ambient background lights */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 rounded-full bg-indigo-600/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 rounded-full bg-purple-600/15 blur-3xl pointer-events-none" />

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
            Ro'yxatdan o'tish
          </h1>
          <p className="text-xs text-slate-400">
            Yangi hisob yarating va qulay xaridlardan bahramand bo'ling
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-indigo-400" />
              Ism va familiyangiz
            </label>
            <input
              type="text"
              required
              minLength={2}
              maxLength={50}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ali Valiyev"
              className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>

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
              Parol (kamida 6 ta belgi)
            </label>
            <input
              type="password"
              required
              minLength={6}
              maxLength={72}
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
              <UserPlus className="w-4 h-4" />
            )}
            <span>Ro'yxatdan o'tish</span>
          </button>
        </form>

        {/* Footer info */}
        <div className="pt-4 border-t border-slate-800/80 text-center text-xs text-slate-400">
          <p>
            Akkauntingiz allaqachon bormi?{" "}
            <Link
              href="/login"
              className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
            >
              Tizimga kiring
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
