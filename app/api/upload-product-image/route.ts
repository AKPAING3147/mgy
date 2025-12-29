import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
    try {
        const data = await req.formData();
        const file: File | null = data.get("file") as unknown as File;

        if (!file) {
            return NextResponse.json({ success: false, message: "No file uploaded" }, { status: 400 });
        }

        // Convert file to base64 for Cloudinary upload
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64 = buffer.toString('base64');
        const dataURI = `data:${file.type};base64,${base64}`;

        // Upload to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(dataURI, {
            folder: 'wedding-invitations/products',
            public_id: `product-${Date.now()}`,
            resource_type: 'image',
            transformation: [
                { width: 800, height: 1000, crop: 'limit' }, // Optimize image size
                { quality: 'auto:good' }, // Auto quality optimization
                { fetch_format: 'auto' } // Auto format (webp where supported)
            ]
        });

        // Return Cloudinary URL
        const cloudinaryUrl = uploadResult.secure_url;

        return NextResponse.json({ success: true, url: cloudinaryUrl });
    } catch (error) {
        console.error("Upload error details:", error);
        return NextResponse.json({ success: false, message: "Upload failed: " + (error as Error).message }, { status: 500 });
    }
}
