import React from "react";

export default function DisclaimerPage() {
  return (
    <main className="min-h-screen w-screen bg-white">
      {/* Full-width band */}
      <section className="w-full px-6 md:px-10 lg:px-16 py-14">
        <h1 className="text-4xl font-bold text-[#027fb8]">Disclaimer</h1>
        <div className="mt-5 text-slate-900 leading-7 space-y-4">
          <p>
            The information provided on this website is intended for general educational and awareness purposes only.
            While every effort has been made to ensure accuracy, Charles Darwin University accepts no responsibility
            for any loss or damage arising from reliance on the information. This website does not replace professional
            advice. Users should seek specific guidance from qualified experts for nematode diagnosis and management
            decisions.
          </p>
        </div>
      </section>
    </main>
  );
}
