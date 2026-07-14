import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function proxy(req: NextRequest) {
  // Sadece ana sayfa ve admin API'leri için şifre koruması uygula
  // Yönlendirme rotası (/r/[slug]) herkese açık kalmalı
  if (req.nextUrl.pathname === '/' || req.nextUrl.pathname.startsWith('/api/routers')) {
    const basicAuth = req.headers.get('authorization');
    const url = req.nextUrl;

    if (basicAuth) {
      const authValue = basicAuth.split(' ')[1];
      const [user, pwd] = atob(authValue).split(':');

      const expectedUser = process.env.ADMIN_USERNAME || 'admin';
      const expectedPwd = process.env.ADMIN_PASSWORD || '123456';

      if (user === expectedUser && pwd === expectedPwd) {
        return NextResponse.next();
      }
    }

    url.pathname = '/api/auth';
    return new NextResponse('Auth Required.', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Area"',
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/api/routers/:path*',
  ],
};
