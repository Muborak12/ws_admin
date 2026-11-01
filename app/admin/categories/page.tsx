"use client";

import React, { useState, useEffect } from "react";
import {
  Layers,
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  Loader2,
} from "lucide-react";
import { categoriesApi, getErrorMessage } from "@/lib/api";
import { Category } from "@/types";
import { useToast } from "@/context/ToastContext";

export default function AdminCategoriesPage() {
  const toast = useToast();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await categoriesApi.getAll();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error(getErrorMessage(err, "Kategoriyalarni yuklashda xatolik"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setName("");
    setSlug("");
    setImageUrl("");
    setUploadFile(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setImageUrl(cat.imageUrl || "");
    setUploadFile(null);
    setIsModalOpen(true);
  };

  // Auto slug generation from name
  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingCategory) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
      setSlug(generated);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) {
      toast.error("Nomi va slug kiritilishi shart");
      return;
    }

    setSubmitting(true);
    try {
      let currentId: number;

      if (editingCategory) {
        const updated = await categoriesApi.update(editingCategory.id, {
          name: name.trim(),
          slug: slug.trim(),
          imageUrl: imageUrl.trim() || undefined,
        });
        currentId = updated.id;
        toast.success("Kategoriya tahrirlandi!");
      } else {
        const created = await categoriesApi.create({
          name: name.trim(),
          slug: slug.trim(),
          imageUrl: imageUrl.trim() || undefined,
        });
        currentId = created.id;
        toast.success("Yangi kategoriya yaratildi!");
      }

      if (uploadFile) {
        try {
          await categoriesApi.uploadImage(currentId, uploadFile);
          toast.success("Kategoriya rasmi yuklandi!");
        } catch {
          toast.error("Rasm yuklashda xatolik yuz berdi");
        }
      }

      setIsModalOpen(false);
      await loadCategories();
    } catch (err) {
      toast.error(getErrorMessage(err, "Saqlashda xatolik yuz berdi"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Haqiqatan ham bu kategoriyani o'chirmoqchimisiz?")) return;
    try {
      await categoriesApi.delete(id);
      toast.info("Kategoriya o'chirildi");
      await loadCategories();
    } catch (err) {
      toast.error(getErrorMessage(err, "Kategoriyani o'chirishda xatolik"));
    }
  };

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-amber-400" />
            Kategoriyalar boshqaruvi
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Jami {categories.length} ta kategoriya mavjud
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Yangi kategoriya</span>
        </button>
      </div>

      {/* Search */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl max-w-sm">
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Kategoriya nomi yoki slugi..."
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
        ) : filteredCategories.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Rasm</th>
                  <th className="py-3.5 px-4">Kategoriya nomi</th>
                  <th className="py-3.5 px-4">Slug (URL)</th>
                  <th className="py-3.5 px-4">ID</th>
                  <th className="py-3.5 px-4 text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {filteredCategories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-850/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-950 overflow-hidden shrink-0 border border-slate-800 flex items-center justify-center">
                        {cat.imageUrl ? (
                          <img
                            src={cat.imageUrl}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-[10px] text-slate-600">Rasm yo'q</span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-white text-sm">
                      {cat.name}
                    </td>

                    <td className="py-3.5 px-4 text-indigo-400 font-mono">
                      {cat.slug}
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 font-mono">
                      #{cat.id}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(cat)}
                          className="p-2 text-slate-400 hover:text-indigo-400 rounded-lg hover:bg-slate-800 transition-colors"
                          title="Tahrirlash"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id)}
                          className="p-2 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                          title="O'chirish"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-20 text-center text-xs text-slate-500">
            Kategoriyalar topilmadi.
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h2 className="text-lg font-bold text-white">
                {editingCategory ? "Kategoriyani tahrirlash" : "Yangi kategoriya"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Kategoriya nomi *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Masalan: Noutbuklar"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Slug (URL identifikator) *
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="noutbuklar"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Rasm URL manzili
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Yoki rasm faylini yuklash (max 2MB)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer"
                />
              </div>

              <div className="pt-4 flex gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 px-4 rounded-xl border border-slate-800 text-slate-300 hover:bg-slate-800 text-xs font-semibold transition-colors"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  <span>{editingCategory ? "Saqlash" : "Yaratish"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
