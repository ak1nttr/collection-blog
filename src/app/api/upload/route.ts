import r2 from "@/lib/r2";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";

interface UploadResponse {
    success: boolean;
    fileName?: string;
    url?: string;
    error?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<UploadResponse>> {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
        }
        
        if (!file.type.startsWith('image/')) {
            return NextResponse.json({ success: false, error: 'Only image files are allowed' }, { status: 400 });
        }

        if (file.size > 10 * 1024 * 1024) {
            return NextResponse.json({ success: false, error: 'File size must be less than 10MB' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const timestamp = Date.now();
        const fileExtension = file.name.split('.').pop();
        const fileName = `posts/${timestamp}-${Math.random().toString(36).substring(7)}.${fileExtension}`;


        const command = new PutObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: fileName,
            Body: buffer,
            ContentType: file.type,
        });

        await r2.send(command);

        const fileUrl = `https://pub-${process.env.R2_DEVELOPMENT_ID}.r2.dev/${fileName}`;

        return NextResponse.json({
            success: true,
            fileName,
            url: fileUrl
        });

    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ success: false, error: "Upload failed" }, { status: 500 });
    }
}