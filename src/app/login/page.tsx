import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
			<div className="container mx-auto py-8 px-4 flex min-h-screen flex-col items-center justify-center">
				<div className="w-full max-w-sm md:max-w-3xl">
					<LoginForm />
				</div>
			</div>
		</div>
	);
}
