import React, { useState, useEffect } from 'react';
import { Product, ProductStatus } from '../../types';
import { Modal } from '../ui/Modal';
import { Image, DollarSign, Layers, Hash } from 'lucide-react';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Product, 'id' | 'createdAt'>) => void;
  productToEdit?: Product | null;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  productToEdit,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [category, setCategory] = useState('Smartfonlar');
  const [stock, setStock] = useState<number | ''>('');
  const [sku, setSku] = useState('');
  const [image, setImage] = useState('');
  const [rating, setRating] = useState<number>(4.8);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = [
    'Smartfonlar',
    'Noutbuklar',
    'Audio',
    'Aqlli soatlar',
    'Geyming',
    'Planshetlar',
    'Kameralar',
    'Aksessuarlar',
  ];

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setDescription(productToEdit.description);
      setPrice(productToEdit.price);
      setCategory(productToEdit.category);
      setStock(productToEdit.stock);
      setSku(productToEdit.sku);
      setImage(productToEdit.image);
      setRating(productToEdit.rating);
    } else {
      setName('');
      setDescription('');
      setPrice('');
      setCategory('Smartfonlar');
      setStock('');
      setSku(`SKU-${Math.floor(1000 + Math.random() * 9000)}`);
      setImage('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80');
      setRating(4.8);
    }
    setErrors({});
  }, [productToEdit, isOpen]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Mahsulot nomi kiritilishi shart';
    }
    if (!description.trim()) {
      newErrors.description = 'Mahsulot tavsifi kiritilishi shart';
    }
    if (price === '' || Number(price) <= 0) {
      newErrors.price = 'To‘g‘ri narx kiriting';
    }
    if (stock === '' || Number(stock) < 0) {
      newErrors.stock = 'Ombordagi sonini to‘g‘ri kiriting';
    }
    if (!image.trim()) {
      newErrors.image = 'Rasm URL manzili kiritilishi shart';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const stockNum = Number(stock);
    let status: ProductStatus = 'active';
    if (stockNum === 0) {
      status = 'out_of_stock';
    } else if (stockNum <= 5) {
      status = 'low_stock';
    }

    onSubmit({
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      category,
      stock: stockNum,
      sku: sku.trim() || `SKU-${Date.now()}`,
      image: image.trim(),
      rating: rating || 4.5,
      status,
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={productToEdit ? 'Mahsulotni tahrirlash' : 'Yangi mahsulot qo‘shish'}
      description="Do‘kon katalogidagi mahsulot ma’lumotlarini to‘ldiring."
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Mahsulot nomi <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Masalan: Apple iPhone 15 Pro Max"
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 ${
              errors.name
                ? 'border-rose-300 focus:ring-rose-500/20 focus:border-rose-500'
                : 'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500'
            }`}
          />
          {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Kategoriya <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Layers className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Artikul (SKU)
            </label>
            <div className="relative">
              <Hash className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="SKU-9021"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Narxi (so‘m) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="15000000"
                min="0"
                className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm text-slate-800 focus:outline-none focus:ring-2 ${
                  errors.price
                    ? 'border-rose-300 focus:ring-rose-500/20 focus:border-rose-500'
                    : 'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500'
                }`}
              />
            </div>
            {errors.price && <p className="text-xs text-rose-500 mt-1">{errors.price}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Ombordagi soni (dona) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="10"
              min="0"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-800 focus:outline-none focus:ring-2 ${
                errors.stock
                  ? 'border-rose-300 focus:ring-rose-500/20 focus:border-rose-500'
                  : 'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500'
              }`}
            />
            {errors.stock && <p className="text-xs text-rose-500 mt-1">{errors.stock}</p>}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Rasm URL manzili <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Image className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm text-slate-800 focus:outline-none focus:ring-2 ${
                errors.image
                  ? 'border-rose-300 focus:ring-rose-500/20 focus:border-rose-500'
                  : 'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500'
              }`}
            />
          </div>
          {errors.image && <p className="text-xs text-rose-500 mt-1">{errors.image}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Mahsulot tavsifi <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Mahsulot haqida batafsil ma’lumot yozing..."
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-800 focus:outline-none focus:ring-2 ${
              errors.description
                ? 'border-rose-300 focus:ring-rose-500/20 focus:border-rose-500'
                : 'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500'
            }`}
          />
          {errors.description && (
            <p className="text-xs text-rose-500 mt-1">{errors.description}</p>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
          >
            Bekor qilish
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-indigo-600 text-sm font-medium text-white hover:bg-indigo-700 transition shadow-sm"
          >
            {productToEdit ? 'Saqlash' : 'Mahsulotni qo‘shish'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
