"use client";

import { ThemeProvider } from "next-themes";
import Header from "./custom/Header";
import Footer from "./custom/Footer";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="flex flex-col min-h-screen min-w-[320px] overflow-x-hidden">
        <Header />
        <div className="flex-1 w-full">{children}</div>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
