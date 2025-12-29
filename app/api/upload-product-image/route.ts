import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const data = await req.formData();
        const file: File | null = data.get("file") as unknown as File;

        if (!file) {
            return NextResponse.json({ success: false, message: "No file uploaded" }, { status: 400 });
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
                fileUrl = await saveFileLocally(file, buffer);
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
                    folder: 'wedding-invitations/products',
                    public_id: `product-${Date.now()}`,
                    resource_type: 'image',
                    transformation: [
                        { width: 800, height: 1000, crop: 'limit' },
                        { quality: 'auto:good' },
                        { fetch_format: 'auto' }
                    ]
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

        return NextResponse.json({ success: true, url: fileUrl });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({
            success: false,
            message: "Upload failed: " + (error as Error).message
        }, { status: 500 });
    }
}

async function saveFileLocally(file: File, buffer: Buffer): Promise<string> {
    // Only works in development - Vercel serverless doesn't support file system writes
    const { writeFile, mkdir } = await import("fs/promises");
    const path = await import("path");

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'products');
    await mkdir(uploadsDir, { recursive: true });

    // Generate unique filename
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const fileName = `product-${Date.now()}.${fileExtension}`;
    const filePath = path.join(uploadsDir, fileName);

    // Save file
    await writeFile(filePath, buffer);

    // Return public URL
    return `/uploads/products/${fileName}`;
}
