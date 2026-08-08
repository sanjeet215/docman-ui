export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const backend = () => (process.env.BACKEND_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080").replace(/\/$/, "");

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  return proxy(id, "PUT", await request.text(), request.headers.get("cookie"));
}
export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  return proxy(id, "DELETE", undefined, request.headers.get("cookie"));
}
async function proxy(id: string, method: string, body?: string, cookie?: string|null) {
  try {
    const response = await fetch(`${backend()}/api/workflows/${encodeURIComponent(id)}`, {
      method, body, headers: { ...(body ? { "content-type": "application/json" } : {}), ...(cookie ? {cookie}: {}) },
    });
    return new Response(response.body, { status: response.status, headers: { "content-type": response.headers.get("content-type") || "application/json" } });
  } catch (error) { return new Response(error instanceof Error ? error.message : "Workflow service unavailable", { status: 502 }); }
}
