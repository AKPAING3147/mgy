import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

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

        // Try Cloudinary first (if configured)
        const hasCloudinary = process.env.CLOUDINARY_CLOUD_NAME &&
            process.env.CLOUDINARY_API_KEY &&
            process.env.CLOUDINARY_API_SECRET;

        if (hasCloudinary) {
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
                console.error("Cloudinary upload failed, falling back to local storage:", cloudinaryError);
                fileUrl = await saveFileLocally(file, orderId, buffer);
            }
        } else {
            // Cloudinary not configured - use local storage
            fileUrl = await saveFileLocally(file, orderId, buffer);
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
    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'payment-slips');
    await mkdir(uploadsDir, { recursive: true });

    // Generate unique filename
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const fileName = `${orderId}-${Date.now()}.${fileExtension}`;
    const filePath = path.join(uploadsDir, fileName);

    // Save file
    await writeFile(filePath, buffer);

    // Return public URL
    return `/uploads/payment-slips/${fileName}`;
}
