const BLOB_HOST_SUFFIX = ".blob.vercel-storage.com";

export function getBlobImageSrc(url: string | null | undefined) {
  if (!url) return null;

  try {
    const parsed = new URL(url);
    if (!parsed.hostname.endsWith(BLOB_HOST_SUFFIX)) return url;
    return `/api/blob?url=${encodeURIComponent(url)}`;
  } catch {
    return url;
  }
}