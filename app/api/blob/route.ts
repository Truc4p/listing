import { get } from "@vercel/blob";
import { NextResponse } from "next/server";

const BLOB_HOST_SUFFIX = ".blob.vercel-storage.com";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "Missing url" }, { status: 400 });
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    return NextResponse.json({ error: "Invalid url" }, { status: 400 });
  }

  if (!parsedUrl.hostname.endsWith(BLOB_HOST_SUFFIX)) {
    return NextResponse.json({ error: "Unsupported url" }, { status: 400 });
  }

  const blob = await get(url, {
    access: parsedUrl.hostname.includes(".private.") ? "private" : "public",
  });

  if (!blob) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return new Response(blob.stream, {
    headers: {
      "Content-Type": blob.contentType ?? "application/octet-stream",
      ...(blob.contentDisposition ? { "Content-Disposition": blob.contentDisposition } : {}),
      ...(blob.cacheControlMaxAge ? { "Cache-Control": `public, max-age=${blob.cacheControlMaxAge}` } : {}),
      ...(blob.etag ? { ETag: blob.etag } : {}),
    },
  });
}