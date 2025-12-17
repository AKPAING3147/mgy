import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
    try {
        const { email, password, name } = await req.json();

        // Check if admin already exists
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return NextResponse.json({ success: false, message: "User already exists" }, { status: 400 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create admin user
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name: name || "Admin",
                role: "ADMIN"
            }
        });

        return NextResponse.json({
            success: true,
            user: { id: user.id, email: user.email, name: user.name }
        });
    } catch (error) {
        console.error("Setup error:", error);
        return NextResponse.json({ success: false, message: "Setup failed" }, { status: 500 });
    }
}
