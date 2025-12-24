import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { loginSchema, parseAndValidate } from "@/lib/validation";

// JWT Secret - Should be in environment variables
const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'your-super-secure-jwt-secret-key-change-in-production'
);

export async function POST(req: NextRequest) {
    const startTime = Date.now();

    try {
        const body = await req.json();

        // Validate input
        const validation = await parseAndValidate(loginSchema, body);
        if (!validation.success) {
            console.log(`[SECURITY] Login validation failed: ${validation.errors.join(', ')}`);
            return NextResponse.json(
                { success: false, message: "Invalid email or password format" },
                { status: 400 }
            );
        }

        const { email, password } = validation.data;

        // Find admin user (use constant time to prevent timing attacks)
        const user = await prisma.user.findUnique({
            where: { email }
        });

        // Always check password even if user not found (constant time comparison)
        const dummyHash = "$2a$10$GuestPasswordHashPlaceholder1234567";
        const isValid = await bcrypt.compare(password, user?.password || dummyHash);

        if (!user || user.role !== "ADMIN" || !isValid) {
            // Log failed login attempt
            console.log(`[SECURITY] LOGIN_FAILED - Email: ${email}, IP: ${req.headers.get('x-forwarded-for') || 'unknown'}`);

            // Add slight delay to prevent timing attacks
            await new Promise(resolve => setTimeout(resolve, 100));

            return NextResponse.json(
                { success: false, message: "Invalid credentials" },
                { status: 401 }
            );
        }

        // Generate secure JWT token
        const token = await new SignJWT({
            userId: user.id,
            email: user.email,
            role: user.role
        })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('7d')
            .sign(JWT_SECRET);

        // Log successful login
        console.log(`[SECURITY] LOGIN_SUCCESS - User: ${user.email}, IP: ${req.headers.get('x-forwarded-for') || 'unknown'}`);

        const response = NextResponse.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });

        // Set secure HTTP-only cookie
        response.cookies.set('admin_session', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict', // Stricter than 'lax' for better security
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/'
        });

        return response;
    } catch (error) {
        console.error("[SECURITY] Login error:", error);
        return NextResponse.json(
            { success: false, message: "Login failed" },
            { status: 500 }
        );
    }
}

