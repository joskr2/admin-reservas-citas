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
      <div className="flex flex-col min-h-screen min-w-[320px] overflow-x-hidden bg-gradient-to-br from-background via-background to-background relative">
        {/* Elementos decorativos de fondo */}
        <div className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none">
          <div className="absolute top-0 left-[10%] w-[500px] h-[500px] bg-primary/5 rounded-full mix-blend-multiply blur-3xl opacity-70" />
          <div className="absolute bottom-0 right-[20%] w-[400px] h-[400px] bg-secondary/10 rounded-full mix-blend-multiply blur-3xl opacity-70" />
          <div className="absolute top-[30%] right-[10%] w-[300px] h-[300px] bg-accent/5 rounded-full mix-blend-multiply blur-3xl opacity-70" />
        </div>

        <Header />
        <div className="flex-1 w-full z-10">{children}</div>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
