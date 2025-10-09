// src/components/Contributors/Contributors.jsx
import React from "react";
import { Link } from "react-router-dom";
import FadeIn from "../../components/FadeIn/FadeIn";

export default function Contributors() {
  return (
    <FadeIn>
      <main className="min-h-screen w-screen bg-slate-50">
        {/* Header / Breadcrumb */}
        <header className="w-full border-b bg-white/90 backdrop-blur-sm">
          <div className="max-w-[1100px] mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-xl md:text-2xl font-semibold text-[#027fb8]">
              Contributors
            </h1>
            <nav className="text-sm">
              <Link to="/" className="text-blue-700 hover:underline">
                Home
              </Link>
              <span className="mx-1 text-slate-400">/</span>
              <span className="text-slate-700">Contributors</span>
            </nav>
          </div>
        </header>

        {/* Content */}
        <section className="max-w-[1100px] mx-auto px-4 py-6">
          <div className="bg-white rounded-2xl shadow p-6 md:p-8 text-slate-800 leading-relaxed">
            <p className="mb-4">
              This booklet was prepared by{" "}
              <strong>Drs Yujuan Li<sup>1</sup><sup>*</sup>, Cheng-Yuan Xu<sup>1</sup>, Maxine P. Piggott<sup>1</sup></strong>{" "}
              with contributions from{" "}
              <strong>Sarah J. Collins<sup>2</sup>, Tony Pattison<sup>3</sup>, Wayne O&apos;Neill<sup>4</sup>, Melanie Ford<sup>5</sup></strong>.
            </p>

            <hr className="my-6 border-slate-200" />

            <ol className="list-decimal pl-6 space-y-3">
              <li>
                <strong>Research Institute for Northern Agriculture</strong>, Charles Darwin University,
                Darwin, Northern Territory 0810, Australia.
              </li>
              <li>
                <strong>Department of Primary Industries and Regional Development (DPIRD)</strong>,
                South Perth, Western Australia 6151, Australia.
              </li>
              <li>
                <strong>Department of Primary Industries</strong>, Centre for Wet Tropics Agriculture,
                South Johnstone, Queensland 4859, Australia.
              </li>
              <li>
                <strong>Department of Primary Industries</strong>, Ecosciences Precinct, 41 Boggo Rd,
                Dutton Park, Queensland 4102, Australia.
              </li>
              <li>
                <strong>Department of Agriculture and Fisheries</strong>, Berrimah Farm Science Precinct,
                29 Makagon Road, Berrimah, Northern Territory 0828, Australia.
              </li>
            </ol>

            
          </div>

          {/* Optional actions */}
          <div className="mt-4 flex items-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center px-3 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-sm"
            >
              ← Back to Home
            </Link>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center px-3 py-2 rounded-lg bg-[#027fb8] text-black hover:bg-[#0b95d1] text-sm shadow"
            >
              Print
            </button>
          </div>
        </section>
      </main>
    </FadeIn>
  );
}
