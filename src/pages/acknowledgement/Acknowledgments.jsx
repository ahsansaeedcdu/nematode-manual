// src/components/Acknowledgments/Acknowledgments.jsx
import React from "react";
import { Link } from "react-router-dom";

import FadeIn from "../../components/FadeIn/FadeIn";

export default function Acknowledgments() {
  return (
    <FadeIn>
      <main className="min-h-screen w-screen bg-slate-50">
        {/* Header / Breadcrumb */}
        <header className="w-full border-b bg-white/90 backdrop-blur-sm">
          <div className="max-w-[1100px] mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-xl md:text-2xl font-semibold text-[#027fb8]">
              Acknowledgments
            </h1>
            <nav className="text-sm">
              <Link to="/" className="text-blue-700 hover:underline">
                Home
              </Link>
              <span className="mx-1 text-slate-400">/</span>
              <span className="text-slate-700">Acknowledgments</span>
            </nav>
          </div>
        </header>

        {/* Content */}
        <section className="max-w-[1100px] mx-auto px-4 py-6">
          <div className="bg-white rounded-2xl shadow p-6 md:p-8 leading-relaxed text-slate-800">
            <p className="mb-4">
              This booklet is part of the project{" "}
              <em>
                &quot;Understanding Current and Future Impacts of
                Plant-Parasitic Nematodes in Northern Australia&quot;
              </em>{" "}
              funded by the Northern Australia Biosecurity Strategy (NABS),
              Biosecurity Plant and Science Services Division, Department of
              Agriculture, Fisheries and Forestry, Australian Government. The
              “Research Institute for Northern Agriculture and Drought
              Resilience” is supported by the Australian Government Department
              of Education.
            </p>

            <p className="mb-4">
              We gratefully acknowledge the support and collaboration of the
              Northern Australia Quarantine Strategy (NAQS), the Northern
              Territory Department of Agriculture and Fisheries (NT DAF), the
              Western Australia Department of Primary Industries and Regional
              Development (WA DPIRD), and the Queensland Department of Primary
              Industries (QDPI), as well as other industry and research partners
              who contributed to information exchange across Northern Australia.
            </p>

            <p>
              Figures and images used in this booklet were provided courtesy of
              colleagues and partners who kindly allowed their use. Copyright
              remains with the original providers. Assistance with booklet
              design and layout is also gratefully acknowledged.
            </p>
          </div>

          {/* Optional: small footer actions */}
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
