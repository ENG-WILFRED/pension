import { NextRequest, NextResponse } from 'next/server';

// NOTE: Middleware runs in the Edge runtime. Avoid importing Node-only
// modules (like `jsonwebtoken` or `bcrypt`) here because they will break
// the Edge/Turbopack environment. The middleware only checks presence of
// the `auth` cookie and redirects when missing. Full token verification
// happens inside API routes (server runtime).

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Public routes
  const publicRoutes = ['/', '/register', '/login'];
  const isPublicRoute = publicRoutes.includes(pathname);

  // Protected routes
  const protectedRoutes = ['/dashboard', '/payment'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute) {
    const cookieHeader = request.headers.get('cookie') || '';
    const hasAuthCookie = cookieHeader.split(';').some(c => c.trim().startsWith('auth='));

    if (!hasAuthCookie) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // If user hits login/register page and already has an auth cookie,
  // redirect to dashboard. We don't verify the token here to avoid
  // loading Node-only verification libs in the Edge runtime.
  if (pathname === '/login' || pathname === '/register') {
    const cookieHeader = request.headers.get('cookie') || '';
    const hasAuthCookie = cookieHeader.split(';').some(c => c.trim().startsWith('auth='));

    if (hasAuthCookie) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
