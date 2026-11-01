import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-20 h-20 rounded-3xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-6">
        <AlertCircle className="w-10 h-10" />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
        404 — Sahifa topilmadi
      </h1>
      <p className="text-sm text-slate-500 max-w-md mb-8">
        Siz qidirayotgan sahifa mavjud emas yoki boshqa manzilga ko‘chirilgan.
      </p>
      <button
        onClick={() => navigate('/')}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition shadow-md shadow-indigo-600/20"
      >
        <Home className="w-4 h-4" />
        <span>Bosh sahifaga qaytish</span>
      </button>
    </div>
  );
};
