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
		// Obtener token de las cookies
		const token = request.cookies.get("auth-token")?.value;

		if (!token) {
			// Si no hay token, redirigir a login
			const loginUrl = new URL("/login", request.url);
			loginUrl.searchParams.set("from", pathname);
			return NextResponse.redirect(loginUrl);
		}

		// Para mock data, simplemente verificar que el token exista
		// En producción, aquí se haría la validación real del token
		try {
			// Simular verificación de token
			// En mock, solo verificamos que el token tenga formato válido
			if (!token.startsWith("mock_token_")) {
				// Token inválido, redirigir a login
				const response = NextResponse.redirect(new URL("/login", request.url));
				response.cookies.delete("auth-token");
				return response;
			}

			// Extraer información básica del token mock
			const tokenParts = token.split("_");
			if (tokenParts.length < 3) {
				// Token mal formado
				const response = NextResponse.redirect(new URL("/login", request.url));
				response.cookies.delete("auth-token");
				return response;
			}

			const userId = tokenParts[2]; // mock_token_{userId}_{timestamp}

			// Agregar información del usuario a los headers para uso en las páginas
			const requestHeaders = new Headers(request.headers);
			requestHeaders.set("x-user-id", userId);

			return NextResponse.next({
				request: {
					headers: requestHeaders,
				},
			});
		} catch (error) {
			console.error("Error verificando token:", error);
			// En caso de error, redirigir a login
			const response = NextResponse.redirect(new URL("/login", request.url));
			response.cookies.delete("auth-token");
			return response;
		}
	}

	// Si el usuario está autenticado y trata de acceder a login, redirigir a admin
	if (pathname === "/login") {
		const token = request.cookies.get("auth-token")?.value;

		if (token?.startsWith("mock_token_")) {
			try {
				// Token válido, redirigir a admin
				return NextResponse.redirect(new URL("/admin", request.url));
			} catch (error) {
				// Si hay error, permitir acceso a login
				console.error("Error verificando autenticación:", error);
			}
		}
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
