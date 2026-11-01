"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  ShieldCheck,
  User as UserIcon,
  Calendar,
  Package,
  Loader2,
  Mail,
} from "lucide-react";
import { usersApi, getErrorMessage } from "@/lib/api";
import { User } from "@/types";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/context/ToastContext";

export default function AdminUsersPage() {
  const toast = useToast();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await usersApi.getAdminUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error(getErrorMessage(err, "Foydalanuvchilarni yuklashda xatolik"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = users.filter((u) => {
    const term = search.toLowerCase();
    return (
      u.name.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term) ||
      String(u.id).includes(term)
    );
  });

  return (
    <div className="p-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Users className="w-6 h-6 text-purple-400" />
            Foydalanuvchilar ro'yxati
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Jami {users.length} ta ro'yxatdan o'tgan foydalanuvchi
          </p>
        </div>

        <button
          onClick={loadUsers}
          className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
        >
          Ro'yxatni yangilash
        </button>
      </div>

      {/* Search */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl max-w-sm">
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Ism, email yoki ID bo'yicha qidiring..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl overflow-hidden shadow-2xl">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          </div>
        ) : filteredUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Foydalanuvchi</th>
                  <th className="py-3.5 px-4">Email manzili</th>
                  <th className="py-3.5 px-4">Roli</th>
                  <th className="py-3.5 px-4">Buyurtmalar soni</th>
                  <th className="py-3.5 px-4">Ro'yxatdan o'tgan sana</th>
                  <th className="py-3.5 px-4 text-right">Foydalanuvchi ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-850/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700/60 overflow-hidden flex items-center justify-center text-xs font-bold text-indigo-300 shrink-0">
                          {u.avatarUrl ? (
                            <img
                              src={u.avatarUrl}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            u.name?.charAt(0).toUpperCase() || "U"
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm">{u.name}</p>
                          <span className="text-[10px] text-slate-500">
                            Foydalanuvchi
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-500" />
                        <span className="font-mono">{u.email}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                          u.role === "ADMIN"
                            ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                            : "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-200">
                        {u.ordersCount ?? 0} ta
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        <span>{formatDate(u.createdAt)}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono text-slate-500 font-bold">
                      #{u.id}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-20 text-center text-xs text-slate-500">
            Foydalanuvchilar topilmadi.
          </div>
        )}
      </div>
    </div>
  );
}
