import React from "react";

export default function Footnotes() {
  return (
    <details className="group rounded-xl bg-white/90 text-slate-900 shadow-sm ring-1 ring-black/10 open:ring-black/20 p-4">
      <summary className="cursor-pointer select-none list-none text-base font-semibold flex items-center justify-between">
        <span>Footnotes</span>
        <svg
          className="h-5 w-5 transition-transform group-open:rotate-180"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </summary>

      <div className="mt-3 text-sm leading-6 space-y-2">
        <p>
          1. The content of this website is adapted directly from the booklet “Plant-Parasitic Nematodes – Biosecurity
          and Management in Northern Australia.”
        </p>
        <p>
          2. Figures and images used in this booklet were provided courtesy of colleagues and partners who kindly allowed
          their use. Copyright remains with the original providers. Assistance with booklet design and layout is also
          gratefully acknowledged.
        </p>
      </div>
    </details>
  );
}
