import {
    CalendarDays,
    Home,
    Wifi,
    ShoppingCart,
    Utensils,
    Car,
    Wallet,
} from "lucide-react";

export const categories = [
    {
        id: "grocery",
        name: "Grocery",
        icon: ShoppingCart,
        iconClass: "bg-emerald-50 text-emerald-600",
    },
    {
        id: "food",
        name: "Food",
        icon: Utensils,
        iconClass: "bg-purple-50 text-purple-600",
    },
    {
        id: "bills",
        name: "Bills",
        icon: Home,
        iconClass: "bg-teal-50 text-teal-600",
    },
    {
        id: "internet",
        name: "Internet",
        icon: Wifi,
        iconClass: "bg-blue-50 text-blue-600",
    },
    {
        id: "subscriptions",
        name: "Subscriptions",
        icon: CalendarDays,
        iconClass: "bg-violet-50 text-violet-600",
    },
    {
        id: "transportation",
        name: "Transportation",
        icon: Car,
        iconClass: "bg-orange-50 text-orange-600",
    },
    {
        id: "salary",
        name: "Salary",
        icon: Wallet,
        iconClass: "bg-green-50 text-green-600",
    },
];