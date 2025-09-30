import React from "react";
import FadeIn from "../../components/FadeIn/FadeIn";
// Put your image at: src/assets/about-rln.jpg
import aboutImg from "../../assets/NA PPN website photos/Root-lesion nematodes/Above-ground symptoms of wheat caused by RLN (collecty by Kirsty Owen).jpg";

export default function AboutUs({
  // optional override; prefer leaving this empty so we use the hashed asset
  imageUrl,
  imageAlt = "Above-ground symptoms of wheat caused by RLN (photo by Kirsty Owen)",
}) {
  // If a full URL is passed, use it; otherwise use the bundled asset (cache-busted)
  const resolvedSrc =
    imageUrl && /^https?:\/\//i.test(imageUrl) ? imageUrl : aboutImg;

  return (
    <FadeIn>
      <section className="w-screen h-[80vh] bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 w-full h-full">
          {/* Left: text (verbatim) */}
          <div className="flex items-center justify-center bg-[#03334A] text-white">
            <div className="max-w-xl px-6 md:px-10 space-y-5 text-base md:text-lg leading-relaxed">
              <p>
                This website has been developed as an educational resource to support the booklet “Plant-Parasitic Nematodes – Biosecurity and Management in Northern Australia.”
              </p>
              <p>
                This booklet was developed with support from the Northern Australia Biosecurity Strategy (NABS), Biosecurity Plant and Science Services Division, Department of Agriculture, Fisheries and Forestry, Australian Government, while the website itself was created by Charles Darwin University (CDU) staff (Dr Yujuan Li and Prof Stephen Xu) together with CDU Master of IT students (  Jahidul Islam and Ahsan Saeed ) as part of their internship program.
              </p>
              <p>
                Our aim is to provide growers, agronomists, and biosecurity stakeholders with accessible information on plant-parasitic nematodes, their management, and the importance of preventing their spread in Northern Australia.
              </p>
              <p>For enquiries, please contact:</p>
            </div>
          </div>

          {/* Right: image with caption overlay */}
          <div className="relative h-full">
            <img
              src={resolvedSrc}
              alt={imageAlt}
              className="absolute inset-0 w-full h-full object-cover"
              loading="eager"
              decoding="async"
            />

            {/* Bottom gradient for caption legibility */}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/50 via-black/25 to-transparent pointer-events-none" />

            {/* Caption */}
            <div className="absolute inset-x-0 bottom-0 flex justify-center px-4 pb-4">
              <div className="inline-block max-w-[92%] md:max-w-[80%] bg-black/55 text-white text-xs md:text-sm leading-snug px-3 py-2 rounded-md backdrop-blur-[2px]">
                Above-ground symptoms of wheat caused by RLN (collecty by Kirsty Owen)
              </div>
            </div>
          </div>
        </div>
      </section>
    </FadeIn>
  );
}
