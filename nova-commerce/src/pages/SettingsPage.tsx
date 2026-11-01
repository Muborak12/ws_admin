import React, { useState } from 'react';
import { Store, User, Bell, Shield, Save, RotateCcw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';

export const SettingsPage: React.FC = () => {
  const { resetAllData } = useApp();

  const [storeName, setStoreName] = useState('NOVA Commerce');
  const [currency] = useState('UZS — O‘zbek so‘mi');
  const [supportPhone, setSupportPhone] = useState('+998 (71) 200-00-00');
  const [supportEmail, setSupportEmail] = useState('support@novacommerce.uz');
  const [adminName, setAdminName] = useState('Rustam Karimov');
  const [adminEmail, setAdminEmail] = useState('admin@novacommerce.uz');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Sozlamalar muvaffaqiyatli saqlandi!');
  };

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Tizim sozlamalari
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Do‘kon parametrlari, administrator profili va bildirishnomalarni sozlang.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Do‘kon parametrlari</h3>
              <p className="text-xs text-slate-400">Do‘konning asosiy ko‘rinishi va rekvizitlari</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Do‘kon nomi</label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Asosiy valyuta</label>
              <input
                type="text"
                value={currency}
                disabled
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Mijozlarni qo‘llab-quvvatlash telefoni</label>
              <input
                type="text"
                value={supportPhone}
                onChange={(e) => setSupportPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Qo‘llab-quvvatlash emaili</label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Administrator profili</h3>
              <p className="text-xs text-slate-400">Shaxsiy login va hisob ma’lumotlari</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Ism va familiya</label>
              <input
                type="text"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email manzili</label>
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Boshlang‘ich ma’lumotlarni qayta tiklash</h3>
              <p className="text-xs text-slate-400">
                Namunaviy mahsulotlar, mijozlar va buyurtmalarni qaytadan yuklash
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Agar test jarayonida kiritilgan ma’lumotlarni tozalab, tizimni asl holatiga qaytarmoqchi bo‘lsangiz, quyidagi tugmani bosing.
          </p>

          <button
            type="button"
            onClick={resetAllData}
            className="px-4 py-2.5 rounded-xl border border-amber-200 bg-amber-50/50 hover:bg-amber-100 text-amber-800 text-xs font-semibold transition"
          >
            Barcha ma’lumotlarni dastlabki holatga qaytarish
          </button>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition shadow-md shadow-indigo-600/20 active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>O‘zgarishlarni saqlash</span>
          </button>
        </div>
      </form>
    </div>
  );
};
