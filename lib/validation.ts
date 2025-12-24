import { z } from 'zod';

// ============================================
// COMMON VALIDATION SCHEMAS
// ============================================

/**
 * Email validation schema
 */
export const emailSchema = z
    .string()
    .email('Invalid email format')
    .max(255, 'Email is too long')
    .transform(val => val.toLowerCase().trim());

/**
 * Password validation schema
 */
export const passwordSchema = z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password is too long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character');

/**
 * Phone number validation schema
 */
export const phoneSchema = z
    .string()
    .min(5, 'Phone number is too short')
    .max(20, 'Phone number is too long')
    .regex(/^[\d\s+\-()]+$/, 'Invalid phone number format');

/**
 * Name validation schema
 */
export const nameSchema = z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name is too long')
    .regex(/^[a-zA-Z\s\-'.]+$/, 'Name contains invalid characters');

/**
 * Address validation schema
 */
export const addressSchema = z
    .string()
    .min(5, 'Address is too short')
    .max(500, 'Address is too long');

/**
 * ID validation schema (CUID format)
 */
export const idSchema = z
    .string()
    .min(1, 'ID is required')
    .max(50, 'ID is too long')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Invalid ID format');

// ============================================
// AUTH SCHEMAS
// ============================================

/**
 * Login request validation
 */
export const loginSchema = z.object({
    email: emailSchema,
    password: z.string().min(1, 'Password is required').max(128, 'Password is too long'),
});

/**
 * Admin setup validation
 */
export const adminSetupSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
    name: nameSchema.optional(),
});

// ============================================
// ORDER SCHEMAS
// ============================================

/**
 * Shipping details validation
 */
export const shippingSchema = z.object({
    fullName: nameSchema,
    email: emailSchema,
    phone: phoneSchema,
    address: addressSchema,
});

/**
 * Cart item validation
 */
export const cartItemSchema = z.object({
    product: z.object({
        id: idSchema,
        name: z.string().max(255),
        price: z.number().positive(),
    }),
    quantity: z.number().int().positive().max(10000),
    totalPrice: z.number().positive(),
    customization: z.record(z.string(), z.unknown()).optional(),
});

/**
 * Create order validation
 */
export const createOrderSchema = z.object({
    cartItems: z.array(cartItemSchema).min(1, 'Cart cannot be empty'),
    shipping: shippingSchema,
});

/**
 * Update order status validation
 */
export const updateOrderStatusSchema = z.object({
    orderId: idSchema,
    status: z.enum([
        'PENDING_PAYMENT',
        'PAYMENT_REVIEW',
        'APPROVED',
        'PRINTING',
        'SHIPPED',
        'COMPLETED',
        'CANCELLED',
        'DELETED'
    ]),
});

// ============================================
// PRODUCT SCHEMAS
// ============================================

/**
 * Product category validation
 */
export const categorySchema = z.enum([
    'classic',
    'modern',
    'floral',
    'minimalist',
    'luxury',
    'rustic',
    'traditional',
    'other'
]).or(z.string().min(1).max(50));

/**
 * Product creation validation
 */
export const createProductSchema = z.object({
    name: z.string()
        .min(1, 'Product name is required')
        .max(200, 'Product name is too long'),
    description: z.string()
        .min(1, 'Description is required')
        .max(2000, 'Description is too long'),
    price: z.union([
        z.number().positive('Price must be positive'),
        z.string().transform(val => parseFloat(val)).pipe(z.number().positive('Price must be positive'))
    ]),
    category: z.string().min(1, 'Category is required').max(50),
    images: z.array(z.string().min(1, 'Invalid image path')).min(1, 'At least one image is required').optional(),
    imageUrl: z.string().min(1, 'Invalid image path').optional(),
    minQuantity: z.union([
        z.number().int().positive(),
        z.string().transform(val => parseInt(val)).pipe(z.number().int().positive())
    ]).optional().default(1),
    stock: z.union([
        z.number().int().min(0),
        z.string().transform(val => parseInt(val)).pipe(z.number().int().min(0))
    ]).optional().default(0),
});

/**
 * Product update validation
 */
export const updateProductSchema = createProductSchema.partial().extend({
    id: idSchema,
});

// ============================================
// FILE UPLOAD SCHEMAS
// ============================================

/**
 * Allowed file types for uploads
 */
export const ALLOWED_IMAGE_TYPES = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif'
] as const;

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * Validate file upload
 */
export function validateFileUpload(file: File): { valid: boolean; error?: string } {
    if (!file) {
        return { valid: false, error: 'No file provided' };
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type as typeof ALLOWED_IMAGE_TYPES[number])) {
        return { valid: false, error: 'Invalid file type. Allowed: JPEG, PNG, WebP, GIF' };
    }

    if (file.size > MAX_FILE_SIZE) {
        return { valid: false, error: 'File size exceeds 5MB limit' };
    }

    return { valid: true };
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Safely parse and validate request body
 */
export async function parseAndValidate<T>(
    schema: z.ZodSchema<T>,
    data: unknown
): Promise<{ success: true; data: T } | { success: false; errors: string[] }> {
    try {
        const result = schema.safeParse(data);

        if (!result.success) {
            const errors = result.error.issues.map((err: z.ZodIssue) =>
                `${err.path.join('.')}: ${err.message}`
            );
            return { success: false, errors };
        }

        return { success: true, data: result.data };
    } catch (error) {
        return { success: false, errors: ['Invalid request data'] };
    }
}

/**
 * Validate request body with schema
 */
export function validateRequestBody<T>(
    schema: z.ZodSchema<T>,
    body: unknown
): { valid: true; data: T } | { valid: false; errors: z.ZodIssue[] } {
    const result = schema.safeParse(body);

    if (!result.success) {
        return { valid: false, errors: result.error.issues };
    }

    return { valid: true, data: result.data };
}

// ============================================
// SANITIZATION
// ============================================

/**
 * Strip HTML tags from string
 */
export function stripHtml(str: string): string {
    return str.replace(/<[^>]*>/g, '');
}

/**
 * Escape special regex characters
 */
export function escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Truncate string safely
 */
export function truncate(str: string, maxLength: number): string {
    if (str.length <= maxLength) return str;
    return str.slice(0, maxLength - 3) + '...';
}
