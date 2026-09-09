import { NextResponse } from 'next/server';
import { uploadToS3 } from '@/lib/s3';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file uploaded' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = file.name || `upload_${Date.now()}.png`;
    const contentType = file.type || 'image/jpeg';

    const url = await uploadToS3(buffer, fileName, contentType);

    return NextResponse.json({
      success: true,
      url,
      fileName,
      size: file.size,
    });
  } catch (error: any) {
    console.error('Upload API Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'File upload failed' },
      { status: 500 }
    );
  }
}
