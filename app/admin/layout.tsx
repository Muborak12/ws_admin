"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingCart,
  Users,
  Store,
  LogOut,
  ShieldAlert,
  Loader2,
  ChevronRight,
  MessageSquare,
  Palette,
  GitBranch,
  UploadCloud,
  CheckCircle,
} from "lucide-react";
import { useToast } from "@/context/ToastContext";

const NAV_ITEMS = [
  { label: "Boshqaruv markazi", href: "/admin", icon: LayoutDashboard },
  { label: "Mahsulotlar", href: "/admin/products", icon: Package },
  { label: "Kategoriyalar", href: "/admin/categories", icon: Layers },
  { label: "Buyurtmalar", href: "/admin/orders", icon: ShoppingCart },
  { label: "Foydalanuvchilar", href: "/admin/users", icon: Users },
  { label: "Jonli Chat (WS)", href: "/admin/chat", icon: MessageSquare },
  { label: "Dizayn & Sozlamalar", href: "/admin/settings", icon: Palette },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAdmin, loading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const toast = useToast();

  const [pushingGit, setPushingGit] = useState(false);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push("/login");
    }
  }, [loading, user, isAdmin, router]);

  const handleGitPush = async () => {
    if (!confirm("Barcha o'zgarishlarni Git repozitoriyasiga push qilishni xohlaysizmi?")) return;
    setPushingGit(true);
    try {
      const res = await fetch("/api/admin/git-push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          commitMessage: `WS Admin yangilanishlari: ${new Date().toLocaleTimeString("uz-UZ")}`,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message || "Gitga muvaffaqiyatli push qilindi!");
      } else {
        toast.error(data.error || "Git pushda xatolik");
      }
    } catch (err: any) {
      toast.error("Git amallarini bajarishda xatolik yuz berdi");
    } finally {
      setPushingGit(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1c0f0a] text-[#fdf2f4]">
        <Loader2 className="w-8 h-8 text-[#e07a8b] animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#1c0f0a] text-[#fdf2f4] text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-[#e07a8b]/20 border border-[#e07a8b]/30 text-[#e07a8b] flex items-center justify-center">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-white">Ruxsat cheklangan</h2>
        <p className="text-xs text-[#fbcfe8]/70 max-w-md">
          Ushbu sahifaga faqat ADMIN huquqiga ega foydalanuvchilar kira oladi.
        </p>
        <Link
          href="/"
          className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#e07a8b] to-[#3b2219] text-white text-xs font-bold"
        >
          WS do'koni bosh sahifasiga qaytish
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#1c0f0a] text-[#fdf2f4]">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[#fbcfe8]/15 bg-[#25140d]/90 backdrop-blur-2xl flex flex-col justify-between shrink-0 sticky top-0 h-screen z-30">
        <div>
          {/* Logo & Admin badge */}
          <div className="p-6 border-b border-[#fbcfe8]/15">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#3b2219] to-[#e07a8b] p-0.5 shadow-xl">
                <div className="w-full h-full rounded-[14px] bg-[#1c0f0a] flex items-center justify-center">
                  <span className="text-white font-black text-lg">WS</span>
                </div>
              </div>
              <div>
                <span className="text-base font-black text-white tracking-tight block">
                  WS Store
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#e07a8b] bg-[#e07a8b]/15 px-2 py-0.5 rounded-md border border-[#e07a8b]/30">
                  Admin Panel
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-3.5 space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all group ${
                    isActive
                      ? "bg-gradient-to-r from-[#e07a8b] to-[#3b2219] text-white shadow-lg shadow-[#3b2219]/40 border border-[#fbcfe8]/30"
                      : "text-[#fbcfe8]/70 hover:text-white hover:bg-[#341b12]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? "text-white" : "text-[#e07a8b] group-hover:text-white"
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions & Git Push */}
        <div className="p-3.5 border-t border-[#fbcfe8]/15 space-y-2">
          {/* Git Push Action Button */}
          <button
            onClick={handleGitPush}
            disabled={pushingGit}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-2xl bg-gradient-to-r from-[#c59b6d] to-[#8c583e] hover:opacity-95 text-white text-xs font-black shadow-lg shadow-[#8c583e]/30 transition-all disabled:opacity-50 border border-white/20"
            title="Barcha kod va o'zgarishlarni Git repozitoriyasiga avtomatik push qilish"
          >
            {pushingGit ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <UploadCloud className="w-4 h-4" />
            )}
            <span>Gitga Push Qilish</span>
          </button>

          {/* Store front shortcut */}
          <Link
            href="/"
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-[#fbcfe8]/80 hover:text-white hover:bg-[#341b12] transition-colors"
          >
            <Store className="w-4 h-4 text-[#e07a8b]" />
            <span>Mijoz do'koniga qaytish</span>
          </Link>

          {/* User pill */}
          <div className="p-2.5 rounded-2xl bg-[#1c0f0a] border border-[#fbcfe8]/15 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#e07a8b] to-[#3b2219] text-white flex items-center justify-center font-bold text-xs shrink-0">
                {user?.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt=""
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  user?.name?.charAt(0).toUpperCase() || "A"
                )}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">
                  {user?.name}
                </p>
                <p className="text-[10px] text-[#fbcfe8]/50 truncate font-mono">
                  {user?.email}
                </p>
              </div>
            </div>

            <button
              onClick={logout}
              className="p-1.5 text-[#fbcfe8]/60 hover:text-rose-400 rounded-lg hover:bg-white/10 transition-colors"
              title="Chiqish"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-[#1c0f0a]">
        {children}
      </div>
    </div>
  );
}
