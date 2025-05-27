import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import AppHeader from "@/components/layout/AppHeader";
import AppFooter from "@/components/layout/AppFooter";
import { AuthProvider } from "@/contexts/AuthContext";
import ThemeProvider from "@/components/theme-provider";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata = {
	title: "Sistema de Citas Horizonte",
	description: "Sistema de gestión de citas médicas para psicólogos",
};

export default function RootLayout({
	children,
}: { children: React.ReactNode }) {
	return (
		<html lang="es" suppressHydrationWarning>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<AuthProvider>
						<AppHeader />
						{children}
						<Toaster />
						<AppFooter />
					</AuthProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
