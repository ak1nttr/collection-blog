import { NextRequest, NextResponse } from "next/server";
import { getPresignedUrl } from "@/lib/r2-operations";

export async function POST(request: NextRequest) {
    try {
        const { imageKey } = await request.json();

        if (!imageKey) {
            return NextResponse.json({ error: 'Image key required' }, { status: 400 });
        }

        const signedUrl = await getPresignedUrl(imageKey, 3600);

        return NextResponse.json({ url: signedUrl });
    } catch (error) {
        console.error('Error generating presigned URL:', error);
        return NextResponse.json({ error: 'Failed to generate image URL' }, { status: 500 });
    }
}