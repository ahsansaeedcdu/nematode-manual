// src/components/Footer/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import Footnotes from "./Footnotes";
import Disclaimer from "./Disclaimer";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-0" aria-labelledby="footer-heading">
      {/* Top band — purple multi-column area */}
      <div className="bg-[#DDEDFF] text-black">
        <h2 id="footer-heading" className="sr-only">Footer</h2>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-4 lg:grid-cols-5">
            {/* Col 1: Site blurb */}
            <div className="space-y-3 lg:col-span-2">
              <p className="text-base font-semibold">
                Plant-parasitic Nematodes in Northern Australia
              </p>
              <p className="text-sm opacity-90">
                A practical reference for growers, students, and biosecurity in the NT &amp; northern Australia.
              </p>
            </div>

            {/* Col 2: Quick links */}
            <nav aria-label="Quick links" className="space-y-3">
              <p className="text-base font-semibold">Quick links</p>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="hover:underline underline-offset-4">Home</Link></li>
                <li><Link to="/nematodes/map" className="hover:underline underline-offset-4">Map</Link></li>
                <li><a href="/#introduction" className="hover:underline underline-offset-4">Introduction</a></li>
                <li><a href="/#key-ppn" className="hover:underline underline-offset-4">Key plant-parasitic nematodes</a></li>
                {/* NEW: Acknowledgments & Contributors */}
                <li><Link to="/acknowledgments" className="hover:underline underline-offset-4">Acknowledgments</Link></li>
                <li><Link to="/contributors" className="hover:underline underline-offset-4">Contributors</Link></li>
              </ul>
            </nav>

            {/* Col 3: Resources */}
            <nav aria-label="Resources" className="space-y-3">
              <p className="text-base font-semibold">Resources</p>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="/assets/guide.pdf" className="inline-flex items-center gap-2 hover:underline underline-offset-4">
                    Field guide (PDF)
                    <svg viewBox="0 0 24 24" className="h-4 w-4 text-black" aria-hidden="true">
                      <path d="M7 17L17 7M17 7H9m8 0v8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                  </a>
                </li>
                <li><Link to="/image-gallery" className="hover:underline underline-offset-4">Image gallery</Link></li>
                <li><a href="/#references" className="hover:underline underline-offset-4">References</a></li>
              </ul>
            </nav>

            {/* Col 4: Contact + social icons */}
            <div className="space-y-3">
              <p className="text-base font-semibold">Contact</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 text-black" aria-hidden="true">
                    <path d="M3 5h18v14H3zM3 5l9 7 9-7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <a href="mailto:Yujuan.li@cdu.edu.au" className="hover:underline underline-offset-4">
                    rina@cdu.edu.au
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 text-black" aria-hidden="true">
                    <path d="M12 2a7 7 0 017 7c0 5-7 13-7 13S5 14 5 9a7 7 0 017-7zm0 9a2 2 0 100-4 2 2 0 000 4z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Darwin, Northern Territory
                </li>
              </ul>

              <div className="mt-4 flex items-center gap-4 text-black">
                <a aria-label="Twitter" href="#" className="transition hover:opacity-90">
                  <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current"><path d="M22 5.8c-.7.3-1.5.6-2.3.7.8-.5 1.4-1.2 1.7-2.1-.7.4-1.6.8-2.5 1A3.9 3.9 0 0 0 12 8.7c0 .3 0 .6.1.9A11.2 11.2 0 0 1 3 5.1a4 4 0 0 0 1.2 5.3c-.6 0-1.1-.2-1.6-.4v.1a4 4 0 0 0 3.1 3.9c-.5.1-1 .2-1.5.1a4 4 0 0 0 3.7 2.7 7.9 7.9 0 0 1-4.9 1.7H3a11.2 11.2 0 0 0 6.1 1.8c7.4 0 11.5-6.1 11.5-11.5v-.5c.8-.5 1.4-1.2 1.9-1.9z"/></svg>
                </a>
                <a aria-label="Facebook" href="#" className="transition hover:opacity-90">
                  <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current"><path d="M13 22v-8h3l1-4h-4V7c0-1.1.3-2 2-2h2V1.1C16.6 1 15.2 1 14 1a4 4 0 0 0-4 4v3H7v4h3v8h3z"/></svg>
                </a>
                <a aria-label="LinkedIn" href="#" className="transition hover:opacity-90">
                  <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current"><path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V24h-4V8zM8 8h3.8v2.2h.1c.5-.9 1.8-2.2 3.8-2.2 4 0 4.8 2.6 4.8 6V24h-4v-7.1c0-1.7 0-3.8-2.3-3.8s-2.6 1.8-2.6 3.7V24H8V8z"/></svg>
                </a>
                <a aria-label="Instagram" href="#" className="transition hover:opacity-90">
                  <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current"><path d="M12 2.2c3 0 3.4 0 4.6.1 1.1.1 1.8.2 2.5.5.7.3 1.2.6 1.8 1.2.6.6.9 1.1 1.2 1.8.3.7.5 1.4.5 2.5.1 1.2.1 1.6.1 4.6s0 3.4-.1 4.6c-.1 1.1-.2 1.8-.5 2.5a4.6 4.6 0 0 1-1.2 1.8 4.6 4.6 0 0 1-1.8 1.2c-.7.3-1.4.5-2.5.5-1.2.1-1.6.1-4.6.1s-3.4 0-4.6-.1c-1.1-.1-1.8-.2-2.5-.5a4.6 4.6 0 0 1-1.8-1.2A4.6 4.6 0 0 1 .8 19c-.3-.7-.5-1.4-.5-2.5C.2 15.2.2 14.8.2 11.8s0-3.4.1-4.6c.1-1.1.2-1.8.5-2.5.3-.7.6-1.2 1.2-1.8.6-.6 1.1-.9 1.8-1.2.7-.3 1.4-.5 2.5-.5C8.6 2.2 9 2.2 12 2.2m0 1.6c-3 0-3.3 0-4.5.1-.9 0-1.4.2-1.7.3-.4.2-.7.3-1 .6-.3.3-.4.6-.6 1-.1.3-.3.8-.3 1.7-.1 1.2-.1 1.5-.1 4.5s0 3.3.1 4.5c0 .9.2 1.4.3 1.7.2.4.3.7.6 1 .3.3.6.4 1 .6.3.1.8.3 1.7.3 1.2.1 1.5.1 4.5.1s3.3 0 4.5-.1c.9 0 1.4-.2 1.7-.3.4-.2.7-.3 1-.6.3-.3.4-.6.6-1 .1-.3.3-.8.3-1.7.1-1.2.1-1.5.1-4.5s0-3.3-.1-4.5c0-.9-.2-1.4-.3-1.7-.2-.4-.3-.7-.6-1-.3-.3-.6-.4-1-.6-.3-.1-.8-.3-1.7-.3-1.2-.1-1.5-.1-4.5-.1m0 3.2a5.8 5.8 0 1 1 0 11.6 5.8 5.8 0 0 1 0-11.6m0 9.6a3.8 3.8 0 1 0 0-7.6 3.8 3.8 0 0 0 0 7.6m5.9-10.9a1.4 1.4 0 1 1 2.7 0 1.4 1.4 0 0 1-2.7 0z"/></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar — logo on left, copyright on right */}
      <div className="bg-[#fff] text-black">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center">
              <img
                src="/CDU_RINA_CMYK_FINAL.jpg"
                alt="Charles Darwin University | RINA"
                className="h-10 w-auto object-contain"
                loading="lazy"
              />
            </div>

            <div className="flex items-center gap-6 text-xs">
              <p>Copyright © {year} Plant-parasitic Nematodes in Northern Australia</p>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="rounded px-2 py-1 hover:underline underline-offset-4"
                type="button"
              >
                Back to top ↑
              </button>
              <Link to="/disclaimer" className="hover:underline underline-offset-4">Disclaimer</Link>
              <Link to="/footnotes" className="hover:underline underline-offset-4">Footnotes</Link>
              {/* NEW: Acknowledgments & Contributors */}
              <Link to="/acknowledgments" className="hover:underline underline-offset-4">Acknowledgments</Link>
              <Link to="/contributors" className="hover:underline underline-offset-4">Contributors</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
