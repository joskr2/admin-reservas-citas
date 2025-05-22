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
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
