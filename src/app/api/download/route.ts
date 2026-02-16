import { NextRequest, NextResponse } from "next/server"

const mimeToExtension: Record<string, string> = {
  'video/mp4': '.mp4',
  'video/webm': '.webm',
  'video/quicktime': '.mov',
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/gif': '.gif',
  'image/webp': '.webp',
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url")

  if (!url) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 })
  }

  // Validate URL format
  try {
    new URL(url)
  } catch {
    return NextResponse.json({ error: "Invalid url" }, { status: 400 })
  }

  try {
    const response = await fetch(url)

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch file: ${response.status}` },
        { status: response.status }
      )
    }

    const contentType = response.headers.get("Content-Type") || "application/octet-stream"

    // Determine filename from URL or content type
    let filename = url.split("/").pop()?.split("?")[0] || "download"
    const hasExtension = /\.[a-zA-Z0-9]+$/.test(filename)
    if (!hasExtension) {
      const extension = mimeToExtension[contentType] || ""
      filename += extension
    }

    const headers = new Headers({
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    })

    const contentLength = response.headers.get("Content-Length")
    if (contentLength) {
      headers.set("Content-Length", contentLength)
    }

    return new NextResponse(response.body, { headers })
  } catch (error) {
    console.error("Download proxy error:", error)
    return NextResponse.json({ error: "Failed to download file" }, { status: 500 })
  }
}
