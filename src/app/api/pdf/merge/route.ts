export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request): Promise<Response> {
  const backendBase =
    process.env.BACKEND_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "http://localhost:8080";

  const headers = new Headers();
  const contentType = req.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);
  const accept = req.headers.get("accept");
  if (accept) headers.set("accept", accept);

  try {
    const requestInit: RequestInit & { duplex: "half" } = {
      method: "POST",
      headers,
      body: req.body,
      duplex: "half",
    };
    const response = await fetch(`${backendBase.replace(/\/$/, "")}/api/pdf/merge`, requestInit);
    const responseHeaders = new Headers();
    for (const header of ["content-type", "content-disposition", "cache-control"]) {
      const value = response.headers.get(header);
      if (value) responseHeaders.set(header, value);
    }
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to reach the PDF service";
    return new Response(message, { status: 502 });
  }
}
