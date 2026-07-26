export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request): Promise<Response> {
  const backendBase =
    process.env.BACKEND_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "http://localhost:8080";

  const url = `${backendBase.replace(/\/$/, "")}/api/pdf/imageToPdf`;

  // Forward original headers selectively. Keep Content-Type (with boundary), and Authorization if present
  const headers = new Headers();
  const contentType = req.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);
  const auth = req.headers.get("authorization");
  if (auth) headers.set("authorization", auth);
  // Accept header is fine to forward
  const accept = req.headers.get("accept");
  if (accept) headers.set("accept", accept);

  try {
    const requestInit: RequestInit & { duplex: "half" } = {
      method: "POST",
      headers,
      body: req.body, // stream the multipart body through
      // Node.js requires this when forwarding a streaming request body.
      duplex: "half",
    };
    const res = await fetch(url, requestInit);

    // Stream response back to client
    const respHeaders = new Headers();
    // Pass through content type and disposition for download
    const resContentType = res.headers.get("content-type");
    if (resContentType) respHeaders.set("content-type", resContentType);
    const disposition = res.headers.get("content-disposition");
    if (disposition) respHeaders.set("content-disposition", disposition);

    // Also pass other useful headers
    const cacheControl = res.headers.get("cache-control");
    if (cacheControl) respHeaders.set("cache-control", cacheControl);

    return new Response(res.body, {
      status: res.status,
      statusText: res.statusText,
      headers: respHeaders,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Proxy request failed";
    return new Response(message, { status: 502 });
  }
}
