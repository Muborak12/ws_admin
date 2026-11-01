import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  SlidersHorizontal,
  LayoutGrid,
  Table as TableIcon,
  Trash2,
  Edit3,
  Eye,
  Star,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Product, ProductStatus } from '../types';
import { ProductCard } from '../components/products/ProductCard';
import { ProductFormModal } from '../components/products/ProductFormModal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { Modal } from '../components/ui/Modal';
import { StatusBadge } from '../components/ui/StatusBadge';
import { EmptyState } from '../components/ui/EmptyState';
import { formatCurrency, formatDate } from '../utils/currency';

export const ProductsPage: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, globalSearch } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStockStatus, setSelectedStockStatus] = useState('all');
  const [sortBy, setSortBy] = useState<'name-asc' | 'name-desc' | 'price-asc' | 'price-desc'>('name-asc');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category));
    return ['all', ...Array.from(cats)];
  }, [products]);

  const effectiveSearch = searchQuery || globalSearch;

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesSearch =
          p.name.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
          p.sku.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
          p.category.toLowerCase().includes(effectiveSearch.toLowerCase());

        const matchesCategory =
          selectedCategory === 'all' || p.category === selectedCategory;

        const matchesStock =
          selectedStockStatus === 'all' || p.status === selectedStockStatus;

        return matchesSearch && matchesCategory && matchesStock;
      })
      .sort((a, b) => {
        if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
        if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        return 0;
      });
  }, [products, effectiveSearch, selectedCategory, selectedStockStatus, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (data: Omit<Product, 'id' | 'createdAt'>) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, data);
    } else {
      addProduct(data);
    }
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  const handleConfirmDelete = () => {
    if (deletingProduct) {
      deleteProduct(deletingProduct.id);
      setDeletingProduct(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Mahsulotlar
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Do‘koningizdagi barcha mahsulotlarni boshqaring.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition shadow-md shadow-indigo-600/20 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          <span>+ Yangi mahsulot qo‘shish</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 p-4 sm:p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Nom yoki SKU bo‘yicha qidirish..."
              className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
            />
          </div>

          <div>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
            >
              <option value="all">Barcha kategoriyalar</option>
              {categories
                .filter((c) => c !== 'all')
                .map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <select
              value={selectedStockStatus}
              onChange={(e) => {
                setSelectedStockStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
            >
              <option value="all">Barcha ombor holatlari</option>
              <option value="active">Mavjud (Omborda bor)</option>
              <option value="low_stock">Kam qoldi (5 tadan kam)</option>
              <option value="out_of_stock">Tugagan (0 dona)</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
            >
              <option value="name-asc">Nom bo‘yicha: A dan Z gacha</option>
              <option value="name-desc">Nom bo‘yicha: Z dan A gacha</option>
              <option value="price-asc">Narx bo‘yicha: Arzondan qimmatga</option>
              <option value="price-desc">Narx bo‘yicha: Qimmatdan arzonga</option>
            </select>

            <div className="flex border border-slate-200 rounded-xl p-0.5 bg-slate-50">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition ${
                  viewMode === 'grid'
                    ? 'bg-white text-indigo-600 shadow-xs'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
                title="Karta ko‘rinishi"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition ${
                  viewMode === 'table'
                    ? 'bg-white text-indigo-600 shadow-xs'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
                title="Jadval ko‘rinishi"
              >
                <TableIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>Topilgan mahsulotlar: <b>{filteredProducts.length}</b> ta</span>
          {(selectedCategory !== 'all' || selectedStockStatus !== 'all' || effectiveSearch) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedStockStatus('all');
              }}
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Filtrlarni tozalash
            </button>
          )}
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <EmptyState
          title="Mahsulot topilmadi"
          description="Kiritilgan parametrlar bo‘yicha hech qanday mahsulot topilmadi. Qidiruv so‘zini o‘zgartirib ko‘ring."
          actionText="Barcha mahsulotlarni ko‘rsatish"
          onAction={() => {
            setSearchQuery('');
            setSelectedCategory('all');
            setSelectedStockStatus('all');
          }}
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {paginatedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={handleOpenEdit}
              onDelete={setDeletingProduct}
              onView={setViewingProduct}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                  <th className="py-3.5 px-4">Mahsulot</th>
                  <th className="py-3.5 px-4">Artikul (SKU)</th>
                  <th className="py-3.5 px-4">Kategoriya</th>
                  <th className="py-3.5 px-4">Narxi</th>
                  <th className="py-3.5 px-4 text-center">Omborda</th>
                  <th className="py-3.5 px-4">Holat</th>
                  <th className="py-3.5 px-4 text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {paginatedProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-12 h-12 rounded-xl object-cover bg-slate-100 border border-slate-100"
                        />
                        <div>
                          <div className="font-semibold text-slate-900">{p.name}</div>
                          <div className="text-xs text-slate-400 line-clamp-1 max-w-xs">
                            {p.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-600">
                      {p.sku}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 text-xs">
                      {p.category}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                      {formatCurrency(p.price)}
                    </td>
                    <td className="py-3.5 px-4 text-center font-semibold text-slate-700">
                      {p.stock} dona
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge status={p.status} type="product" />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setViewingProduct(p)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition"
                          title="Batafsil"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition"
                          title="Tahrirlash"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingProduct(p)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition"
                          title="O‘chirish"
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
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white px-5 py-3.5 rounded-2xl border border-slate-100 shadow-sm text-xs">
          <span className="text-slate-500">
            Sahifa <b>{currentPage}</b> / <b>{totalPages}</b>
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Oldingi
            </button>
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                className={`w-7 h-7 rounded-lg font-semibold transition ${
                  currentPage === idx + 1
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {idx + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Keyingi
            </button>
          </div>
        </div>
      )}

      <ProductFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        productToEdit={editingProduct}
      />

      <ConfirmDialog
        isOpen={!!deletingProduct}
        onClose={() => setDeletingProduct(null)}
        onConfirm={handleConfirmDelete}
        title="Mahsulotni o‘chirish"
        message={`Haqiqatan ham "${deletingProduct?.name}" mahsulotini o‘chirmoqchimisiz? Ushbu amalni ortga qaytarib bo‘lmaydi.`}
      />

      {viewingProduct && (
        <Modal
          isOpen={!!viewingProduct}
          onClose={() => setViewingProduct(null)}
          title="Mahsulot tafsilotlari"
          maxWidth="max-w-2xl"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-100">
                <img
                  src={viewingProduct.image}
                  alt={viewingProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                    {viewingProduct.category}
                  </span>
                  <StatusBadge status={viewingProduct.status} type="product" />
                </div>

                <h3 className="text-xl font-bold text-slate-900 leading-snug">
                  {viewingProduct.name}
                </h3>

                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>{viewingProduct.rating} ball (mijozlar bahosi)</span>
                </div>

                <div className="pt-2">
                  <span className="text-xs text-slate-400 block">Narxi</span>
                  <span className="text-2xl font-extrabold text-slate-900">
                    {formatCurrency(viewingProduct.price)}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 block">Artikul (SKU)</span>
                    <span className="font-mono font-medium text-slate-800">{viewingProduct.sku}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Ombordagi qoldiq</span>
                    <span className="font-semibold text-slate-800">{viewingProduct.stock} dona</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs">
              <span className="font-bold text-slate-700 block mb-1">Mahsulot tavsifi</span>
              <p className="text-slate-600 leading-relaxed">{viewingProduct.description}</p>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-[11px] text-slate-400">
                Kiritilgan sana: {formatDate(viewingProduct.createdAt)}
              </span>
              <button
                onClick={() => setViewingProduct(null)}
                className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition"
              >
                Yopish
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
