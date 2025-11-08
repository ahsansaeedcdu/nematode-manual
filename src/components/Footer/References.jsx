import React, { useState } from "react";

function ChevronIcon({ open }) {
  return (
    <svg
      className={`h-4 w-4 flex-shrink-0 transition-transform duration-200 ${
        open ? "rotate-90" : ""
      }`}
      viewBox="0 0 20 20"
      fill="none"
    >
      <path
        d="M7 5l6 5-6 5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AccordionItem({ id, label, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      id={id}
      className="mb-3 rounded-2xl border border-slate-200 bg-white"
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="
          flex w-full items-center justify-between gap-3 rounded-2xl
          px-4 py-3 text-left text-sm md:text-base font-medium
          text-[#027fb8] bg-slate-50 hover:bg-slate-100
        "
      >
        <span>{label}</span>
        <ChevronIcon open={open} />
      </button>

      {open && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 text-sm md:text-base text-slate-800">
          {children}
        </div>
      )}
    </div>
  );
}



export default function References() {
  return (
    <main className="mx-auto  max-w-4xl px-4 py-8 md:py-12 text-slate-800">
      <section className="rounded-3xl border border-slate-200 bg-white px-4 py-6 shadow-sm md:px-8 md:py-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-[#027fb8]">
          References
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Click a subsection to expand the full list of references.
        </p>

        {/* 2.1 Sedentary endoparasite */}
        <h2 className="mt-8 mb-3 text-xl font-semibold text-[#027fb8]">
          2.1 Sedentary endoparasite
        </h2>

        <AccordionItem
          id="sec-2-1-1"
          label="2.1.1 Root-knot nematodes (Meloidogyne spp.)"
        >
          <ul className="list-disc list-outside space-y-2 pl-5">
            <li>
              Hay F, Stirling GR (2014). Management of root-knot nematode in
              vegetable crops. Horticulture Innovation Australia.
            </li>
            <li>
              MeloRisk Australasia: Reducing the risk of exotic root-knot
              nematodes in Australasia. Queensland Department of Agriculture and
              Fisheries / ACIAR, 2024. Available at:{" "}
              <a
                href="https://www.aciar.gov.au/projects/search/melorisk-australasia"
                className="text-[#027fb8] underline"
                target="_blank"
                rel="noreferrer"
              >
                https://www.aciar.gov.au/projects/search/melorisk-australasia
              </a>
              .
            </li>
          </ul>
        </AccordionItem>

        <AccordionItem
          id="sec-2-1-2"
          label="2.1.2 Cyst nematodes (Globodera spp. & Heterodera spp.)"
        >
          <ul className="list-disc list-outside space-y-2 pl-5">
            <li>
              Blacket MJ, Agarwal A, Wainer J, Triska MD, Renton M, Edwards J
              (2019) Molecular assessment of the introduction and spread of
              potato cyst nematode, <em>Globodera rostochiensis</em>, in
              Victoria. <em>Phytopathology</em> 109, 659–669.
            </li>
            <li>
              Vanstone VA, Hollaway GJ, Stirling GR (2008) Managing nematode
              pests in the southern and western regions of the Australian cereal
              industry: continuing progress in a challenging environment.{" "}
              <em>Australasian Plant Pathology</em> 37, 220–234.
            </li>
            <li>
              Singh SK (2013) Prioritisation of pest species for biosecurity
              risk assessments: using plant-parasitic nematodes and Australia as
              examples. PhD Thesis, Charles Sturt University.
            </li>
          </ul>
        </AccordionItem>

        <AccordionItem id="sec-2-1-3" label="2.1.3 Achlysiella nematodes">
          <ul className="list-disc list-outside space-y-2 pl-5">
            <li>
              Nobbs JM (2003) Preparation of a CD-ROM library of plant parasitic
              nematodes: Plant parasitic nematodes recorded from sugarcane in
              Australia. South Australian Research and Development Institute
              (SARDI), Adelaide, Australia.
            </li>
            <li>
              Siddiqi MR (2006){" "}
              <em>Tylenchida: parasites of plants and insects</em>, 2nd ed.
              Commonwealth Agricultural Bureau, Slough.
            </li>
          </ul>
        </AccordionItem>

        {/* 2.2 Sedentary semi-endoparasite */}
        <h2 className="mt-8 mb-3 text-xl font-semibold text-[#027fb8]">
          2.2 Sedentary semi-endoparasite
        </h2>

        <AccordionItem
          id="sec-2-2-1"
          label="2.2.1 Reniform nematodes (Rotylenchulus spp.)"
        >
          <ul className="list-disc list-outside space-y-2 pl-5">
            <li>
              Lawrence KS (2022) Reniform nematode (
              <em>Rotylenchulus reniformis</em>) and its interactions with
              cotton (<em>Gossypium hirsutum</em>). In{" "}
              <em>
                Integrated Nematode Management: State-of-the-art and visions for
                the future
              </em>{" "}
              (Eds. RA Sikora et al.) CAB International, Wallingford, Chapter
              14, 94–99.
            </li>
            <li>
              Smith LJ, Scheikowski L, Kafle D (2024) The distribution of
              reniform nematode (<em>Rotylenchulus reniformis</em>) in cotton
              fields in central QLD and population dynamics in response to
              cropping regime. <em>Pathogens</em> 13, 888.
            </li>
            <li>
              Stirling GR (2023) Reniform nematode (
              <em>Rotylenchulus reniformis</em>), a damaging pest of many crops
              in tropical and subtropical regions of Australia. In: Stirling GR
              (ed) <em>Plant and soil nematodes: friend and foe</em>. APPsNet.{" "}
              <a
                href="https://www.appsnet.org/nematodes"
                className="text-[#027fb8] underline"
                target="_blank"
                rel="noreferrer"
              >
                https://www.appsnet.org/nematodes
              </a>
              .
            </li>
          </ul>
        </AccordionItem>

        <AccordionItem
          id="sec-2-2-2"
          label="2.2.2 Citrus nematode (Tylenchulus semipenetrans)"
        >
          <ul className="list-disc list-outside space-y-2 pl-5">
            <li>
              Duncan LW (2005) Nematode parasites of citrus. In: Luc M, Sikora
              RA, Bridge J (eds){" "}
              <em>Plant parasitic nematodes in subtropical and tropical agriculture</em>, 2nd ed. CAB International, Wallingford, UK, pp. 437–466.
            </li>
            <li>
              Stirling GR (2023) Citrus nematode (
              <em>Tylenchulus semipenetrans</em>), the cause of slow decline of
              citrus. In: Stirling GR (ed){" "}
              <em>Plant and soil nematodes: friend and foe</em>. APPsNet.{" "}
              <a
                href="https://www.appsnet.org/nematodes"
                className="text-[#027fb8] underline"
                target="_blank"
                rel="noreferrer"
              >
                https://www.appsnet.org/nematodes
              </a>
              .
            </li>
          </ul>
        </AccordionItem>

        {/* 2.3 Migratory endoparasite */}
        <h2 className="mt-8 mb-3 text-xl font-semibold text-[#027fb8]">
          2.3 Migratory endoparasite
        </h2>

        <AccordionItem
          id="sec-2-3-1"
          label="2.3.1 Root-lesion nematodes (Pratylenchus spp.)"
        >
          <ul className="list-disc list-outside space-y-2 pl-5">
            <li>
              Thompson JP, Owen KJ, Stirling GR, Bell MJ (2008) Root lesion
              nematodes (<em>Pratylenchus thornei</em> and <em>P. neglectus</em>
              ): a review of recent progress in managing a significant pest of
              grain crops in northern Australia.{" "}
              <em>Australasian Plant Pathology</em> 37, 235–242.
            </li>
            <li>
              Vanstone VA, Hollaway GJ, Stirling GR (2008) Managing nematode
              pests in the southern and western regions of the Australian cereal
              industry: continuing progress in a challenging environment.{" "}
              <em>Australasian Plant Pathology</em> 37, 220–234.
            </li>
          </ul>
        </AccordionItem>

        <AccordionItem
          id="sec-2-3-2"
          label="2.3.2 Burrowing nematodes (Radopholus spp.)"
        >
          <ul className="list-disc list-outside space-y-2 pl-5">
            <li>
              Cobon JA, Pattison AB, Penrose LDJ, Chandra KA, O’Neill WT, Smith
              MK (2019) Comparison of the reproduction and pathogenicity of
              isolates of <em>Radopholus similis</em> (burrowing nematode) from
              Australia and Fiji on ginger (<em>Zingiber officinale</em>) and
              banana (<em>Musa</em> spp.).{" "}
              <em>Australasian Plant Pathology</em> 48, 529–539.
            </li>
            <li>
              Pattison AB, Cobon JA, Araya-Vargas M, Chabrier C (2024) Towards
              sustainable management of nematodes in banana. In Drenth A, Kema
              G (eds.){" "}
              <em>
                Achieving sustainable cultivation of bananas Volume 3: Diseases
                and pests
              </em>
              . Burleigh Dodds Science Publishing, pp. 419–450.
            </li>
            <li>
              Plant Health Australia Ltd (2025){" "}
              <em>Biosecurity Plan for the Australian Citrus Industry</em>{" "}
              (Version 4.1). Plant Health Australia, Canberra, ACT.
            </li>
          </ul>
        </AccordionItem>

        <AccordionItem
          id="sec-2-3-3"
          label="2.3.3 Stem and bulb nematodes (Ditylenchus spp.)"
        >
          <ul className="list-disc list-outside space-y-2 pl-5">
            <li>
              Bridge J, Starr JL (2007){" "}
              <em>Plant Nematodes of Agricultural Importance</em>. Manson
              Publishing Ltd., London.
            </li>
            <li>
              Singh SK (2013) Prioritisation of pest species for biosecurity
              risk assessments: using plant-parasitic nematodes and Australia as
              examples. PhD Thesis, Charles Sturt University.
            </li>
          </ul>
        </AccordionItem>

        {/* 2.4 Ectoparasite */}
        <h2 className="mt-8 mb-3 text-xl font-semibold text-[#027fb8]">
          2.4 Ectoparasite
        </h2>

        <AccordionItem
          id="sec-2-4-1"
          label="2.4.1 Dagger nematodes (Xiphinema spp.)"
        >
          <ul className="list-disc list-outside space-y-2 pl-5">
            <li>
              Jenkins WR, Taylor DP (1967) <em>Plant Nematology</em>. Reinhold
              Publishing Corporation, New York, USA.
            </li>
          </ul>
        </AccordionItem>

        <AccordionItem
          id="sec-2-4-2"
          label="2.4.2 Needle nematodes (Paralongidorus spp.)"
        >
          <ul className="list-disc list-outside space-y-2 pl-5">
            <li>
              Stirling GR, Vawdrey LL (1985) Distribution of a needle nematode,{" "}
              <em>Paralongidorus australis</em>, in rice fields and areas of
              natural vegetation in North Queensland.{" "}
              <em>Australasian Plant Pathology</em> 14, 71–72.
            </li>
            <li>
              Stirling GR (2023) Ectoparasitic plant-parasitic nematodes known
              to cause crop damage in Australia. In: Stirling GR (ed){" "}
              <em>Plant and soil nematodes: friend and foe</em>. APPsNet.{" "}
              <a
                href="https://www.appsnet.org/nematodes"
                className="text-[#027fb8] underline"
                target="_blank"
                rel="noreferrer"
              >
                https://www.appsnet.org/nematodes
              </a>
              .
            </li>
          </ul>
        </AccordionItem>

        <AccordionItem
          id="sec-2-4-3"
          label="2.4.3 Southern string nematode (Ibipora lolii)"
        >
          <ul className="list-disc list-outside space-y-2 pl-5">
            <li>
              Siviour TR, McLeod RW (1979) Redescription of{" "}
              <em>Ibipora lolii</em> (Siviour 1978) comb. n. (Nematoda:
              Belonolaimidae) with observations on its host range and
              pathogenicity. <em>Nematologica</em> 25, 487–493.
            </li>
          </ul>
        </AccordionItem>

        <AccordionItem
          id="sec-2-4-4"
          label="2.4.4 Stubby nematodes (Paratrichodorus spp.)"
        >
          <ul className="list-disc list-outside space-y-2 pl-5">
            <li>
              Jenkins WR, Taylor DP (1967) <em>Plant Nematology</em>. Reinhold
              Publishing Corporation, New York, USA.
            </li>
          </ul>
        </AccordionItem>

        <AccordionItem
          id="sec-2-4-5"
          label="2.4.5 Ring nematodes (Family Criconematidae)"
        >
          <ul className="list-disc list-outside space-y-2 pl-5">
            <li>
              Jenkins WR, Taylor DP (1967) <em>Plant Nematology</em>. Reinhold
              Publishing Corporation, New York, USA.
            </li>
          </ul>
        </AccordionItem>

        <AccordionItem
          id="sec-2-4-6"
          label="2.4.6 Stunt nematodes (Tylenchorhynchus spp.)"
        >
          <ul className="list-disc list-outside space-y-2 pl-5">
            <li>
              Handoo ZA (2000) A key and diagnostic compendium to the species of
              the genus <em>Tylenchorhynchus</em> Cobb, 1913 (Nematoda:
              Belonolaimidae). <em>Journal of Nematology</em> 32(1), 20–34.
            </li>
            <li>
              Jenkins WR, Taylor DP (1967) <em>Plant Nematology</em>. Reinhold
              Publishing Corporation, New York, USA.
            </li>
          </ul>
        </AccordionItem>

        <AccordionItem
          id="sec-2-4-7"
          label="2.4.7 Spiral nematodes (Helicotylenchus spp., Rotylenchus spp. & Scutellonema spp.)"
        >
          <ul className="list-disc list-outside space-y-2 pl-5">
            <li>
              Jenkins WR, Taylor DP (1967) <em>Plant Nematology</em>. Reinhold
              Publishing Corporation, New York, USA.
            </li>
            <li>
              Bridge J, Coyne D, Kwoseh CK (2005) Nematode parasites of tropical
              root and tuber crops. In: Luc M, Sikora R, Bridge J (eds){" "}
              <em>
                Plant Parasitic Nematodes in Subtropical and Tropical
                Agriculture
              </em>
              , 2nd edn. CAB International, Wallingford, UK, pp. 221–258.
            </li>
          </ul>
        </AccordionItem>

        <AccordionItem
          id="sec-2-4-8"
          label="2.4.8 Lance nematodes (Hoplolaimus spp.)"
        >
          <ul className="list-disc list-outside space-y-2 pl-5">
            <li>
              Ramana KV, Prasad JS, Seshagiri Rao Y (1978) Influence of
              atmospheric conditions and soil temperature on the prevalence of
              the lance nematode (<em>Hoplolaimus indicus</em> Sher, 1963) in
              rice fields.{" "}
              <em>Proceedings of the Indian Academy of Sciences, Section B</em>{" "}
              87, 39–43.
            </li>
            <li>
              Overstreet C, McGawley EC, Khalilian A, Kirkpatrick TL, Monfort
              WS, Henderson W, Mueller JD (2014) Site-specific nematode
              management – development and success in cotton production in the
              United States. <em>Journal of Nematology</em> 46, 309–320.
            </li>
          </ul>
        </AccordionItem>

        <AccordionItem
          id="sec-2-4-9"
          label="2.4.9 Pin nematodes (Paratylenchus spp. & Gracilacus spp.)"
        >
          <ul className="list-disc list-outside space-y-2 pl-5">
            <li>
              Claerbout J, Vandevelde I, Venneman S, Kigozi A, de Sutter N,
              Neukermans J, Bleyaert P, Bert W, Höfte M, Viaene N (2020) A
              thorough study of a <em>Paratylenchus</em> sp. in glasshouse-grown
              lettuce: Characterisation, population dynamics, host plants, and
              damage threshold as keys to its integrated management.{" "}
              <em>Annals of Applied Biology</em> 178(1), 62–79.
            </li>
            <li>
              Wood FH (1973) Biology and host range of{" "}
              <em>Paratylenchus projectus</em> Jenkins, 1956 (Nematoda:
              Criconematidae) from a subalpine tussock grassland.{" "}
              <em>New Zealand Journal of Agricultural Research</em> 16, 381–384.
            </li>
          </ul>
        </AccordionItem>

        <AccordionItem
          id="sec-2-4-10"
          label="2.4.10 Sheath nematodes (Hemicycliophora spp.)"
        >
          <ul className="list-disc list-outside space-y-2 pl-5">
            <li>
              Nguyen HT, Trinh QP, Couvreur M, Nguyen TD, Bert W (2021)
              Description of <em>Hemicycliophora cardamomi</em> sp. n. (Nematoda:
              Hemicycliophoridae) associated with{" "}
              <em>Amomum longiligulare</em> T.L. Wu and a web-based key for the
              identification of <em>Hemicycliophora</em> spp.{" "}
              <em>Journal of Helminthology</em> 95, e2.
            </li>
            <li>
              Van Gundy SD, Rackham RL (1961) Studies on the biology and
              pathogenicity of <em>Hemicycliophora arenaria</em>.{" "}
              <em>Phytopathology</em> 51, 393–397.
            </li>
          </ul>
        </AccordionItem>

        {/* 2.5 Foliar, leaf and bud nematodes */}
        <h2 className="mt-8 mb-3 text-xl font-semibold text-[#027fb8]">
          2.5 Foliar, leaf and bud nematodes (Aphelenchoides spp.)
        </h2>

        <AccordionItem
          id="sec-2-5-1"
          label="2.5 Foliar, leaf and bud nematodes"
        >
          <ul className="list-disc list-outside space-y-2 pl-5">
            <li>
              Jenkins WR, Taylor DP (1967) <em>Plant Nematology</em>. Reinhold
              Publishing Corporation, New York, USA.
            </li>
          </ul>
        </AccordionItem>

        {/* 4. Integrated nematode management */}
        <h2 className="mt-8 mb-3 text-xl font-semibold text-[#027fb8]">
          4. Integrated nematode management
        </h2>

        <AccordionItem id="sec-4-1" label="4. Integrated nematode management">
          <ul className="list-disc list-outside space-y-2 pl-5">
            <li>
              Desaeger JA, Wram C, Zasada I (2020) New reduced-risk agricultural
              nematicides: Rationale and review. <em>Journal of Nematology</em>{" "}
              52, 1–16.
            </li>
            <li>
              Norris CE, Congreves KA (2018) Alternative management practices
              improve soil health indices in intensive vegetable cropping
              systems. <em>Frontiers in Environmental Science</em> 8, article 50,
              1–18.
            </li>
            <li>
              Stirling GR (2023) Nematode management. In: Stirling GR (ed){" "}
              <em>Plant and soil nematodes: friend and foe</em>. APPsNet.{" "}
              <a
                href="https://www.appsnet.org/nematodes"
                className="text-[#027fb8] underline"
                target="_blank"
                rel="noreferrer"
              >
                https://www.appsnet.org/nematodes
              </a>
              .
            </li>
          </ul>
        </AccordionItem>

        {/* 5. Diagnostic services */}
        <h2 className="mt-8 mb-3 text-xl font-semibold text-[#027fb8]">
          5. Diagnostic services
        </h2>

        <AccordionItem id="sec-5-1" label="5. Diagnostic services">
          <ul className="list-disc list-outside space-y-2 pl-5">
            <li>
              Stirling GR, Nicol JM, Reay F (2002) Advisory services for
              nematode pests. Rural Industries Research and Development
              Corporation (RIRDC).
            </li>
          </ul>
        </AccordionItem>
      </section>
    </main>
  );
}
