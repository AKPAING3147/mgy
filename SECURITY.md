# Security Implementation Guide

This document details the security measures implemented in the Wedding Invitations application.

## 🔐 Security Features Implemented

### 1. Authentication & Session Management

#### JWT-Based Authentication
- **Secure Token Generation**: Using `jose` library with HS256 algorithm
- **Token Expiration**: 7-day expiration with automatic refresh capability
- **Secure Cookie Storage**: HTTP-only, Secure (in production), SameSite=Strict

```typescript
// Cookies are configured with:
{
    httpOnly: true,      // Prevents XSS attacks from accessing cookies
    secure: true,        // Only sent over HTTPS in production
    sameSite: 'strict',  // Prevents CSRF attacks
    maxAge: 604800       // 7 days in seconds
}
```

#### Session Verification
- All admin routes are protected by middleware
- JWT tokens are verified on every request
- Invalid/expired tokens redirect to login

### 2. Rate Limiting

#### Login Protection
- **5 attempts per 15 minutes** per IP address
- Prevents brute force password attacks
- Returns 429 status with retry-after header

#### API Rate Limiting
- **100 requests per minute** per IP address
- Prevents DDoS and abuse
- Applies to all API routes

### 3. Input Validation & Sanitization

#### Zod Schema Validation
All user inputs are validated using Zod schemas:
- Email format validation
- Password strength requirements
- Phone number format
- Safe string lengths
- Type coercion and transformation

#### XSS Prevention
- HTML tags stripped from text inputs
- Special characters escaped
- Content Security Policy headers

### 4. Security Headers

| Header | Value | Purpose |
|--------|-------|---------|
| X-XSS-Protection | 1; mode=block | Browser XSS filter |
| X-Frame-Options | DENY | Clickjacking protection |
| X-Content-Type-Options | nosniff | MIME type sniffing prevention |
| Referrer-Policy | strict-origin-when-cross-origin | Referrer information control |
| Permissions-Policy | camera=(), microphone=()... | Feature restrictions |
| Strict-Transport-Security | max-age=31536000 | Force HTTPS (production) |
| Content-Security-Policy | Various directives | Content source restrictions |

### 5. API Security

#### Protected Routes
The following routes require admin authentication:
- `POST /api/products` - Create products
- `DELETE /api/products` - Archive products
- `POST /api/orders` - Modify orders
- `POST /api/upload` - File uploads

#### Price Verification
- Order totals are calculated server-side using database prices
- Client-provided prices are ignored
- Prevents price manipulation attacks

### 6. Password Security

#### Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

#### Storage
- Passwords hashed with bcrypt
- Salt rounds: 10
- Never stored or logged in plaintext

### 7. Logging & Monitoring

Security events are logged with timestamps:
- `[SECURITY] LOGIN_SUCCESS` - Successful admin logins
- `[SECURITY] LOGIN_FAILED` - Failed login attempts
- `[SECURITY] Unauthorized admin access` - Blocked access attempts
- `[ADMIN] Product created/archived` - Admin actions
- `[ORDER] New order created` - Order activity

## ⚙️ Environment Variables

Create a `.env.local` file with these secure configurations:

```env
# Database
DATABASE_URL="file:./dev.db"

# JWT Secret (MUST be changed in production!)
JWT_SECRET="your-very-long-random-secret-key-at-least-32-characters"

# Cloudinary (if using image uploads)
CLOUDINARY_URL="cloudinary://..."
```

### Generating a Secure JWT Secret

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Using OpenSSL
openssl rand -hex 64
```

## 🚀 Production Checklist

Before deploying to production:

- [ ] Set `NODE_ENV=production`
- [ ] Change `JWT_SECRET` to a unique, random value (64+ characters)
- [ ] Enable HTTPS (required for secure cookies)
- [ ] Configure proper database security
- [ ] Set up monitoring and alerting
- [ ] Enable rate limiting with Redis (for horizontal scaling)
- [ ] Review and test all security headers
- [ ] Perform security audit

## 📁 Security Files

| File | Purpose |
|------|---------|
| `lib/security.ts` | Core security utilities (JWT, rate limiting, etc.) |
| `lib/validation.ts` | Zod validation schemas |
| `middleware.ts` | Request-level security (auth, headers, rate limiting) |
| `next.config.ts` | Security headers configuration |

## 🔄 Updating Security

### Adding New Protected Routes

1. Add route to `adminApiRoutes` array in `middleware.ts`
2. Add Zod validation schema in `lib/validation.ts`
3. Use `parseAndValidate()` in the route handler

### Modifying Rate Limits

Edit `RATE_LIMITS` in `middleware.ts`:

```typescript
const RATE_LIMITS = {
    login: { windowMs: 15 * 60 * 1000, maxRequests: 5 },
    api: { windowMs: 60 * 1000, maxRequests: 100 },
};
```

## ⚠️ Known Limitations

1. **Rate Limiting Storage**: Currently uses in-memory Map. For production with multiple instances, use Redis.
2. **Session Revocation**: No server-side session invalidation. Tokens are valid until expiration.
3. **2FA**: Two-factor authentication not implemented.

## 🆘 Security Incident Response

If you suspect a security breach:

1. Rotate `JWT_SECRET` to invalidate all sessions
2. Check security logs for suspicious activity
3. Review recent admin actions
4. Update all admin passwords
5. Audit database for unauthorized changes
