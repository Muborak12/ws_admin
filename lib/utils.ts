import { OrderStatus } from "@/types";

export function formatPrice(price?: number | null): string {
  if (price === undefined || price === null || isNaN(price)) return "0 so'm";
  return new Intl.NumberFormat("uz-UZ").format(price) + " so'm";
}

export function formatDate(dateString?: string): string {
  if (!dateString) return "";
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat("uz-UZ", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  } catch {
    return dateString;
  }
}

export function getStatusBadge(status: OrderStatus): {
  label: string;
  className: string;
} {
  switch (status) {
    case "PENDING":
      return {
        label: "Kutilmoqda",
        className:
          "bg-amber-500/10 text-amber-500 border border-amber-500/20",
      };
    case "PAID":
      return {
        label: "To'langan",
        className:
          "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20",
      };
    case "SHIPPED":
      return {
        label: "Yuborilgan",
        className: "bg-blue-500/10 text-blue-500 border border-blue-500/20",
      };
    case "DELIVERED":
      return {
        label: "Yetkazildi",
        className:
          "bg-purple-500/10 text-purple-500 border border-purple-500/20",
      };
    case "CANCELLED":
      return {
        label: "Bekor qilingan",
        className: "bg-rose-500/10 text-rose-500 border border-rose-500/20",
      };
    default:
      return {
        label: status,
        className: "bg-neutral-500/10 text-neutral-400 border border-neutral-500/20",
      };
  }
}
