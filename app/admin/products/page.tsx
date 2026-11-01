"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Package,
  Plus,
  Search,
  Edit,
  Trash2,
  Upload,
  X,
  Loader2,
  Star,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react";
import { productsApi, categoriesApi, getErrorMessage } from "@/lib/api";
import { Product, Category } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useToast } from "@/context/ToastContext";

export default function AdminProductsPage() {
  const toast = useToast();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Pagination
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | "all">("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Form Fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [oldPrice, setOldPrice] = useState<number | "">("");
  const [stock, setStock] = useState<number | "">("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  // Load categories
  useEffect(() => {
    categoriesApi
      .getAll()
      .then((cats) => {
        if (Array.isArray(cats)) setCategories(cats);
      })
      .catch(() => {});
  }, []);

  // Fetch products
  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = {
        page,
        limit: 10,
        sortBy: "createdAt",
        sortOrder: "desc",
      };
      if (search.trim()) params.search = search.trim();
      if (selectedCategory !== "all") params.categoryId = selectedCategory;

      const res = await productsApi.getAll(params);
      setProducts(res.data || []);
      setTotalPages(res.meta?.totalPages || 1);
      setTotalProducts(res.meta?.total || 0);
    } catch (err) {
      toast.error(getErrorMessage(err, "Mahsulotlarni yuklashda xatolik"));
    } finally {
      setLoading(false);
    }
  }, [page, search, selectedCategory]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setTitle("");
    setDescription("");
    setPrice("");
    setOldPrice("");
    setStock(10);
    setCategoryId(categories[0]?.id || "");
    setImageUrl("");
    setUploadFile(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setTitle(product.title);
    setDescription(product.description || "");
    setPrice(product.price);
    setOldPrice(product.oldPrice || "");
    setStock(product.stock);
    setCategoryId(product.categoryId);
    setImageUrl(product.images?.[0] || "");
    setUploadFile(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !price || !categoryId) {
      toast.error("Barcha majburiy maydonlarni to'ldiring");
      return;
    }

    setFormSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        price: Number(price),
        oldPrice: oldPrice ? Number(oldPrice) : null,
        stock: Number(stock) || 0,
        categoryId: Number(categoryId),
        images: imageUrl ? [imageUrl] : [],
      };

      let currentId: number;

      if (editingProduct) {
        const updated = await productsApi.update(editingProduct.id, payload);
        currentId = updated.id;
        toast.success("Mahsulot muvaffaqiyatli tahrirlandi!");
      } else {
        const created = await productsApi.create(payload);
        currentId = created.id;
        toast.success("Yangi mahsulot muvaffaqiyatli qo'shildi!");
      }

      // If a file was selected, upload it
      if (uploadFile) {
        try {
          await productsApi.uploadImage(currentId, uploadFile);
          toast.success("Rasm yuklandi!");
        } catch (imgErr) {
          toast.error("Rasm yuklashda xatolik yuz berdi");
        }
      }

      setIsModalOpen(false);
      await loadProducts();
    } catch (err) {
      toast.error(getErrorMessage(err, "Saqlashda xatolik yuz berdi"));
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDelete = async (productId: number) => {
    if (!confirm("Haqiqatan ham bu mahsulotni o'chirmoqchimisiz?")) return;
    try {
      await productsApi.delete(productId);
      toast.info("Mahsulot o'chirildi");
      await loadProducts();
    } catch (err) {
      toast.error(getErrorMessage(err, "Mahsulotni o'chirishda xatolik"));
    }
  };

  return (
    <div className="p-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Package className="w-6 h-6 text-indigo-400" />
            Mahsulotlar boshqaruvi
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Jami {totalProducts} ta mahsulot ro'yxati
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Yangi mahsulot qo'shish</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Mahsulot nomi bo'yicha qidiring..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(
                e.target.value === "all" ? "all" : Number(e.target.value)
              );
              setPage(1);
            }}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="all">Barcha kategoriyalar</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl overflow-hidden shadow-2xl">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          </div>
        ) : products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Mahsulot</th>
                  <th className="py-3.5 px-4">Kategoriya</th>
                  <th className="py-3.5 px-4">Narxi</th>
                  <th className="py-3.5 px-4">Zaxira (Stock)</th>
                  <th className="py-3.5 px-4">Reyting</th>
                  <th className="py-3.5 px-4 text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-850/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-950 overflow-hidden shrink-0 border border-slate-800 flex items-center justify-center">
                          {p.images?.[0] ? (
                            <img
                              src={p.images[0]}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-[10px] text-slate-600">Rasm</span>
                          )}
                        </div>
                        <div className="min-w-0 max-w-xs">
                          <p className="font-bold text-white truncate">{p.title}</p>
                          <p className="text-[11px] text-slate-500 truncate">
                            ID: #{p.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-300 font-medium">
                      {p.category?.name || "Kategoriya yo'q"}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-emerald-400">
                        {formatPrice(p.price)}
                      </div>
                      {p.oldPrice && p.oldPrice > p.price && (
                        <div className="text-[11px] text-slate-500 line-through">
                          {formatPrice(p.oldPrice)}
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`font-semibold ${
                          p.stock > 0 ? "text-slate-200" : "text-rose-400"
                        }`}
                      >
                        {p.stock} dona
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 text-amber-400 font-semibold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{p.ratingAvg ? p.ratingAvg.toFixed(1) : "5.0"}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(p)}
                          className="p-2 text-slate-400 hover:text-indigo-400 rounded-lg hover:bg-slate-800 transition-colors"
                          title="Tahrirlash"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
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
            Mahsulotlar topilmadi.
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>
              Sahifa {page} dan {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="p-2 rounded-lg bg-slate-950 border border-slate-800 hover:text-white disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="p-2 rounded-lg bg-slate-950 border border-slate-800 hover:text-white disabled:opacity-40 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h2 className="text-lg font-bold text-white">
                {editingProduct
                  ? "Mahsulotni tahrirlash"
                  : "Yangi mahsulot qo'shish"}
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
                  Mahsulot nomi (Title) *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Masalan: iPhone 16 Pro Max 256GB"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Kategoriya *
                </label>
                <select
                  required
                  value={categoryId}
                  onChange={(e) => setCategoryId(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="">Kategoriyani tanlang</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Narxi (so'mda) *
                  </label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    placeholder="12000000"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Eski narxi (so'm)
                  </label>
                  <input
                    type="number"
                    value={oldPrice}
                    onChange={(e) =>
                      setOldPrice(e.target.value ? Number(e.target.value) : "")
                    }
                    placeholder="14000000"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Omborda (Stock) *
                  </label>
                  <input
                    type="number"
                    required
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    placeholder="10"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Tavsifi (Description) *
                </label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Mahsulot haqida batafsil ma'lumot (xususiyatlari, ranglari, o'lchamlari)..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              {/* Image URL & File Upload */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
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
                    Yoki fayl yuklash (max 2MB)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
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
                  disabled={formSubmitting}
                  className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {formSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  <span>{editingProduct ? "Saqlash" : "Qo'shish"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
