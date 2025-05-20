"use client";

import { ThemeProvider } from "next-themes";
import Header from "./custom/Header";

export default function ClientLayout({
	children,
}: { children: React.ReactNode }) {
	return (
		<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
			<Header />
			{children}
		</ThemeProvider>
	);
}
