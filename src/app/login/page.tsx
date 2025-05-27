"use client";

import { LoginForm } from "@/components/login-form";
import { motion } from "framer-motion";

export default function LoginPage() {
	const fadeInUp = {
		initial: { opacity: 0, y: 60 },
		animate: { opacity: 1, y: 0 },
		transition: { duration: 0.6 },
	};

	return (
		<div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50">
			{/* Elementos decorativos de fondo */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl" />
				<div className="absolute top-1/2 -left-32 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-blue-600/20 rounded-full blur-3xl" />
				<div className="absolute -bottom-32 right-1/4 w-64 h-64 bg-gradient-to-br from-blue-300/20 to-purple-500/20 rounded-full blur-3xl" />
			</div>

			<motion.div
				className="relative flex min-h-screen flex-col items-center justify-center px-4 sm:px-6 lg:px-8"
				initial="initial"
				animate="animate"
			>
				<motion.div
					className="w-full max-w-sm md:max-w-3xl"
					variants={fadeInUp}
				>
					<LoginForm />
				</motion.div>
			</motion.div>
		</div>
	);
}
