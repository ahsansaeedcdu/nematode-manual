// src/components/Footer/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-0 bg-[#DDEDFF] text-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* top */}
        <div className="grid grid-cols-1 gap-10 py-10 md:grid-cols-4">
          {/* brand / about */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white/80 shadow-sm">
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 text-teal-700">
                  <path
                    d="M3 15c3.5-3 6-1 7.5 0s3.5 2 6.5-1c2-2 3-6-1-8"
                    fill="none" stroke="currentColor" strokeWidth="1.6"
                    strokeLinecap="round" strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold">Plant-parasitic Nematodes in Northern Australia</p>
                <p className="text-xs text-slate-600">Field guide • biology </p>
              </div>
            </div>
            <p className="text-sm leading-6 text-slate-700">
              A practical reference for growers, students, and biosecurity in the NT &amp; northern Australia.
            </p>
          </div>

          {/* quick links */}
          <nav aria-label="Quick links">
            <h3 className="mb-3 text-sm font-semibold">Quick links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/"
                  className="rounded text-slate-700 underline-offset-2 hover:text-teal-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600/40"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/nematodes/map"
                  className="rounded text-slate-700 underline-offset-2 hover:text-teal-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600/40"
                >
                  Map
                </Link>
              </li>
              <li>
                <a
                  href="/#introduction"
                  className="rounded text-slate-700 underline-offset-2 hover:text-teal-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600/40"
                >
                  Introduction
                </a>
              </li>
              <li>
                <a
                  href="/#key-ppn"
                  className="rounded text-slate-700 underline-offset-2 hover:text-teal-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600/40"
                >
                  Key plant-parasitic nematodes
                </a>
              </li>
            </ul>
          </nav>

          {/* resources */}
          <nav aria-label="Resources">
            <h3 className="mb-3 text-sm font-semibold">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/assets/guide.pdf"
                  className="group inline-flex items-center gap-2 rounded text-slate-700 hover:text-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600/40"
                >
                  Field guide (PDF)
                  <svg viewBox="0 0 24 24" className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden="true">
                    <path d="M7 17L17 7M17 7H9m8 0v8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </a>
              </li>
              <li>
                <Link to="/image-gallery" className="text-slate-700 hover:text-teal-700">
                Image gallery
                </Link>
                </li>
              <li>
                <a
                  href="/#references"
                  className="rounded text-slate-700 hover:text-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600/40"
                >
                  References
                </a>
              </li>
            </ul>
          </nav>

          {/* contact */}
          <div>
            <h3 className="mb-3 text-sm font-semibold">Contact</h3>
            <ul className="space-y-2 text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 text-teal-700" aria-hidden="true">
                  <path d="M3 5h18v14H3zM3 5l9 7 9-7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <a href="mailto:info@example.edu.au" className="hover:text-teal-700">Yujuan.li@cdu.edu.au</a>
              </li>
              <li className="flex items-start gap-2">
                <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 text-teal-700" aria-hidden="true">
                  <path d="M12 2a7 7 0 017 7c0 5-7 13-7 13S5 14 5 9a7 7 0 017-7zm0 9a2 2 0 100-4 2 2 0 000 4z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Darwin, Northern Territory
              </li>
            </ul>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              type="button"
              className="mt-4 inline-flex items-center rounded-xl border border-slate-300 bg-white/80 px-3 py-1.5 text-sm text-slate-800 shadow-sm hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600/40"
            >
              ↑ Back to top
            </button>
          </div>
        </div>

        {/* bottom */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-300 py-6 text-xs text-slate-600 md:flex-row">
          <p>© {year} Plant-parasitic Nematodes in Northern Australia.</p>
          <p className="text-center">Built for education &amp; biosecurity awareness.</p>
        </div>
      </div>
    </footer>
  );
}
