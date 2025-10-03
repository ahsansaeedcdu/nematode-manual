import React from "react";

export default function FootnotesPage() {
  return (
    <main className="min-h-screen w-screen bg-white">
      {/* Full-width band */}
      <section className="w-full px-6 md:px-10 lg:px-16 py-14">
        <h1 className="text-4xl font-bold text-[#027fb8]">Footnotes</h1>
        <ol className="mt-5 list-decimal pl-6 text-slate-900 leading-7 space-y-3">
          <li>
            The content of this website is adapted directly from the booklet “Plant-Parasitic Nematodes – Biosecurity
            and Management in Northern Australia.”
          </li>
          <li>
            Figures and images used in this booklet were provided courtesy of colleagues and partners who kindly allowed
            their use. Copyright remains with the original providers. Assistance with booklet design and layout is also
            gratefully acknowledged.
          </li>
        </ol>
      </section>
    </main>
  );
}
