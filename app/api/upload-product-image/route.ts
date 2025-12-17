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

        // Save to public/products
        const uploadDir = path.join(process.cwd(), "public", "products");

        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (e) {
            // Directory already exists
        }

        // Generate unique filename
        const filename = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
        const filepath = path.join(uploadDir, filename);

        await writeFile(filepath, buffer);

        // Return public URL
        const publicUrl = `/products/${filename}`;

        return NextResponse.json({ success: true, url: publicUrl });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ success: false, message: "Upload failed" }, { status: 500 });
    }
}
