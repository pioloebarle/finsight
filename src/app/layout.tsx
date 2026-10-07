import type { Metadata } from "next";
import "./globals.css";

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
        {children}
      </body>
    </html>
  );
}