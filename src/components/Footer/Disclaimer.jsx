import React from "react";

export default function Disclaimer() {
  return (
    <details className="group rounded-xl bg-white/90 text-slate-900 shadow-sm ring-1 ring-black/10 open:ring-black/20 p-4">
      <summary className="cursor-pointer select-none list-none text-base font-semibold flex items-center justify-between">
        <span>Disclaimer</span>
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
      <div className="mt-3 text-sm leading-6">
        <p>
          The information provided on this website is intended for general educational and awareness purposes only. While
          every effort has been made to ensure accuracy, Charles Darwin University accepts no responsibility for any loss
          or damage arising from reliance on the information. This website does not replace professional advice. Users
          should seek specific guidance from qualified experts for nematode diagnosis and management decisions.
        </p>
      </div>
    </details>
  );
}
