import React from 'react';
import { Product } from '../../types';
import { formatCurrency } from '../../utils/currency';
import { StatusBadge } from '../ui/StatusBadge';
import { Star, Edit3, Trash2 } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onEdit,
  onDelete,
  onView,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group">
      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 left-3">
          <StatusBadge status={product.status} type="product" />
        </div>
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-semibold text-slate-800 flex items-center gap-1 shadow-sm">
          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>{product.rating}</span>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>{product.category}</span>
            <span className="font-mono">{product.sku}</span>
          </div>

          <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition text-base mb-1 line-clamp-1">
            {product.name}
          </h4>

          <p className="text-xs text-slate-500 line-clamp-2 mb-4">
            {product.description}
          </p>
        </div>

        <div>
          <div className="flex items-baseline justify-between mb-4 pt-3 border-t border-slate-100">
            <div>
              <span className="text-[11px] text-slate-400 block">Narxi</span>
              <span className="text-lg font-bold text-slate-900">
                {formatCurrency(product.price)}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-400 block">Omborda</span>
              <span className="text-xs font-semibold text-slate-700">
                {product.stock} dona
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onView && (
              <button
                type="button"
                onClick={() => onView(product)}
                className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition"
              >
                Batafsil
              </button>
            )}
            <button
              type="button"
              onClick={() => onEdit(product)}
              className="p-2 rounded-xl border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 transition"
              title="Tahrirlash"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(product)}
              className="p-2 rounded-xl border border-slate-200 hover:border-rose-200 hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition"
              title="O‘chirish"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
