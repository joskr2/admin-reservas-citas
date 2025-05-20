// app/layout.tsx
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata = {
	title: "Mi App",
	description: "Descripción de mi app",
};

export default function RootLayout({
	children,
}: { children: React.ReactNode }) {
	return (
		<ClerkProvider>
			<html lang="es">
				<body
					className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning
				>
					{children}
				</body>
			</html>
		</ClerkProvider>
	);
}
