import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

const recipient = "sanjeet215@gmail.com";
const attempts = new Map<string, number[]>();

function clean(value: string) {
  return value.replace(/[\u0000-\u001f\u007f]/g, " ").trim();
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;",
  })[character] ?? character);
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as Record<string, unknown>;
    const name = typeof body.name === "string" ? clean(body.name) : "";
    const email = typeof body.email === "string" ? clean(body.email).toLowerCase() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";
    const website = typeof body.website === "string" ? body.website : "";

    if (website) return NextResponse.json({ ok: true });
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required." }, { status: 400 });
    }
    if (name.length > 100 || email.length > 254 || message.length > 5000
        || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Please check the information you entered." }, { status: 400 });
    }

    const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
    const key = forwarded || "unknown";
    const now = Date.now();
    const recent = (attempts.get(key) ?? []).filter((time) => now - time < 15 * 60_000);
    if (recent.length >= 5) {
      return NextResponse.json({ error: "Too many messages. Please try again later." }, { status: 429 });
    }
    recent.push(now);
    attempts.set(key, recent);

    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    if (!smtpUser || !smtpPass) {
      console.error("Contact email is not configured: SMTP_USER or SMTP_PASS is missing");
      return NextResponse.json({ error: "Email delivery is temporarily unavailable." }, { status: 503 });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT || 465),
      secure: (process.env.SMTP_SECURE || "true") === "true",
      auth: { user: smtpUser, pass: smtpPass },
    });
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeMessage = escapeHtml(message).replace(/\n/g, "<br>");
    await transporter.sendMail({
      from: `"DevPour Contact" <${smtpUser}>`,
      to: recipient,
      replyTo: email,
      subject: `DevPour contact from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      html: `<h2>New DevPour contact message</h2><p><strong>Name:</strong> ${safeName}</p><p><strong>Email:</strong> ${safeEmail}</p><hr><p>${safeMessage}</p>`,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact email delivery failed", error);
    return NextResponse.json({ error: "We could not send your message. Please try again." }, { status: 500 });
  }
}
