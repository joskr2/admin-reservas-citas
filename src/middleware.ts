import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rutas que requieren autenticación
  const protectedRoutes = ['/admin'];
  
  // Verificar si la ruta actual requiere autenticación
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    // Verificar autenticación desde headers o cookies
    const isAuthenticated = request.cookies.get('authenticated')?.value === 'true' ||
                          request.headers.get('x-authenticated') === 'true';

    if (!isAuthenticated) {
      // Redirigir al login si no está autenticado
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Si está en /admin pero no ha seleccionado perfil, redirigir a profiles
    if (pathname === '/admin') {
      const hasProfile = request.cookies.get('selectedProfile')?.value;
      if (!hasProfile) {
        return NextResponse.redirect(new URL('/admin/profiles', request.url));
      }
    }
  }

  // Redirigir de login a profiles si ya está autenticado
  if (pathname === '/login') {
    const isAuthenticated = request.cookies.get('authenticated')?.value === 'true';
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/admin/profiles', request.url));
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
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};