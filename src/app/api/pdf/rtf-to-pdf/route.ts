import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const backendBase = process.env.BACKEND_BASE_URL ?? "http://localhost:8080";
  try {
    const response = await fetch(`${backendBase.replace(/\/$/, "")}/api/pdf/rtf-to-pdf`, {
      method: "POST",
      body: await request.formData(),
      cache: "no-store",
    });
    const body = await response.arrayBuffer();
    return new NextResponse(body, {
      status: response.status,
      headers: {
        "content-type": response.headers.get("content-type") ?? "application/octet-stream",
        "content-disposition": response.headers.get("content-disposition") ?? "",
        "cache-control": "no-store",
      },
    });
  } catch {
    return NextResponse.json({ message: "PDF service is unavailable." }, { status: 502 });
  }
}
