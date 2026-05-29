// Cloudflare R2 client (S3-compatible). Works with Backblaze B2 too —
// just swap R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY.

import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3';

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

// Returns true when R2 is configured enough to talk to. Used by the delete
// helpers to no-op cleanly in dev/test where R2 isn't wired up.
function r2Configured(): boolean {
  return Boolean(
    process.env.R2_ENDPOINT &&
      process.env.R2_ACCESS_KEY_ID &&
      process.env.R2_SECRET_ACCESS_KEY &&
      process.env.R2_BUCKET_NAME,
  );
}

// Best-effort single-key delete. Never throws — failure to clean up storage
// must not break the parent request (avatar replace, account delete, etc.).
export async function deleteFromR2(key: string): Promise<void> {
  if (!r2Configured() || !key) return;
  try {
    const s3 = getS3Client();
    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: key,
      }),
    );
  } catch (e) {
    console.error('[storage] deleteFromR2 failed', { key, error: e });
  }
}

// Best-effort delete-by-prefix. Lists and deletes in batches of up to 1000
// (S3 DeleteObjects max). Returns the count actually deleted. Swallows all
// errors — used for orphan cleanup, must never break the parent request.
export async function deletePrefixFromR2(prefix: string): Promise<number> {
  if (!r2Configured() || !prefix) return 0;
  const bucket = process.env.R2_BUCKET_NAME!;
  const s3 = getS3Client();
  let deleted = 0;
  let continuationToken: string | undefined;
  try {
    do {
      const list = await s3.send(
        new ListObjectsV2Command({
          Bucket: bucket,
          Prefix: prefix,
          ContinuationToken: continuationToken,
          MaxKeys: 1000,
        }),
      );
      const objects = (list.Contents ?? [])
        .map((o) => o.Key)
        .filter((k): k is string => typeof k === 'string');
      if (objects.length > 0) {
        const res = await s3.send(
          new DeleteObjectsCommand({
            Bucket: bucket,
            Delete: { Objects: objects.map((Key) => ({ Key })), Quiet: true },
          }),
        );
        deleted += objects.length - (res.Errors?.length ?? 0);
        if (res.Errors?.length) {
          console.error('[storage] deletePrefixFromR2 partial errors', {
            prefix,
            errors: res.Errors,
          });
        }
      }
      continuationToken = list.IsTruncated ? list.NextContinuationToken : undefined;
    } while (continuationToken);
  } catch (e) {
    console.error('[storage] deletePrefixFromR2 failed', { prefix, error: e });
  }
  return deleted;
}
