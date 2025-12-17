import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
    try {
        const data = await req.formData();
        const file: File | null = data.get("file") as unknown as File;

        if (!file) {
            return NextResponse.json({ success: false, message: "No file uploaded" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Check if Cloudinary is configured
        const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
        const apiKey = process.env.CLOUDINARY_API_KEY;
        const apiSecret = process.env.CLOUDINARY_API_SECRET;

        if (cloudName && apiKey && apiSecret && cloudName !== "your_cloud_name") {
            // Use Cloudinary
            try {
                const { v2: cloudinary } = await import('cloudinary');

                cloudinary.config({
                    cloud_name: cloudName,
                    api_key: apiKey,
                    api_secret: apiSecret,
                });

                const base64 = buffer.toString("base64");
                const mimeType = file.type;
                const dataUri = `data:${mimeType};base64,${base64}`;

                const result = await cloudinary.uploader.upload(dataUri, {
                    folder: "mgy-offset/products",
                    resource_type: "auto",
                });

                return NextResponse.json({
                    success: true,
                    url: result.secure_url,
                    source: "cloudinary"
                });
            } catch (cloudError) {
                console.error("Cloudinary error:", cloudError);
                // Fall through to local storage
            }
        }

        // Fallback: Save locally
        const uploadDir = path.join(process.cwd(), "public", "products");

        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (e) {
            // Directory exists
        }

        const filename = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
        const filepath = path.join(uploadDir, filename);

        await writeFile(filepath, buffer);

        const publicUrl = `/products/${filename}`;

        return NextResponse.json({
            success: true,
            url: publicUrl,
            source: "local"
        });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({
            success: false,
            message: "Upload failed"
        }, { status: 500 });
    }
}
