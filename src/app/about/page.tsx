import Link from "next/link";
import { ButtonLink } from "../components/Button";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-lightBgCust dark:bg-darkBgCust text-gray-900 dark:text-white">
      <main className="max-w-5xl mx-auto p-6">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-2xl p-8 md:p-10 mb-6 bg-gradient-to-br from-lightButtonCust/15 via-transparent to-lightBgSecondarCust/30 dark:from-darkBgSecondarCust/30 dark:via-transparent dark:to-darkBgCust border border-gray-200/60 dark:border-gray-700 text-center">
          <h1 className="font-poppins text-3xl md:text-4xl font-semibold mb-3">About Us</h1>
          <p className="font-roboto text-base md:text-lg text-gray-700 dark:text-gray-300">
            We build modern, privacy‑first tools that simplify everyday work. Our mission is to create fast,
            intuitive experiences that help people and teams get more done with less effort.
          </p>
        </section>

        {/* Our Story */}
        <section className="bg-white dark:bg-gray-900/40 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-md p-6 mb-6 prose max-w-none w-full prose-neutral dark:prose-invert">
          <h2 className="font-poppins text-xl font-semibold mb-3">Our Story</h2>
          <p className="font-roboto text-gray-700 dark:text-gray-300">
            We started with a simple belief: great tools should get out of your way. Our team has shipped
            products used by thousands, and we’re obsessed with delivering speed, clarity, and trust—without
            unnecessary complexity. Today, we’re building a suite of focused utilities that help individuals
            and teams accomplish everyday tasks effortlessly.
          </p>
        </section>

        {/* Our Team */}
        <section className="bg-white dark:bg-gray-900/40 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-md p-6 mb-6">
          <h2 className="font-poppins text-xl font-semibold mb-4">Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* Member 1 */}
            <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-800/70 ring-1 ring-gray-300/60 dark:ring-gray-700/50">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-lightButtonCust/20 text-lightButtonCust dark:bg-darkButtonCust/20 dark:text-darkButtonCust font-poppins font-semibold">
                SJ
              </div>
              <div>
                <p className="font-poppins text-sm font-semibold">Sanj</p>
                <p className="font-roboto text-xs text-gray-600 dark:text-gray-400">Founder & Product</p>
              </div>
            </div>

            {/* Member 2 */}
            <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-lightButtonCust/20 text-lightButtonCust dark:bg-darkButtonCust/20 dark:text-darkButtonCust font-poppins font-semibold">
                AE
              </div>
              <div>
                <p className="font-poppins text-sm font-semibold">Alex</p>
                <p className="font-roboto text-xs text-gray-600 dark:text-gray-400">Engineering</p>
              </div>
            </div>

            {/* Member 3 */}
            <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-lightButtonCust/20 text-lightButtonCust dark:bg-darkButtonCust/20 dark:text-darkButtonCust font-poppins font-semibold">
                DS
              </div>
              <div>
                <p className="font-poppins text-sm font-semibold">Dee</p>
                <p className="font-roboto text-xs text-gray-600 dark:text-gray-400">Design</p>
              </div>
            </div>
          </div>
        </section>

        {/* What we do */}
        <section className="bg-white dark:bg-gray-900/40 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-md p-6 mb-6 prose max-w-none w-full prose-neutral dark:prose-invert">
          <h2 className="font-poppins text-xl font-semibold mb-3">Our Mission</h2>
          <p className="font-roboto text-gray-700 dark:text-gray-300">
            We’re focused on building reliable, accessible software that respects your time and your data.
            From seamless UX to robust security, we design every feature to be fast, trustworthy, and delightful.
          </p>
        </section>

        {/* Highlights */}
        <section className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5 gap-y-5 items-stretch mt-6 mb-6">
          <div className="w-full min-w-0 bg-white dark:bg-gray-900/40 border border-gray-200 dark:border-gray-800 rounded-2xl shadow p-5 h-44 flex flex-col overflow-hidden break-words hyphens-auto">
            <h3 className="font-poppins font-semibold mb-1">Customer‑First</h3>
            <p className="font-roboto text-sm text-gray-700 dark:text-gray-300">We listen, iterate, and ship features that genuinely help users succeed.</p>
          </div>
          <div className="w-full min-w-0 bg-white dark:bg-gray-900/40 border border-gray-200 dark:border-gray-800 rounded-2xl shadow p-5 h-44 flex flex-col overflow-hidden break-words hyphens-auto">
            <h3 className="font-poppins font-semibold mb-1">Privacy & Trust</h3>
            <p className="font-roboto text-sm text-gray-700 dark:text-gray-300">Your data is yours. We design with security and transparency at the core.</p>
          </div>
          <div className="w-full min-w-0 bg-white dark:bg-gray-900/40 border border-gray-200 dark:border-gray-800 rounded-2xl shadow p-5 h-44 flex flex-col overflow-hidden break-words hyphens-auto">
            <h3 className="font-poppins font-semibold mb-1">Performance</h3>
            <p className="font-roboto text-sm text-gray-700 dark:text-gray-300">Fast, dependable experiences across devices—no bloat, just results.</p>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-white dark:bg-gray-900/40 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-md p-6 prose prose-neutral dark:prose-invert">
          <h2 className="font-poppins text-xl font-semibold mb-2">Have questions or ideas?</h2>
          <p className="font-roboto text-gray-700 dark:text-gray-300 mb-4">
            We’re building in the open with our users. Share feedback, propose a feature, or just say hello.
          </p>
          <ButtonLink href="/contact">Contact Us</ButtonLink>
        </section>
      </main>
    </div>
  );
}
