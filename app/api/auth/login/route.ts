import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ success: false, message: "Email and password required" }, { status: 400 });
        }

        // Find admin user
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user || user.role !== "ADMIN") {
            return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
        }

        // Verify password
        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
            return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
        }

        // Create session (simple token for demo - in production use proper JWT)
        const sessionToken = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');

        const response = NextResponse.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });

        // Set HTTP-only cookie
        response.cookies.set('admin_session', sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/'
        });

        return response;
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({ success: false, message: "Login failed" }, { status: 500 });
    }
}
