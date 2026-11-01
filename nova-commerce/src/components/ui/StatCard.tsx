import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  subtext?: string;
  change?: number;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtext = 'O‘tgan oyga nisbatan',
  change,
  icon: Icon,
  iconColor = 'text-indigo-600',
  iconBg = 'bg-indigo-50',
}) => {
  const isPositive = change !== undefined ? change >= 0 : true;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-slate-500">{title}</span>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg} ${iconColor}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>

      <div className="flex items-baseline justify-between">
        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{value}</h3>
      </div>

      {(change !== undefined || subtext) && (
        <div className="mt-3 flex items-center gap-2 text-xs">
          {change !== undefined && (
            <span
              className={`inline-flex items-center font-semibold px-1.5 py-0.5 rounded ${
                isPositive
                  ? 'text-emerald-700 bg-emerald-50'
                  : 'text-rose-700 bg-rose-50'
              }`}
            >
              {isPositive ? (
                <TrendingUp className="w-3.5 h-3.5 mr-0.5 inline" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5 mr-0.5 inline" />
              )}
              {isPositive ? `+${change}%` : `${change}%`}
            </span>
          )}
          {subtext && <span className="text-slate-400">{subtext}</span>}
        </div>
      )}
    </div>
  );
};
