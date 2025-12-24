import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
    try {
        const data = await req.formData();
        const file: File | null = data.get("file") as unknown as File;
        const orderId = data.get("orderId") as string;

        if (!file || !orderId) {
            return NextResponse.json({ success: false, message: "Missing file or orderId" }, { status: 400 });
        }

        // Convert file to base64 for Cloudinary upload
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64 = buffer.toString('base64');
        const dataURI = `data:${file.type};base64,${base64}`;

        // Upload to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(dataURI, {
            folder: 'wedding-invitations/payment-slips',
            public_id: `${orderId}-${Date.now()}`,
            resource_type: 'image',
        });

        const cloudinaryUrl = uploadResult.secure_url;

        // Update DB with Cloudinary URL
        await prisma.order.update({
            where: { id: orderId },
            data: {
                paymentSlipUrl: cloudinaryUrl,
                paymentStatus: "REVIEW",
                status: "PAYMENT_REVIEW",
                updatedAt: new Date()
            }
        });

        return NextResponse.json({ success: true, url: cloudinaryUrl });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ success: false, message: "Upload failed" }, { status: 500 });
    }
}
