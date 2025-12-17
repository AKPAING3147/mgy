import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const data = await req.formData();
        const file: File | null = data.get("file") as unknown as File;
        const orderId = data.get("orderId") as string;

        if (!file || !orderId) {
            return NextResponse.json({ success: false, message: "Missing file or orderId" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Save to public/uploads
        const uploadDir = path.join(process.cwd(), "public", "uploads");

        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (e) {
            // ignore if exists
        }

        const filename = `${orderId}-${Date.now()}-${file.name.replace(/\s/g, '_')}`;
        const filepath = path.join(uploadDir, filename);

        await writeFile(filepath, buffer);

        // Update DB
        await prisma.order.update({
            where: { id: orderId },
            data: {
                paymentSlipUrl: `/uploads/${filename}`,
                paymentStatus: "REVIEW",
                status: "PAYMENT_REVIEW",
                updatedAt: new Date()
            }
        });

        return NextResponse.json({ success: true, url: `/uploads/${filename}` });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ success: false, message: "Upload failed" }, { status: 500 });
    }
}
