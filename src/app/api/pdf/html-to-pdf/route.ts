export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request): Promise<Response> {
  const backendBase =
    process.env.BACKEND_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "http://localhost:8080";
  try {
    const response = await fetch(`${backendBase.replace(/\/$/, "")}/api/pdf/html-to-pdf`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: await req.text(),
    });
    const headers = new Headers();
    for (const name of ["content-type", "content-disposition", "cache-control"]) {
      const value = response.headers.get(name);
      if (value) headers.set(name, value);
    }
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to reach the PDF service";
    return new Response(message, { status: 502 });
  }
}
