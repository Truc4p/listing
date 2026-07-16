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

  const responseHeaders = Object.fromEntries(blob.headers.entries());

  if (blob.statusCode === 304) {
    return new Response(null, {
      status: 304,
      headers: responseHeaders,
    });
  }

  return new Response(blob.stream, {
    headers: responseHeaders,
  });
}