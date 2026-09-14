import { PutObjectCommand, DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';

const region = process.env.NEXT_PUBLIC_AWS_REGION || 'ap-south-1';
const accessKeyId = process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY;
const bucketName = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME || 'clubhachi-assets';

let s3Client: S3Client | null = null;

if (accessKeyId && secretAccessKey) {
  s3Client = new S3Client({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

/**
 * Uploads a binary buffer to AWS S3 and returns the public CDN/S3 URL
 */
export async function uploadToS3(
  fileBuffer: Buffer,
  fileName: string,
  customContentType?: string
): Promise<string> {
  if (!s3Client) {
    throw new Error('AWS S3 credentials are not configured in environment variables.');
  }

  const ext = fileName.split('.').pop()?.toLowerCase();
  const mimeTypes: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    gif: 'image/gif',
    svg: 'image/svg+xml',
    pdf: 'application/pdf',
    mp4: 'video/mp4',
    json: 'application/json',
  };

  const contentType = customContentType || mimeTypes[ext || ''] || 'application/octet-stream';
  const cleanKey = `products/${Date.now()}-${fileName.replace(/[^a-zA-Z0-9._-]/g, '_')}`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: cleanKey,
    Body: fileBuffer,
    ContentType: contentType,
  });

  await s3Client.send(command);

  return `https://${bucketName}.s3.${region}.amazonaws.com/${cleanKey}`;
}

/**
 * Deletes an object from AWS S3 given its full URL
 */
export async function deleteFromS3(fileUrl: string): Promise<boolean> {
  if (!s3Client || !fileUrl) return false;

  try {
    const urlObj = new URL(fileUrl);
    const key = urlObj.pathname.substring(1); // Strip leading slash

    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    await s3Client.send(command);
    return true;
  } catch (error) {
    console.error('Error deleting file from S3:', error);
    return false;
  }
}
