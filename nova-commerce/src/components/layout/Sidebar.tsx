import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Users,
  CreditCard,
  Settings,
  X,
  Store,
  Layers,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navItems = [
    { to: '/', label: 'Bosh sahifa', icon: LayoutDashboard },
    { to: '/products', label: 'Mahsulotlar', icon: Package },
    { to: '/customers', label: 'Mijozlar va buyurtmalar', icon: Users },
    { to: '/payments', label: 'To‘lovlar', icon: CreditCard },
    { to: '/settings', label: 'Sozlamalar', icon: Settings },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
          <NavLink to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-base tracking-tight text-slate-900 leading-none">
                NOVA
              </div>
              <div className="text-[10px] font-semibold tracking-wider text-indigo-600 uppercase mt-0.5">
                Commerce
              </div>
            </div>
          </NavLink>

          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-4 py-6 flex-1 overflow-y-auto space-y-1">
          <div className="px-3 pb-2 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
            Boshqaruv
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-600 shadow-sm font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`w-5 h-5 transition-colors ${
                        isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'
                      }`}
                    />
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        <div className="p-4 border-t border-slate-100">
          <div className="bg-gradient-to-br from-indigo-50 to-violet-50/50 rounded-2xl p-4 border border-indigo-100/60">
            <div className="flex items-center gap-2 text-indigo-700 font-semibold text-xs mb-1">
              <Layers className="w-4 h-4" />
              <span>Pro tizim</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed mb-3">
              Barcha statistika va to‘lov ma’lumotlari real vaqt rejimida saqlanmoqda.
            </p>
            <div className="text-[10px] font-medium text-indigo-600 bg-white/80 px-2 py-1 rounded-md inline-block">
              Versiya 2.4.0
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
