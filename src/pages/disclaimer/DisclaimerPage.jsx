import React from "react";

export default function DisclaimerPage() {
  return (
    <main className="min-h-screen w-screen bg-white">
      {/* Full-width band */}
      <section className="w-full px-6 md:px-10 lg:px-16 py-14">
        <h1 className="text-4xl font-bold text-[#027fb8]">Disclaimer</h1>
        <div className="mt-5 text-slate-900 leading-7 space-y-4">
          <p>
          This booklet is provided for general information purposes only. While care has been taken to ensure the accuracy of the information at the time of publication, no guarantee is given that it is complete, current, or applicable to all situations. Readers are encouraged to seek independent professional advice before applying any recommendations, and to confirm current requirements with appropriate biosecurity and agricultural authorities. <br/>The authors, contributors, and publishers accept no responsibility or liability for any loss, damage, or other consequences that may result from the use of, or reliance on, the information contained in this booklet whether in English or any other language.
          </p>
        </div>
      </section>
    </main>
  );
}
