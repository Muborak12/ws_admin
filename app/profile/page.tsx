"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { formatDate } from "@/lib/utils";
import {
  User as UserIcon,
  Mail,
  Calendar,
  ShieldCheck,
  Package,
  Camera,
  LogOut,
  Loader2,
  Save,
  CheckCircle,
} from "lucide-react";

export default function ProfilePage() {
  const { user, isAdmin, updateProfileName, updateAvatar, logout } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [savingName, setSavingName] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Sync state with user
  React.useEffect(() => {
    if (user?.name) setName(user.name);
  }, [user?.name]);

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || name.trim().length < 2) return;
    setSavingName(true);
    try {
      await updateProfileName(name.trim());
    } finally {
      setSavingName(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    try {
      await updateAvatar(file);
    } finally {
      setUploadingAvatar(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center space-y-4">
            <UserIcon className="w-12 h-12 text-slate-600 mx-auto" />
            <h2 className="text-xl font-bold">Avval hisobingizga kiring</h2>
            <Link
              href="/login"
              className="inline-block px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
            >
              Kirish sahifasi
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />
      <CartDrawer />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Header Profile Card */}
        <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/30 to-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col sm:flex-row items-center gap-6">
          {/* Avatar container */}
          <div className="relative group shrink-0">
            <div className="w-28 h-28 rounded-3xl bg-slate-800 border-2 border-indigo-500/40 overflow-hidden flex items-center justify-center text-3xl font-extrabold text-indigo-300 shadow-xl">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                user.name?.charAt(0).toUpperCase() || "U"
              )}
            </div>

            {/* Upload avatar button overlay */}
            <label
              className="absolute inset-0 rounded-3xl bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white cursor-pointer transition-all backdrop-blur-xs"
              title="Avatarni yangilash"
            >
              {uploadingAvatar ? (
                <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
              ) : (
                <>
                  <Camera className="w-6 h-6 text-indigo-300 mb-1" />
                  <span className="text-[10px] font-medium">O'zgartirish</span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                disabled={uploadingAvatar}
                className="hidden"
              />
            </label>
          </div>

          {/* User Details */}
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-black text-white">{user.name}</h1>
              <span
                className={`px-3 py-0.5 rounded-full text-xs font-bold ${
                  isAdmin
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                    : "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                }`}
              >
                {user.role}
              </span>
            </div>

            <p className="text-xs text-slate-400 flex items-center justify-center sm:justify-start gap-2">
              <Mail className="w-3.5 h-3.5 text-slate-500" />
              {user.email}
            </p>

            <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start gap-2">
              <Calendar className="w-3.5 h-3.5" />
              Ro'yxatdan o'tgan: {formatDate(user.createdAt)}
            </p>
          </div>

          {/* Admin badge / action */}
          {isAdmin && (
            <Link
              href="/admin"
              className="px-5 py-2.5 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold flex items-center gap-2 transition-all shadow-lg"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Panelga o'tish</span>
            </Link>
          )}
        </div>

        {/* Edit Name & Account Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Edit Name Form */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-indigo-400" />
              Profil ma'lumotlarini tahrirlash
            </h3>

            <form onSubmit={handleUpdateName} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Ismingiz
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Elektron pochta (Email)
                </label>
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950/50 border border-slate-800/80 text-slate-500 text-sm cursor-not-allowed"
                />
                <span className="text-[11px] text-slate-600 mt-1 block">
                  Elektron pochtani o'zgartirib bo'lmaydi.
                </span>
              </div>

              <button
                type="submit"
                disabled={savingName || name === user.name}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {savingName ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>O'zgarishlarni saqlash</span>
              </button>
            </form>
          </div>

          {/* Quick Shortcuts */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white">
                Tezkor havolalar va hisob
              </h3>

              <div className="space-y-2">
                <Link
                  href="/orders"
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-indigo-500/40 text-slate-200 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                      <Package className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold block">Buyurtmalar tarixi</span>
                      <span className="text-[11px] text-slate-500">
                        Barcha buyurtmalarni kuzatish
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-indigo-400 group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </Link>

                <div className="p-4 rounded-2xl bg-slate-950/30 border border-slate-800/60 text-xs text-slate-400 space-y-1">
                  <div className="flex justify-between">
                    <span>Xavfsizlik darajasi:</span>
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Yuqori
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sessiya holati:</span>
                    <span className="text-slate-300 font-mono">Faol (JWT)</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={logout}
              className="w-full py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Hisobdan chiqish</span>
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
