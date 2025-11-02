import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    const isContactPayload = (x: unknown): x is { name: string; email: string; message: string } => {
      if (typeof x !== "object" || x === null) return false;
      const r = x as Record<string, unknown>;
      return (
        typeof r.name === "string" &&
        typeof r.email === "string" &&
        typeof r.message === "string"
      );
    };

    if (!isContactPayload(body)) {
      return NextResponse.json(
        { error: "Invalid request payload." },
        { status: 400 }
      );
    }

    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    // Basic email check
    const emailOk = /.+@.+\..+/.test(email);
    if (!emailOk) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    // TODO: Integrate email provider or ticketing system here.
    // For now, just log to server and return OK.
    console.log("Contact message received:", { name, email, message });

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Unable to process request" },
      { status: 500 }
    );
  }
}
