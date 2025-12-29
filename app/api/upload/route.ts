import { NextRequest, NextResponse } from "next/server";
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

        let fileUrl: string;

        // Check if Cloudinary is configured
        const hasCloudinary = process.env.CLOUDINARY_CLOUD_NAME &&
            process.env.CLOUDINARY_API_KEY &&
            process.env.CLOUDINARY_API_SECRET;

        if (!hasCloudinary) {
            // In development without Cloudinary, use local storage
            if (process.env.NODE_ENV === 'development') {
                fileUrl = await saveFileLocally(file, orderId, buffer);
            } else {
                // Production requires Cloudinary
                return NextResponse.json({
                    success: false,
                    message: "Cloudinary configuration required for production uploads. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET environment variables."
                }, { status: 500 });
            }
        } else {
            // Upload to Cloudinary
            try {
                const cloudinary = (await import("@/lib/cloudinary")).default;
                const base64 = buffer.toString('base64');
                const dataURI = `data:${file.type};base64,${base64}`;

                const uploadResult = await cloudinary.uploader.upload(dataURI, {
                    folder: 'wedding-invitations/payment-slips',
                    public_id: `${orderId}-${Date.now()}`,
                    resource_type: 'image',
                });

                fileUrl = uploadResult.secure_url;
            } catch (cloudinaryError) {
                console.error("Cloudinary upload failed:", cloudinaryError);
                return NextResponse.json({
                    success: false,
                    message: "Upload to Cloudinary failed: " + (cloudinaryError as Error).message
                }, { status: 500 });
            }
        }

        // Update DB with file URL
        await prisma.order.update({
            where: { id: orderId },
            data: {
                paymentSlipUrl: fileUrl,
                paymentStatus: "REVIEW",
                status: "PAYMENT_REVIEW",
                updatedAt: new Date()
            }
        });

        return NextResponse.json({ success: true, url: fileUrl });
    } catch (error) {
        console.error("Payment slip upload error:", error);
        return NextResponse.json({
            success: false,
            message: "Upload failed: " + (error as Error).message
        }, { status: 500 });
    }
}

async function saveFileLocally(file: File, orderId: string, buffer: Buffer): Promise<string> {
    // Only works in development - Vercel serverless doesn't support file system writes
    const { writeFile, mkdir } = await import("fs/promises");
    const path = await import("path");

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'payment-slips');
    await mkdir(uploadsDir, { recursive: true });

    const fileExtension = file.name.split('.').pop() || 'jpg';
    const fileName = `${orderId}-${Date.now()}.${fileExtension}`;
    const filePath = path.join(uploadsDir, fileName);

    await writeFile(filePath, buffer);

    return `/uploads/payment-slips/${fileName}`;
}
