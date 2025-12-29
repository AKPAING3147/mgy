
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { validateEmail, validatePasswordStrength, createSecureResponse, generateToken, logSecurityEvent } from "@/lib/security";

export async function POST(req: NextRequest) {
    try {
        const { name, email, password } = await req.json();

        // 1. Validation
        if (!name || !email || !password) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        if (!validateEmail(email)) {
            return NextResponse.json({ message: "Invalid email format" }, { status: 400 });
        }

        const { valid, errors } = validatePasswordStrength(password);
        if (!valid) {
            return NextResponse.json({ message: errors[0] }, { status: 400 });
        }

        // 2. Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json({ message: "User with this email already exists" }, { status: 409 });
        }

        // 3. Hash password
        const hashedPassword = await hash(password, 12);

        // 4. Create user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: "USER", // Default role
            },
        });

        logSecurityEvent('LOGIN_SUCCESS', { userId: user.id, email: user.email, method: 'register' });

        // 5. Success with auto-login token
        // We could set cookie here, but let's just return success and let them sign in, or client handles redirect.
        // For better UX, let's just redirect to login or home.

        return createSecureResponse({
            success: true,
            message: "Account created successfully"
        }, 201);

    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
