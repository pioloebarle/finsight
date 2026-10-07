import {
  Home,
  Wifi,
  ShoppingCart,
  Utensils,
  CalendarDays,
  Car,
  CircleHelp,
} from "lucide-react";

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

  subscription: {
    name: "Subscription",
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
};