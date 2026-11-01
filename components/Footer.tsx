import React from "react";
import Link from "next/link";
import { ShieldCheck, Truck, Headphones, Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-[#fbcfe8]/15 bg-[#1b0d08] text-[#fbcfe8]/70">
      {/* Features Bar */}
      <div className="border-b border-[#fbcfe8]/10 bg-[#24130d]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#3b2219] border border-[#fbcfe8]/20 text-[#e07a8b] flex items-center justify-center shrink-0 shadow-md">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">Tezkor yetkazish</h4>
              <p className="text-[11px] text-[#fbcfe8]/60">O'zbekiston bo'ylab 24 soatda bepul</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#3b2219] border border-[#fbcfe8]/20 text-[#e07a8b] flex items-center justify-center shrink-0 shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">Rasmiy kafolat</h4>
              <p className="text-[11px] text-[#fbcfe8]/60">1 yillik rasmiy kafolat bilan</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#3b2219] border border-[#fbcfe8]/20 text-[#e07a8b] flex items-center justify-center shrink-0 shadow-md">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">100% asl mahsulot</h4>
              <p className="text-[11px] text-[#fbcfe8]/60">Faqat original brend tovarlar</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#3b2219] border border-[#fbcfe8]/20 text-[#e07a8b] flex items-center justify-center shrink-0 shadow-md">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">WS Jonli Chat</h4>
              <p className="text-[11px] text-[#fbcfe8]/60">24/7 onlayn qo'llab-quvvatlash</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#3b2219] to-[#e07a8b] p-0.5 shadow-lg">
                <div className="w-full h-full rounded-[14px] bg-[#20120d] flex items-center justify-center">
                  <span className="text-white font-black text-lg">WS</span>
                </div>
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                WS Store
              </span>
            </div>
            <p className="text-xs text-[#fbcfe8]/70 leading-relaxed">
              WS — zamonaviy texnologiyalar, flagman smartfonlar va premium aksessuarlar do'koni.
              Eksklyuziv jigarrang va nafis och pushti estetika.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-[#fbcfe8] mb-4">
              Xarid qilish
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Barcha tovarlar
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-white transition-colors">
                  Sevimlilar
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-white transition-colors">
                  Mening buyurtmalarim
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-[#fbcfe8] mb-4">
              Hisob & Profil
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/profile" className="hover:text-white transition-colors">
                  Shaxsiy profil
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Tizimga kirish
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white transition-colors">
                  Ro'yxatdan o'tish
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-[#fbcfe8] mb-4">
              Aloqa & Manzil
            </h4>
            <p className="text-xs text-[#fbcfe8]/70 leading-relaxed">
              Toshkent shahri, Amir Temur shox ko'chasi, WS Plaza<br />
              Telefon: +998 (71) 200-00-00<br />
              Email: contact@ws-store.uz
            </p>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[#fbcfe8]/10 text-center text-xs text-[#fbcfe8]/50">
          &copy; {new Date().getFullYear()} WS Store. Barcha huquqlar himoyalangan.
        </div>
      </div>
    </footer>
  );
}
