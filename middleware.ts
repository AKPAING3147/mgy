import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// ============================================
// SECURITY CONFIGURATION
// ============================================

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'your-super-secure-jwt-secret-key-change-in-production'
);

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Security headers
const SECURITY_HEADERS = {
    'X-XSS-Protection': '1; mode=block',
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
    'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com",
        "img-src 'self' data: https: blob:",
        "connect-src 'self' https:",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'self'"
    ].join('; '),
};

// Rate limit configurations
const RATE_LIMITS = {
    login: { windowMs: 15 * 60 * 1000, maxRequests: 5 }, // 5 attempts per 15 min
    api: { windowMs: 60 * 1000, maxRequests: 100 }, // 100 requests per minute
};

// ============================================
// HELPER FUNCTIONS
// ============================================

function getClientIP(request: NextRequest): string {
    const forwarded = request.headers.get('x-forwarded-for');
    if (forwarded) return forwarded.split(',')[0].trim();

    const realIP = request.headers.get('x-real-ip');
    if (realIP) return realIP;

    return '127.0.0.1';
}

function checkRateLimit(
    identifier: string,
    type: 'login' | 'api'
): { allowed: boolean; remaining: number; resetTime: number } {
    const config = RATE_LIMITS[type];
    const now = Date.now();
    const key = `${type}:${identifier}`;

    const record = rateLimitStore.get(key);

    if (!record || now > record.resetTime) {
        rateLimitStore.set(key, { count: 1, resetTime: now + config.windowMs });
        return { allowed: true, remaining: config.maxRequests - 1, resetTime: now + config.windowMs };
    }

    if (record.count >= config.maxRequests) {
        return { allowed: false, remaining: 0, resetTime: record.resetTime };
    }

    record.count++;
    return { allowed: true, remaining: config.maxRequests - record.count, resetTime: record.resetTime };
}

async function verifyAdminToken(token: string): Promise<boolean> {
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return payload.role === 'ADMIN';
    } catch {
        // Fallback to legacy base64 session format for backward compatibility
        try {
            const decoded = Buffer.from(token, 'base64').toString();
            return decoded.includes(':');
        } catch {
            return false;
        }
    }
}

function addSecurityHeaders(response: NextResponse): NextResponse {
    Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
        response.headers.set(key, value);
    });
    return response;
}

// ============================================
// MAIN MIDDLEWARE
// ============================================

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    const clientIP = getClientIP(request);

    // Create base response
    let response: NextResponse;

    // ========================================
    // RATE LIMITING FOR LOGIN
    // ========================================
    if (path === '/api/auth/login') {
        const rateLimit = checkRateLimit(clientIP, 'login');

        if (!rateLimit.allowed) {
            const retryAfter = Math.ceil((rateLimit.resetTime - Date.now()) / 1000);
            response = NextResponse.json(
                {
                    success: false,
                    message: 'Too many login attempts. Please try again later.',
                    retryAfter
                },
                { status: 429 }
            );
            response.headers.set('Retry-After', retryAfter.toString());
            return addSecurityHeaders(response);
        }
    }

    // ========================================
    // API RATE LIMITING
    // ========================================
    if (path.startsWith('/api/')) {
        const rateLimit = checkRateLimit(clientIP, 'api');

        if (!rateLimit.allowed) {
            const retryAfter = Math.ceil((rateLimit.resetTime - Date.now()) / 1000);
            response = NextResponse.json(
                {
                    success: false,
                    message: 'Too many requests. Please slow down.',
                    retryAfter
                },
                { status: 429 }
            );
            response.headers.set('Retry-After', retryAfter.toString());
            response.headers.set('X-RateLimit-Remaining', '0');
            return addSecurityHeaders(response);
        }
    }

    // ========================================
    // ADMIN ROUTE PROTECTION
    // ========================================
    if (path.startsWith('/admin')) {
        const adminSession = request.cookies.get('admin_session')?.value;

        // Allow access to login and setup pages
        if (path === '/admin/login' || path === '/admin/setup') {
            if (adminSession && await verifyAdminToken(adminSession)) {
                response = NextResponse.redirect(new URL('/admin', request.url));
                return addSecurityHeaders(response);
            }
            response = NextResponse.next();
            return addSecurityHeaders(response);
        }

        // Require valid session for all other admin pages
        if (!adminSession || !(await verifyAdminToken(adminSession))) {
            // Log security event
            console.log(`[SECURITY] Unauthorized admin access attempt from IP: ${clientIP}, Path: ${path}`);

            response = NextResponse.redirect(new URL('/admin/login', request.url));
            return addSecurityHeaders(response);
        }
    }

    // ========================================
    // PROTECTED API ROUTES (Admin Only)
    // ========================================
    const adminApiRoutes = [
        '/api/products',
        '/api/orders',
        '/api/upload',
        '/api/upload-product-image',
    ];

    const isAdminApiRoute = adminApiRoutes.some(route =>
        path.startsWith(route) && request.method !== 'GET'
    );

    if (isAdminApiRoute) {
        const adminSession = request.cookies.get('admin_session')?.value;

        if (!adminSession || !(await verifyAdminToken(adminSession))) {
            console.log(`[SECURITY] Unauthorized API access attempt from IP: ${clientIP}, Path: ${path}, Method: ${request.method}`);

            response = NextResponse.json(
                { success: false, message: 'Unauthorized' },
                { status: 401 }
            );
            return addSecurityHeaders(response);
        }
    }

    // ========================================
    // ADD SECURITY HEADERS TO ALL RESPONSES
    // ========================================
    response = NextResponse.next();
    return addSecurityHeaders(response);
}

export const config = {
    matcher: [
        // Match all paths except static files
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
