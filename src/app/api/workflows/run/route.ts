export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  const backendBase = process.env.BACKEND_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
  const headers = new Headers();
  const contentType = request.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);
  const cookie = request.headers.get("cookie");
  if (cookie) headers.set("cookie", cookie);
  for (const name of ["cf-connecting-ip", "cf-ipcountry", "x-forwarded-for", "user-agent"]) {
    const value = request.headers.get(name); if (value) headers.set(name, value);
  }
  try {
    const init: RequestInit & { duplex: "half" } = { method: "POST", headers, body: request.body, duplex: "half" };
    const response = await fetch(`${backendBase.replace(/\/$/, "")}/api/workflows/run`, init);
    const responseHeaders = new Headers();
    for (const name of ["content-type", "content-disposition", "x-workflow-run-id", "x-workflow-completed", "x-workflow-failed"]) {
      const value = response.headers.get(name);
      if (value) responseHeaders.set(name, value);
    }
    return new Response(response.body, { status: response.status, statusText: response.statusText, headers: responseHeaders });
  } catch (error) {
    return new Response(error instanceof Error ? error.message : "Unable to reach the workflow service", { status: 502 });
  }
}
