"use client";

import React, { useState } from "react";

const ContactPage: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const isErrorResponse = (x: unknown): x is { error: string } => {
    return (
      typeof x === "object" &&
      x !== null &&
      "error" in x &&
      typeof (x as Record<string, unknown>).error === "string"
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      if (!res.ok) {
        const data: unknown = await res.json().catch(() => ({}));
        throw new Error(isErrorResponse(data) ? data.error : "Something went wrong");
      }

      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err: unknown) {
      setStatus("error");
      const msg = err instanceof Error ? err.message : "Failed to send your message. Please try again.";
      setError(msg);
    }
  };

  return (
    <div className="min-h-screen bg-lightBgCust dark:bg-darkBgCust text-gray-900 dark:text-white">
      <main className="max-w-3xl mx-auto p-6">
        <section className="text-center p-6">
          <h1 className="font-poppins text-3xl font-semibold mb-2">Contact Us</h1>
          <p className="font-roboto text-base text-gray-600 dark:text-gray-300">
            Have a question, feedback, or feature request? Send us a message below.
          </p>
        </section>

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md p-6 space-y-4"
        >
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Your name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Message
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={5}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="How can we help?"
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={status === "loading"}
              className={`px-5 py-2 rounded-lg font-semibold transition ${
                status === "loading" ? "bg-gray-400 cursor-not-allowed" : "bg-darkButtonCust hover:bg-darkBgSecondarCust text-white"
              }`}
            >
              {status === "loading" ? "Sending..." : "Send Message"}
            </button>

            {status === "success" && (
              <span className="text-green-600 dark:text-green-400 text-sm">Thanks! We will be in touch.</span>
            )}
            {status === "error" && (
              <span className="text-red-600 dark:text-red-400 text-sm">{error}</span>
            )}
          </div>
        </form>

        <section className="mt-8 text-sm text-gray-600 dark:text-gray-400">
          <p>
            Prefer email? Reach us at <a className="underline" href="mailto:support@example.com">support@example.com</a>.
          </p>
        </section>
      </main>
    </div>
  );
};

export default ContactPage;
