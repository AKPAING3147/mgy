import { NextRequest, NextResponse } from 'next/server';
import { SignJWT, jwtVerify } from 'jose';

// ============================================
// SECURITY CONFIGURATION
// ============================================

// JWT Secret - Should be in environment variables
const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'your-super-secure-jwt-secret-key-change-in-production'
);

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Security headers configuration
export const SECURITY_HEADERS = {
    // Prevent XSS attacks
    'X-XSS-Protection': '1; mode=block',
    // Prevent clickjacking
    'X-Frame-Options': 'DENY',
    // Prevent MIME type sniffing
    'X-Content-Type-Options': 'nosniff',
    // Referrer policy
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    // Permissions policy
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
    // Content Security Policy
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
    // HSTS - Force HTTPS
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
};

// ============================================
// JWT TOKEN MANAGEMENT
// ============================================

export interface TokenPayload {
    userId: string;
    email: string;
    role: string;
    iat?: number;
    exp?: number;
}

/**
 * Generate a secure JWT token
 */
export async function generateToken(payload: Omit<TokenPayload, 'iat' | 'exp'>): Promise<string> {
    return await new SignJWT({ ...payload })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d') // Token expires in 7 days
        .sign(JWT_SECRET);
}

/**
 * Verify and decode JWT token
 */
export async function verifyToken(token: string): Promise<TokenPayload | null> {
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        if (typeof payload.userId === 'string' && typeof payload.email === 'string' && typeof payload.role === 'string') {
            return {
                userId: payload.userId,
                email: payload.email,
                role: payload.role,
                iat: typeof payload.iat === 'number' ? payload.iat : undefined,
                exp: typeof payload.exp === 'number' ? payload.exp : undefined,
            };
        }
        return null;
    } catch {
        return null;
    }
}

// ============================================
// RATE LIMITING
// ============================================

interface RateLimitConfig {
    windowMs: number; // Time window in milliseconds
    maxRequests: number; // Max requests per window
}

const RATE_LIMIT_CONFIGS: Record<string, RateLimitConfig> = {
    login: { windowMs: 15 * 60 * 1000, maxRequests: 5 }, // 5 attempts per 15 minutes
    api: { windowMs: 60 * 1000, maxRequests: 100 }, // 100 requests per minute
    upload: { windowMs: 60 * 1000, maxRequests: 10 }, // 10 uploads per minute
};

/**
 * Check if request should be rate limited
 */
export function checkRateLimit(
    identifier: string,
    type: keyof typeof RATE_LIMIT_CONFIGS = 'api'
): { allowed: boolean; remaining: number; resetTime: number } {
    const config = RATE_LIMIT_CONFIGS[type];
    const now = Date.now();
    const key = `${type}:${identifier}`;

    const record = rateLimitStore.get(key);

    if (!record || now > record.resetTime) {
        // Create new rate limit record
        rateLimitStore.set(key, {
            count: 1,
            resetTime: now + config.windowMs
        });
        return { allowed: true, remaining: config.maxRequests - 1, resetTime: now + config.windowMs };
    }

    if (record.count >= config.maxRequests) {
        return { allowed: false, remaining: 0, resetTime: record.resetTime };
    }

    record.count++;
    return { allowed: true, remaining: config.maxRequests - record.count, resetTime: record.resetTime };
}

/**
 * Clear rate limit for an identifier
 */
export function clearRateLimit(identifier: string, type: string = 'api'): void {
    rateLimitStore.delete(`${type}:${identifier}`);
}

// ============================================
// INPUT SANITIZATION
// ============================================

/**
 * Sanitize string input to prevent XSS
 */
export function sanitizeString(input: string): string {
    if (typeof input !== 'string') return '';

    return input
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;')
        .trim();
}

