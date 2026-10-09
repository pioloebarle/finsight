import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "FinSight",
  description: "A simple and intuitive personal budgeting app.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-finsight-background font-sans text-finsight-text antialiased">
        <Toaster position="bottom-right" expand={false} richColors={false} closeButton visibleToasts={4} gap={10} offset={24} 
          toastOptions={{ 
            duration: 5000, 
            classNames: { 
              toast: "!flex !items-start !gap-3 !rounded-xl !border !border-[#DCE5EA] !bg-white !px-4 !py-3.5 !shadow-[0_8px_30px_rgba(20,33,61,0.08)]", 
              title: "!text-sm !font-semibold !text-[#14213D]", 
              description: "!mt-1 !text-[13px] !leading-5 !text-[#536987]", 
              icon: "!mt-0.5", 
              success: "!border-l-[3px] !border-l-[#087F78]", 
              error: "!border-l-[3px] !border-l-[#DC2626]", 
              warning: "!border-l-[3px] !border-l-[#D97706]", 
              info: "!border-l-[3px] !border-l-[#2563EB]", 
              closeButton: "!border-[#DCE5EA] !bg-white !text-[#7487A0] hover:!bg-[#F6F8F9]", 
            }, 
          }} />
        {children}
      </body>
    </html>
  );
}