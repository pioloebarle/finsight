import {
  Home,
  Wifi,
  ShoppingCart,
  Utensils,
  CalendarDays,
  Car,
  CircleHelp,
  Wallet,
  type LucideIcon,
} from "lucide-react";

type CategoryConfig = { name: string; icon: LucideIcon; iconClass: string };

export const categoryConfig: Record<string, CategoryConfig> = {
  bills: { name: "Bills", icon: Home, iconClass: "bg-teal-50 text-teal-600" },
  internet: { name: "Internet", icon: Wifi, iconClass: "bg-blue-50 text-blue-600" },
  grocery: { name: "Grocery", icon: ShoppingCart, iconClass: "bg-emerald-50 text-emerald-600" },
  food: { name: "Food", icon: Utensils, iconClass: "bg-purple-50 text-purple-600" },
  subscriptions: { name: "Subscriptions", icon: CalendarDays, iconClass: "bg-violet-50 text-violet-600" },
  transportation: { name: "Transportation", icon: Car, iconClass: "bg-orange-50 text-orange-600" },
  salary: { name: "Salary", icon: Wallet, iconClass: "bg-green-50 text-green-600" },
  uncategorized: { name: "Uncategorized", icon: CircleHelp, iconClass: "bg-slate-50 text-slate-600" },
};

const FALLBACK_ICON_CLASS = "bg-slate-50 text-slate-600";

export function getCategoryConfig(name: string | null): CategoryConfig {
  const key = (name ?? "uncategorized").toLowerCase();
  return (
    categoryConfig[key] ?? {
      name: name ?? "Uncategorized",
      icon: CircleHelp,
      iconClass: FALLBACK_ICON_CLASS,
    }
  );
}