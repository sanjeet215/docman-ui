export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request): Promise<Response> {
  const backendBase = process.env.BACKEND_BASE_URL || "http://localhost:8080";
  const headers = new Headers();
  const contentType = req.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);
  try {
    const response = await fetch(`${backendBase.replace(/\/$/, "")}/api/pdf/split`, {
      method: "POST", headers, body: req.body, duplex: "half",
    } as RequestInit & { duplex: "half" });
    const responseHeaders = new Headers();
    for (const name of ["content-type", "content-disposition", "cache-control"]) {
      const value = response.headers.get(name);
      if (value) responseHeaders.set(name, value);
    }
    return new Response(response.body, { status: response.status, headers: responseHeaders });
  } catch {
    return new Response("PDF service is unavailable.", { status: 502 });
  }
}
