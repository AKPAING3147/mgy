
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";
import { generateToken, logSecurityEvent, createSecureResponse, checkRateLimit, createRateLimitResponse } from "@/lib/security";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
    try {
        // Rate limiter
        const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
        const { allowed, resetTime } = checkRateLimit(ip, "login");
        if (!allowed) {
            logSecurityEvent("RATE_LIMIT_EXCEEDED", { ip, type: "login" });
            return createRateLimitResponse(resetTime);
        }

        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ message: "Missing credentials" }, { status: 400 });
        }

        // Find user
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            logSecurityEvent("LOGIN_FAILED", { email, reason: "user_not_found" });
            return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
        }

        // Verify password
        // note: if user was created manually without bcrypt, this might fail unless we handle legacy passwords.
        // Assuming all new users are bcrypt. If existing admin uses plain text... unlikely given the setup.
        // However, if the user manually inserted the admin seed with a hashed password, we are good.
        const isValid = await compare(password, user.password);

        if (!isValid) {
            logSecurityEvent("LOGIN_FAILED", { email, reason: "invalid_password" });
            return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
        }

        // Generate token
        const token = await generateToken({
            userId: user.id,
            email: user.email,
            role: user.role,
        });

        logSecurityEvent("LOGIN_SUCCESS", { userId: user.id, role: user.role });

        // Set cookies
        const cookieStore = await cookies();

        // General auth token
        cookieStore.set("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: "/",
        });

        // If admin, also set admin_session for backward compatibility with lib/security helper
        if (user.role === "ADMIN") {
            cookieStore.set("admin_session", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 60 * 60 * 24 * 7, // 7 days
                path: "/",
            });
        }

        return createSecureResponse({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