/**
 * Sanitize object recursively
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
    const sanitized: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'string') {
            sanitized[key] = sanitizeString(value);
        } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            sanitized[key] = sanitizeObject(value as Record<string, unknown>);
        } else if (Array.isArray(value)) {
            sanitized[key] = value.map(item =>
                typeof item === 'string' ? sanitizeString(item) :
                    typeof item === 'object' && item !== null ? sanitizeObject(item as Record<string, unknown>) : item
            );
        } else {
            sanitized[key] = value;
        }
    }

    return sanitized as T;
}

// ============================================
// CSRF PROTECTION
// ============================================

/**
 * Generate CSRF token
 */
export function generateCSRFToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Validate CSRF token from request
 */
export function validateCSRFToken(request: NextRequest): boolean {
    const cookieToken = request.cookies.get('csrf_token')?.value;
    const headerToken = request.headers.get('X-CSRF-Token');

    if (!cookieToken || !headerToken) return false;

    // Constant-time comparison to prevent timing attacks
    if (cookieToken.length !== headerToken.length) return false;

    let result = 0;
    for (let i = 0; i < cookieToken.length; i++) {
        result |= cookieToken.charCodeAt(i) ^ headerToken.charCodeAt(i);
    }

    return result === 0;
}

// ============================================
// REQUEST VALIDATION
// ============================================

/**
 * Get client IP from request
 */
export function getClientIP(request: NextRequest): string {
    const forwarded = request.headers.get('x-forwarded-for');
    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }

    const realIP = request.headers.get('x-real-ip');
    if (realIP) {
        return realIP;
    }

    return '127.0.0.1';
}

/**
 * Validate admin session from request
 */
export async function validateAdminSession(request: NextRequest): Promise<TokenPayload | null> {
    const sessionCookie = request.cookies.get('admin_session')?.value;

    if (!sessionCookie) return null;

    const payload = await verifyToken(sessionCookie);

    if (!payload || payload.role !== 'ADMIN') return null;

    return payload;
}

// ============================================
// RESPONSE HELPERS
// ============================================

/**
 * Create secure response with security headers
 */
export function createSecureResponse(
    data: unknown,
    status: number = 200
): NextResponse {
    const response = NextResponse.json(data, { status });

    // Add security headers
    Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
        response.headers.set(key, value);
    });

    return response;
}

/**
 * Create rate limit error response
 */
export function createRateLimitResponse(resetTime: number): NextResponse {
    const retryAfter = Math.ceil((resetTime - Date.now()) / 1000);

    const response = NextResponse.json(
        {
            success: false,
            message: 'Too many requests. Please try again later.',
            retryAfter
        },
        { status: 429 }
    );

    response.headers.set('Retry-After', retryAfter.toString());

    return response;
}

/**
 * Create unauthorized response
 */
export function createUnauthorizedResponse(message: string = 'Unauthorized'): NextResponse {
    return createSecureResponse({ success: false, message }, 401);
}

/**
 * Create forbidden response
 */
export function createForbiddenResponse(message: string = 'Forbidden'): NextResponse {
    return createSecureResponse({ success: false, message }, 403);
}

// ============================================
// PASSWORD SECURITY
// ============================================

/**
 * Validate password strength
 */
export function validatePasswordStrength(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (password.length < 8) {
        errors.push('Password must be at least 8 characters long');
    }

    if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
    }

    if (!/[0-9]/.test(password)) {
        errors.push('Password must contain at least one number');
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.push('Password must contain at least one special character');
    }

    return { valid: errors.length === 0, errors };
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ============================================
// LOGGING (Security events)
// ============================================

export type SecurityEventType =
    | 'LOGIN_SUCCESS'
    | 'LOGIN_FAILED'
    | 'LOGOUT'
    | 'RATE_LIMIT_EXCEEDED'
    | 'INVALID_TOKEN'
    | 'CSRF_VIOLATION'
    | 'UNAUTHORIZED_ACCESS';

export function logSecurityEvent(
    type: SecurityEventType,
    details: Record<string, unknown>
): void {
    const timestamp = new Date().toISOString();
    const logEntry = {
        timestamp,
        type,
        ...details
    };

    // In production, send to proper logging service
    console.log(`[SECURITY] ${JSON.stringify(logEntry)}`);
}
