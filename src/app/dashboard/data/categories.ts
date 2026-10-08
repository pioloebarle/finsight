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

type CategoryConfig = { name: string; icon: LucideIcon };

export const categoryConfig = {
  bills: {
    name: "Bills",
    icon: Home,
  },

  internet: {
    name: "Internet",
    icon: Wifi,
  },

  grocery: {
    name: "Grocery",
    icon: ShoppingCart,
  },

  food: {
    name: "Food",
    icon: Utensils,
  },

  subscriptions: {
    name: "Subscriptions",
    icon: CalendarDays,
  },

  transportation: {
    name: "Transportation",
    icon: Car,
  },

  uncategorized: {
    name: "Uncategorized",
    icon: CircleHelp,
  },

  salary: {
    name: "Salary",
    icon: Wallet,
  }
};

export function getCategoryConfig(name: string | null): CategoryConfig {
  const key = (name ?? "uncategorized").toLowerCase();
  return categoryConfig[key as keyof typeof categoryConfig] ?? {
    name: name ?? "Uncategorized",
    icon: CircleHelp,
  };
}