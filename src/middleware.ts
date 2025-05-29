import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// Rutas públicas que no requieren autenticación
	const publicRoutes = ["/", "/login", "/register", "/forgot-password"];
	const isPublicRoute = publicRoutes.includes(pathname);

	// Rutas que requieren autenticación
	const protectedRoutes = [
		"/admin",
		"/admin/citas",
		"/admin/citas/nueva",
		"/admin/profiles",
	];
	const isProtectedRoute = protectedRoutes.some((route) =>
		pathname.startsWith(route),
	);

	if (isProtectedRoute) {
		// 🔧 BUSCAR TOKEN EN COOKIES (COINCIDE CON AuthContext)
		const token = request.cookies.get("auth-token")?.value;

		console.log(
			"🔍 Middleware - Verificando token:",
			token ? "Existe" : "No existe",
		);
		console.log("🔍 Middleware - Ruta:", pathname);

		if (!token) {
			console.log("❌ Middleware - Sin token, redirigiendo a login");
			// Si no hay token, redirigir a login
			const loginUrl = new URL("/login", request.url);
			loginUrl.searchParams.set("from", pathname);
			return NextResponse.redirect(loginUrl);
		}

		// Para mock data, verificar que el token tenga formato válido
		try {
			// 🔧 VERIFICACIÓN MEJORADA DEL TOKEN MOCK
			if (!token.startsWith("mock_token_")) {
				console.log("❌ Middleware - Token inválido, no es mock");
				// Token inválido, redirigir a login
				const response = NextResponse.redirect(new URL("/login", request.url));
				response.cookies.delete("auth-token");
				return response;
			}

			// Extraer información básica del token mock
			const tokenParts = token.split("_");
			if (tokenParts.length < 3) {
				console.log("❌ Middleware - Token mal formado");
				// Token mal formado
				const response = NextResponse.redirect(new URL("/login", request.url));
				response.cookies.delete("auth-token");
				return response;
			}

			const userId = tokenParts[2]; // mock_token_{userId}_{timestamp}
			const timestamp = tokenParts[3];

			// 🆕 VERIFICAR QUE EL TOKEN NO SEA MUY VIEJO (OPCIONAL)
			const tokenAge = Date.now() - +(timestamp);
			const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 días

			if (tokenAge > maxAge) {
				console.log("❌ Middleware - Token expirado");
				const response = NextResponse.redirect(new URL("/login", request.url));
				response.cookies.delete("auth-token");
				return response;
			}

			console.log("✅ Middleware - Token válido para usuario:", userId);

			// Agregar información del usuario a los headers para uso en las páginas
			const requestHeaders = new Headers(request.headers);
			requestHeaders.set("x-user-id", userId);
			requestHeaders.set("x-token-valid", "true");

			return NextResponse.next({
				request: {
					headers: requestHeaders,
				},
			});
		} catch (error) {
			console.error("❌ Middleware - Error verificando token:", error);
			// En caso de error, redirigir a login
			const response = NextResponse.redirect(new URL("/login", request.url));
			response.cookies.delete("auth-token");
			return response;
		}
	}

	// 🔧 MEJORAR REDIRECCIÓN DESDE LOGIN
	if (pathname === "/login") {
		const token = request.cookies.get("auth-token")?.value;

		if (token?.startsWith("mock_token_")) {
			try {
				const tokenParts = token.split("_");
				if (tokenParts.length >= 3) {
					const timestamp = tokenParts[3];
					const tokenAge = Date.now() - +(timestamp);
					const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 días

					// Si el token es válido y no ha expirado
					if (tokenAge <= maxAge) {
						console.log("✅ Middleware - Usuario ya autenticado, redirigiendo");
						return NextResponse.redirect(new URL("/admin/citas", request.url));
					}
				}
			} catch (error) {
				console.error(
					"❌ Middleware - Error verificando token en login:",
					error,
				);
				// Si hay error, permitir acceso a login pero limpiar cookie
				const response = NextResponse.next();
				response.cookies.delete("auth-token");
				return response;
			}
		}
	}

	// 🆕 LOGGING PARA DEBUG (REMOVER EN PRODUCCIÓN)
	if (process.env.NODE_ENV === "development") {
		console.log(
			`🔍 Middleware - ${pathname} - ${isProtectedRoute ? "Protegida" : "Pública"}`,
		);
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - public assets
		 */
		"/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.svg|.*\\.webp).*)",
	],
};
