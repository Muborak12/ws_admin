import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Search,
  Bell,
  LogOut,
  User,
  Settings,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import toast from 'react-hot-toast';

interface NavbarProps {
  onOpenSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSidebar }) => {
  const { globalSearch, setGlobalSearch, resetAllData } = useApp();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setShowProfileMenu(false);
    toast.success('Tizimdan muvaffaqiyatli chiqildi!');
  };

  const notifications = [
    {
      id: 1,
      title: 'Yangi buyurtma qabul qilindi',
      desc: 'Alisher Qodirov 15 490 000 so‘mlik buyurtma berdi.',
      time: '5 daqiqa oldin',
      icon: CheckCircle2,
      iconColor: 'text-emerald-500',
    },
    {
      id: 2,
      title: 'Omborda mahsulot kam qoldi',
      desc: 'DJI Mini 4 Pro Dron 4 dona qoldi.',
      time: '1 soat oldin',
      icon: AlertCircle,
      iconColor: 'text-amber-500',
    },
    {
      id: 3,
      title: 'To‘lov tasdiqlandi',
      desc: 'ORD-9022 bo‘yicha 36 800 000 so‘m qabul qilindi.',
      time: '3 soat oldin',
      icon: Clock,
      iconColor: 'text-indigo-500',
    },
  ];

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between">
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            placeholder="Tizim bo‘yicha tezkor qidiruv..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="font-bold text-sm text-slate-800">Bildirishnomalar</span>
                <span className="text-xs text-indigo-600 font-medium bg-indigo-50 px-2 py-0.5 rounded-full">
                  3 ta yangi
                </span>
              </div>
              <div className="divide-y divide-slate-100 mt-2">
                {notifications.map((n) => {
                  const Icon = n.icon;
                  return (
                    <div key={n.id} className="py-3 flex items-start gap-3 hover:bg-slate-50/80 px-2 rounded-xl transition">
                      <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${n.iconColor}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-800">{n.title}</p>
                        <p className="text-xs text-slate-500 truncate mt-0.5">{n.desc}</p>
                        <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block" />

        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-slate-100 transition group"
          >
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"
              alt="Administrator"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/20"
            />
            <div className="text-left hidden md:block">
              <div className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600 transition leading-none">
                Rustam Karimov
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Bosh Administrator</div>
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50">
              <div className="px-3 py-2 border-b border-slate-100 mb-1">
                <p className="text-xs font-bold text-slate-800">Rustam Karimov</p>
                <p className="text-[11px] text-slate-500 truncate">admin@novacommerce.uz</p>
              </div>

              <div className="space-y-0.5">
                <button
                  onClick={() => setShowProfileMenu(false)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  <span>Profil ma’lumotlari</span>
                </button>
                <button
                  onClick={() => setShowProfileMenu(false)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>Tizim sozlamalari</span>
                </button>
                <button
                  onClick={() => {
                    resetAllData();
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-amber-700 hover:bg-amber-50 transition"
                >
                  <RotateCcw className="w-4 h-4 text-amber-500" />
                  <span>Namunaviy ma’lumotlarni tiklash</span>
                </button>
              </div>

              <div className="pt-1 mt-1 border-t border-slate-100">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 transition"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Tizimdan chiqish</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
