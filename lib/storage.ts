// Cloudflare R2 client (S3-compatible). Works with Backblaze B2 too —
// just swap R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY.

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

let _client: S3Client | null = null;

export function getS3Client(): S3Client {
  if (!_client) {
    _client = new S3Client({
      region: 'auto',
      endpoint: process.env.R2_ENDPOINT!,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      },
    });
  }
  return _client;
}

export async function uploadToR2(
  key: string,
  body: Buffer | Uint8Array,
  contentType: string,
): Promise<string> {
  const s3 = getS3Client();
  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
      Body: body,
      ContentType: contentType,
    }),
  );
  return `${process.env.R2_PUBLIC_URL}/${key}`;
}
