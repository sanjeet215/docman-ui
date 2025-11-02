import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-lightBgCust dark:bg-darkBgCust text-gray-900 dark:text-white">
      <main className="max-w-4xl mx-auto p-6">
        {/* Hero */}
        <section className="text-center p-6">
          <h1 className="font-poppins text-3xl font-semibold mb-2">About DocManager</h1>
          <p className="font-roboto text-base text-gray-600 dark:text-gray-300">
            Simple, fast and secure tools to manage your PDFs and images.
          </p>
        </section>

        {/* What we do */}
        <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md p-6 mb-6">
          <h2 className="font-poppins text-xl font-semibold mb-3">Our Mission</h2>
          <p className="font-roboto text-gray-700 dark:text-gray-300">
            We help you work smarter with documents. Convert, compress and organize files
            without friction—right in your browser. No installs. No sign-ups required.
          </p>
        </section>

        {/* Highlights */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow p-5">
            <h3 className="font-poppins font-semibold mb-1">Lightning Fast</h3>
            <p className="font-roboto text-sm text-gray-700 dark:text-gray-300">Process files in seconds with a smooth, intuitive UI.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow p-5">
            <h3 className="font-poppins font-semibold mb-1">Privacy First</h3>
            <p className="font-roboto text-sm text-gray-700 dark:text-gray-300">Files are handled securely and can be removed after processing.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow p-5">
            <h3 className="font-poppins font-semibold mb-1">No Sign-Up</h3>
            <p className="font-roboto text-sm text-gray-700 dark:text-gray-300">Use tools instantly—no account required to get started.</p>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md p-6">
          <h2 className="font-poppins text-xl font-semibold mb-2">Have questions or ideas?</h2>
          <p className="font-roboto text-gray-700 dark:text-gray-300 mb-4">
            We are constantly improving DocManager. Share feedback or request a feature.
          </p>
          <Link
            href="/contact"
            className="inline-block px-5 py-2 rounded-lg font-semibold bg-darkButtonCust hover:bg-darkBgSecondarCust text-white transition"
          >
            Contact Us
          </Link>
        </section>
      </main>
    </div>
  );
}
