// NematodeOverview.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";
import FadeIn from "../FadeIn/FadeIn";
import wheatToleranceImg from "../../assets/images2/additional/Intolerant vs tolerant wheat to nematodes(collected by Jason Sheedy).JPG";
import pineappleMulchImg from "../../assets/images2/additional/Mulching pineapple residues to enrich soil (collected by Yujuan Jady Li).jpg";
import pasteuriaImg from "../../assets/images2/additional/Pasteuria bacteria killing root-lesion nematode in the field (collected by Yujuan Jady Li).png";
import fumigantImg from "../../assets/images2/additional/Applying fumigants before planting (collected by Yujuan Jady Li).jpg";
import sweetpotatoNematicideImg from "../../assets/images2/additional/Nematicide application in sweetpotato field (collected by Yujuan Jady Li).jpg";
const apiKeyNematodesTaxa = import.meta.env.VITE_NEMATODES_TAXA;
/* --------------------------- Static category model --------------------------- */
const CATEGORIES = [
  {
    id: "sedentary-endoparasite",
    title: "2.1 Sedentary endoparasite",
    blurb:
      "Sedentary endoparasitic nematodes enter plant roots and stay fixed in one place, developing swollen females embedded inside the root tissue. They cause distinctive root damage and reduce crop growth.",
    examples: [
      "Root-knot nematodes (Meloidogyne spp.)",
      "Cyst nematodes (Globodera spp. & Heterodera spp.)",
      "Achlysiella nematodes (Achlysiella spp.)",
    ],
    matchers: [/root-?knot/i, /cyst/i, /achlysiella/i, /\bmeloidogyne\b/i],
  },
  {
    id: "sedentary-semi-endoparasite",
    title: "2.2 Sedentary semi-endoparasite",
    blurb:
      "These nematodes feed with the front part of their body inside the root, while the rear part remains outside.",
    examples: [
      "Reniform nematodes (Rotylenchulus spp.)",
      "Citrus nematode (Tylenchulus semipenetrans)",
    ],
    matchers: [/reniform/i, /citrus/i],
  },
  {
    id: "migratory-endoparasite",
    title: "2.3 Migratory endoparasite",
    blurb:
      "Migratory endoparasitic nematodes stay worm-shaped and move through roots, feeding on cells and killing them before moving to new roots.",
    examples: [
      "Root-lesion nematodes (Pratylenchus spp.)",
      "Burrowing nematodes (Radopholus spp.)",
      "Stem and bulb nematodes (Ditylenchus spp.)",
    ],
    matchers: [
      /root-?lesion/i,
      /burrowing/i,
      /radopholus/i,
      /pratylenchus/i,
      /ditylenchus/i,
      /stem ?and ?bulb/i,
    ],
  },
  {
    id: "ectoparasite",
    title: "2.4 Ectoparasite",
    blurb:
      "Ectoparasitic nematodes stay in the soil and feed from outside the roots, damaging root tips and slowing root growth. Their impact is less studied than nematodes that live inside roots.",
    examples: ["Dagger nematodes (Xiphinema spp.)"],
    matchers: [
      /dagger/i,
      /xiphinema/i,
      /needle/i,
      /paralongidorus/i,
      /southern\s*sting/i,
      /ibipora/i,
      /stubby/i,
      /paratrichodorus/i,
      /ring/i,
      /criconematidae/i,
      /stunt/i,
      /tylenchorhynchus/i,
      /spiral/i,
      /helicotylenchus/i,
      /rotylenchus/i,
      /scutellonema/i,
      /lance/i,
      /hoplolaimus/i,
      /\bpin\b/i,
      /paratylenchus/i,
      /gracilacus/i,
      /\bsheath\b/i,
      /hemicycliophora/i,
    ],
  },
  {
    id: "foliar",
    title: "2.5 Foliar, leaf or bud nematodes",
    blurb: "",
    examples: ["Foliar nematodes (Aphelenchoides spp.)"],
    matchers: [/foliar/i, /leaf/i, /bud/i, /aphelenchoides/i],
  },
];
/* --------------------------- Helpers --------------------------- */
const normalizeGrouped = (data) => {
  // Expecting an array of rows; group by "Common name" and store a representative row in .data
  if (!data) return {};
  if (Array.isArray(data)) {
    return data.reduce((acc, e) => {
      const cn =
        e["Common name"] ||
        e["Common Name"] ||
        e["common_name"] ||
        "(Unknown group)";
      // keep the last seen row as the representative (or choose your own merge logic)
      acc[cn] = { "Common name": cn, data: e };
      return acc;
    }, {});
  }
  // Already grouped object
  return data;
};

const classifyCommonName = (name) => {
  if (!name) return "unclassified";
  for (const cat of CATEGORIES) {
    if (cat.matchers.some((rx) => rx.test(name))) return cat.id;
  }
  return "unclassified";
};

const parseSection = (s) =>
  typeof s === "string" ? s.split(".").map((n) => parseInt(n, 10)) : [];

const compareSections = (a, b) => {
  const aa = parseSection(a);
  const bb = parseSection(b);

  // Put items without a section at the end
  if (aa.length === 0 && bb.length === 0) return 0;
  if (aa.length === 0) return 1;
  if (bb.length === 0) return -1;

  for (let i = 0; i < Math.max(aa.length, bb.length); i++) {
    const diff = (aa[i] || 0) - (bb[i] || 0);
    if (diff !== 0) return diff;
  }
  return 0;
};

const slugify = (str) =>
  String(str)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

/* --------------------------- Component --------------------------- */
export default function NematodeOverview({
  datasetUrl = apiKeyNematodesTaxa,
}) {
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(datasetUrl);
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        const json = await res.json();
        if (!cancelled) setData(json);
      } catch (e) {
        if (!cancelled) setErr(String(e));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [datasetUrl]);

  const grouped = useMemo(() => normalizeGrouped(data), [data]);

  // Build per-category arrays of entries, then sort by numeric Section
  const groupedByCategory = useMemo(() => {
    const map = Object.fromEntries(CATEGORIES.map((c) => [c.id, []]));
    Object.values(grouped).forEach((entry) => {
      const cn = entry["Common name"];
      const catId = classifyCommonName(cn);
      (map[catId] || (map[catId] = [])).push(entry);
    });

    Object.keys(map).forEach((k) =>
      map[k].sort((a, b) => compareSections(a?.data?.Section, b?.data?.Section))
    );
    return map;
  }, [grouped]);
  const [open, setOpen] = useState({
    what: false,
    biosecurity: false,
    agriculture: false,
    sanitize: false,
    planting: false,
    quarantine: false,
    monitoring: false,
    rotation: false,
    biological: false,
    chemical: false,
    sampling: false,
    labs: false,
    where: false,
    when: false,
    how: false,
    handling: false,
    include: false,
  });
  const toggle = (key) => {
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  };
  const [sidebarOpen, setSidebarOpen] = useState({
    section1: false,
    section2: true,
    section3: false,
    section4: false,
    section5: false, // only section 5 open by default
  });
  const toggleSidebar = (key) => {
    setSidebarOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  };
  return (
    <FadeIn>
      <div className="flex min-h-screen w-screen bg-slate-50">
        {/* Sidebar (packed rectangular card, wider so items stay one line) */}
        <aside className="hidden md:block w-100 p-3 sticky top-0 h-screen">
          <div className="h-full rounded-xl bg-white shadow-md border border-slate-200 p-5 overflow-y-auto">
            <h2 className="text-lg font-bold text-slate-700 mb-4">
              On this page
            </h2>
            <nav className="space-y-3">
              {/* 1. Introduction */}
              {/* Section 1 */}
              <div>
                <button
                  onClick={() => toggleSidebar("section1")}
                  className="flex items-center justify-between w-full text-left 
                          px-3 py-2 rounded-lg text-[#027fb8] font-semibold 
                          hover:bg-blue-50 transition"
                >
                  <span>1. Introduction</span>
                  {sidebarOpen.section1 ? (
                    <ChevronDown className="w-4 h-4 text-slate-600" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-600" />
                  )}
                </button>

                {sidebarOpen.section1 && (
                  <div className="ml-3 mt-1 border-l border-slate-200 pl-3 space-y-1">
                    <a
                      href="#what-are-nematodes"
                      className="block text-[#292929] hover:text-blue-700 hover:bg-blue-50 
                                        text-xs px-2 py-1 rounded-md transition"
                    >
                      1.1 What are nematodes
                    </a>
                    <a
                      href="#biosecurity"
                      className="block text-[#292929] hover:text-blue-700 hover:bg-blue-50 
                                        text-xs px-2 py-1 rounded-md transition"
                    >
                      1.2 Why biosecurity matters
                    </a>
                    <a
                      href="#agriculture"
                      className="block text-[#292929] hover:text-blue-700 hover:bg-blue-50 
                                        text-xs px-2 py-1 rounded-md transition"
                    >
                      1.3 Agriculture in Northern Australia
                    </a>
                  </div>
                )}
              </div>

              {/* 2. Key PPNs */}
              {/* Section 2 */}
              <div>
                <button
                  onClick={() => toggleSidebar("section2")}
                  className="flex items-center justify-between w-full text-left 
                          px-3 py-2 rounded-lg text-[#027fb8] font-semibold 
                          hover:bg-blue-50 transition"
                >
                  <span>2. Key Plant-Parasitic Nematodes</span>
                  {sidebarOpen.section2 ? (
                    <ChevronDown className="w-4 h-4 text-slate-600" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-600" />
                  )}
                </button>

                {sidebarOpen.section2 && (
                  <div className="ml-3 mt-1">
                    {CATEGORIES.map((cat) => (
                      <div key={cat.id}>
                        <a
                          href={`#${cat.id}`}
                          className="block text-[#038764] hover:text-blue-700 hover:bg-blue-50 
                                  text-sm px-2 py-1 rounded-md transition"
                        >
                          {cat.title}
                        </a>

                        {/* Nested nematode entries */}
                        <div className="ml-4 border-l border-slate-200 pl-2 space-y-1">
                          {groupedByCategory[cat.id]?.map((entry) => {
                            const rawCN = entry?.["Common name"];
                            const cn =
                              rawCN && !rawCN.toLowerCase().includes("nematode")
                                ? (() => {
                                    const parts = rawCN.split(/\s+/);
                                    if (
                                      parts.includes("spp.") ||
                                      parts.includes("sp.")
                                    ) {
                                      return parts[0]
                                        ? <i>{parts[0]}</i> +
                                            " " +
                                            parts.slice(1).join(" ")
                                        : rawCN;
                                    }
                                    if (parts.length >= 2) {
                                      return (
                                        <>
                                          <i>
                                            {parts[0]} {parts[1]}
                                          </i>{" "}
                                          {parts.slice(2).join(" ")}
                                        </>
                                      );
                                    }
                                    return rawCN;
                                  })()
                                : rawCN;
                            const sect = entry?.data?.Section || "";
                            const nodeId = slugify(`${sect} ${cn}`);
                            return (
                              <a
                                key={nodeId}
                                href={`#${nodeId}`}
                                className="block text-[#292929] hover:text-blue-700 hover:bg-blue-50 
                                        text-xs px-2 py-1 rounded-md transition"
                                title={cn}
                              >
                                {sect ? `${sect} ` : ""}
                                {cn}
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Section 3 */}
              <div>
                <button
                  onClick={() => toggleSidebar("section3")}
                  className="flex items-center justify-between w-full text-left 
                          px-3 py-2 rounded-lg text-[#027fb8] font-semibold 
                          hover:bg-blue-50 transition"
                >
                  <span>3. Preventing Nematode Spread</span>
                  {sidebarOpen.section3 ? (
                    <ChevronDown className="w-4 h-4 text-slate-600" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-600" />
                  )}
                </button>

                {sidebarOpen.section3 && (
                  <div className="ml-3 mt-1 border-l border-slate-200 pl-3 space-y-1">
                    <a
                      href="#sanitize"
                      className="block text-[#292929] hover:text-blue-700 hover:bg-blue-50 
                                        text-xs px-2 py-1 rounded-md transition"
                    >
                      3.1 Sanitize Equipment and Tools
                    </a>
                    <a
                      href="#planting"
                      className="block text-[#292929] hover:text-blue-700 hover:bg-blue-50 
                                        text-xs px-2 py-1 rounded-md transition"
                    >
                      3.2 Manage Planting Material and Soil Movement
                    </a>
                    <a
                      href="#quarantine"
                      className="block text-[#292929] hover:text-blue-700 hover:bg-blue-50 
                                        text-xs px-2 py-1 rounded-md transition"
                    >
                      3.3 Quarantine New Plants
                    </a>
                  </div>
                )}
              </div>

              {/* Section 4 */}
              <div>
                <button
                  onClick={() => toggleSidebar("section4")}
                  className="flex items-center justify-between w-full text-left 
                          px-3 py-2 rounded-lg text-[#027fb8] font-semibold 
                          hover:bg-blue-50 transition"
                >
                  <span>4. Integrated Nematode Management</span>
                  {sidebarOpen.section4 ? (
                    <ChevronDown className="w-4 h-4 text-slate-600" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-600" />
                  )}
                </button>

                {sidebarOpen.section4 && (
                  <div className="ml-3 mt-1 border-l border-slate-200 pl-3 space-y-1">
                    <a
                      href="#monitoring"
                      className="block text-[#292929] hover:text-blue-700 hover:bg-blue-50 
                                        text-xs px-2 py-1 rounded-md transition"
                    >
                      4.1 Monitoring and Record-Keeping
                    </a>
                    <a
                      href="#rotation"
                      className="block text-[#292929] hover:text-blue-700 hover:bg-blue-50 
                                        text-xs px-2 py-1 rounded-md transition"
                    >
                      4.2 Crop Rotation and Cultural Practices

                    </a>
                    <a
                      href="#biological"
                      className="block text-[#292929] hover:text-blue-700 hover:bg-blue-50 
                                        text-xs px-2 py-1 rounded-md transition"
                    >
                      4.3 Biological Control
                    </a>
                    <a
                      href="#chemical"
                      className="block text-[#292929] hover:text-blue-700 hover:bg-blue-50 
                                        text-xs px-2 py-1 rounded-md transition"
                    >
                      4.4 Chemical Control: Safe Use and Limitations
                    </a>
                  </div>
                )}
              </div>

              <div>
                <button
                  onClick={() => toggleSidebar("section5")}
                  className="flex items-center justify-between w-full text-left px-3 py-2 
                          rounded-lg text-[#027fb8] font-semibold hover:bg-blue-50 transition"
                >
                  <span>5. Services for Growers</span>
                  {sidebarOpen.section5 ? (
                    <ChevronDown className="w-4 h-4 text-slate-600" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-600" />
                  )}
                </button>

                {sidebarOpen.section5 && (
                  <div className="ml-3 mt-1 border-l border-slate-200 pl-3 space-y-1">
                    <a
                      href="#where"
                      className="block text-[#292929] hover:text-blue-700 hover:bg-blue-50 
                                        text-xs px-2 py-1 rounded-md transition"
                    >
                      5.1 Where to Send Samples
                    </a>
                    <a
                      href="#when"
                      className="block text-[#292929] hover:text-blue-700 hover:bg-blue-50 
                                        text-xs px-2 py-1 rounded-md transition"
                    >
                      5.2 When to Collect Samples
                    </a>
                    <a
                      href="#how"
                      className="block text-[#292929] hover:text-blue-700 hover:bg-blue-50 
                                        text-xs px-2 py-1 rounded-md transition"
                    >
                      5.3 How to Collect Samples
                    </a>
                    <a
                      href="#handling"
                      className="block text-[#292929] hover:text-blue-700 hover:bg-blue-50 
                                        text-xs px-2 py-1 rounded-md transition"
                    >
                      5.4 Handling and Sending Samples
                    </a>
                    <a
                      href="#include"
                      className="block text-[#292929] hover:text-blue-700 hover:bg-blue-50 
                                        text-xs px-2 py-1 rounded-md transition"
                    >
                      5.5 Information to Include with Samples
                    </a>
                  </div>
                )}
              </div>
            </nav>
          </div>
        </aside>

        {/* Main content (kept tight next to the sidebar) */}
        <main className="flex-1 px-3 py-3 space-y-6">
          {err && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
              Failed to load dataset: {err}
            </div>
          )}

          {/* 1. Introduction */}
          <section
            id="intro"
            className="bg-white rounded-2xl shadow p-5 md:p-7"
          >
            <h2 className="text-xl md:text-2xl font-semibold text-[#027fb8] mb-2">
              1. Introduction
            </h2>

            {/* 1.1 */}
            <div id="what-are-nematodes" className="mt-4">
              <button
                onClick={() => toggle("what")}
                className="flex items-center justify-between w-full text-left 
                      bg-slate-50 hover:bg-slate-100 border border-slate-200 
                      rounded-lg shadow-sm p-4 transition 
                      text-lg md:text-xl font-semibold text-[#038764]"
              >
                <span>1.1 What are nematodes</span>
                {open.what ? (
                  <ChevronDown className="w-5 h-5 text-slate-600" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-slate-600" />
                )}
              </button>
              {open.what && (
                <ul className="list-disc pl-6 text-[#292929] space-y-1 mt-2">
                  <li>Nematodes are tiny, worm-like animals that live in soil and water.</li>
                  <li>Most are harmless or beneficial, helping to break down organic matter.</li>
                  <li>
                  Plant-parasitic nematodes (PPNs) feed on plant roots, reducing water and nutrient uptake.
                   Damage often looks like nutrient or water stress, but unlike those problems, plants won’t recover after fertilising or watering.
                  </li>
             
                  <li>Most are too small to see without a microscope but can cause major yield losses.</li>
                </ul>
              )}
            </div>

            {/* 1.2 */}
            <div id="biosecurity" className="mt-4">
              <button
                onClick={() => toggle("biosecurity")}
                className="flex items-center justify-between w-full text-left 
                      bg-slate-50 hover:bg-slate-100 border border-slate-200 
                      rounded-lg shadow-sm p-4 transition 
                      text-lg md:text-xl font-semibold text-[#038764]"
              >
                <span>1.2 Why biosecurity matters</span>
                {open.biosecurity ? (
                  <ChevronDown className="w-5 h-5 text-slate-600" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-slate-600" />
                )}
              </button>
              {open.biosecurity && (
                <ul className="list-disc pl-6 text-[#292929] space-y-1 mt-2">
                  <li>Biosecurity is about preventing pathogens and pests from entering and spreading.</li>
                  <li>
                  PPNs can easily spread through soil on shoes, machinery, or tools, as well as via water flow and planting material.
                  </li>
                  <li>
                  Once PPNs infest a paddock, they are usually only manageable, not eradicable. Prevention is the best defence.

                  </li>
                </ul>
              )}
            </div>

            {/* 1.3 */}
            <div id="agriculture" className="mt-4">
              <button
                onClick={() => toggle("agriculture")}
                className="flex items-center justify-between w-full text-left 
                      bg-slate-50 hover:bg-slate-100 border border-slate-200 
                      rounded-lg shadow-sm p-4 transition 
                      text-lg md:text-xl font-semibold text-[#038764]"
              >
                <span>1.3 Why nematodes matter to agriculture in Northern Australia</span>
                {open.agriculture ? (
                  <ChevronDown className="w-5 h-5 text-slate-600" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-slate-600" />
                )}
              </button>
              {open.agriculture && (
                <ul className="list-disc pl-6 text-[#292929] space-y-1 mt-2">
                  <li>PPNs can weaken plants, cause stunting, yellowing, tuber defects and poor root systems.</li>
                  <li>
                    Yield losses vary by crop and nematode type; small losses (&lt;10%) are often uneconomic, but susceptible crops or
                    outbreaks can exceed 20%.
                  </li>
                  <li>
                    Crops at risk include broadacre crops (cotton, wheat, mungbeans, etc.), fruit crops (melons, bananas, pineapple, etc.),
                    and vegetables (sweet potato, capsicum, tomato, cucumber, etc.).
                  </li>
                  <li>
                    Tropical conditions allow nematodes to multiply quickly. If unmanaged, outbreaks can spread between farms.
                  </li>
                </ul>
              )}
            </div>
          </section>

          {/* 2. Key PPNs */}
          <section id="key" className="bg-white rounded-2xl shadow p-5 md:p-7">
            <h2 className="text-xl md:text-2xl font-semibold text-[#027fb8] mb-2">
              2. Plant-Parasitic Nematodes in Northern Australia
            </h2>



        
                <p className="list-disc pl-6 text-[#292929] space-y-1 mt-2">
                  Plant-parasitic nematodes (PPNs) feed on plant roots in different ways, depending on the species and crop. Some feed only on outer root tissue, while others penetrate deeper or completely enter the root. PPNs use a specialised needle-like structure (stylet) to feed. Some induce the plant to form enlarged or nutrient-rich cells that support nematode growth, while others directly damage root tissue.
These feeding activities reduce plant vigour and yield, leading to stunted growth, poor root systems, reduced yield, or, in severe cases, unmarketable produce or crop failure. Understanding how nematodes interact with roots helps growers recognise symptoms and select effective management strategies. 
This section highlights the main PPNs affecting crops in Northern Australia, their biology, symptoms, and practical management options.
                </p>




            {CATEGORIES.map((cat) => (
              <div key={cat.id} id={cat.id} className="mt-6">
                <h3 className="text-lg md:text-xl font-semibold text-[#038764]">
                  {cat.title}
                </h3>
                {cat.blurb && (
                  <p className="text-slate-700 leading-relaxed mt-1">
                    {cat.blurb}
                  </p>
                )}
                {/* {cat.examples?.length > 0 && (
                <div className="text-sm text-slate-600 mt-2">
                  <span className="font-medium">Examples:&nbsp;</span>
                  {cat.examples.join("; ")}
                </div>
              )} */}

                {/* Nematode entries for this category (sorted by Section) */}
                <div className="mt-3 space-y-3 ">
                  {groupedByCategory[cat.id]?.length ? (
                    groupedByCategory[cat.id].map((entry) => {
                      const rawCN = entry?.["Common name"];
                      const rawSci =
                        entry?.data?.["Scientific Name"] ||
                        entry?.data?.["Scientific name"] ||
                        "";
                      const sect = entry?.data?.Section || "";
                      const nodeId = slugify(`${sect} ${rawCN || ""}`);

                      // Format Common Name
                      const cn =
                        rawCN && !rawCN.toLowerCase().includes("nematode")
                          ? (() => {
                              const parts = rawCN.split(/\s+/);
                              if (
                                parts.includes("spp.") ||
                                parts.includes("sp.")
                              ) {
                                return (
                                  <>
                                    <i>{parts[0]}</i> {parts.slice(1).join(" ")}
                                  </>
                                );
                              }
                              if (parts.length >= 2) {
                                return (
                                  <>
                                    <i>
                                      {parts[0]} {parts[1]}
                                    </i>{" "}
                                    {parts.slice(2).join(" ")}
                                  </>
                                );
                              }
                              return rawCN;
                            })()
                          : rawCN;

                      // Format Scientific Name
                      // Format Scientific Name (handles multiple with "&" or ",")
                      const sciName =
                        rawSci &&
                        rawSci.split(/(&|,)/).map((part, i) => {
                          const trimmed = part.trim();
                          if (trimmed === "&" || trimmed === ",") {
                            return (
                              <span key={i} className="mx-1">
                                {trimmed}
                              </span>
                            );
                          }
                          if (!trimmed) return null;

                          const tokens = trimmed.split(/\s+/);
                          // Case: "Genus spp." or "Genus sp."
                          if (
                            tokens.includes("spp.") ||
                            tokens.includes("sp.")
                          ) {
                            return (
                              <span key={i}>
                                <i>{tokens[0]} </i> {tokens[1]}
                                {tokens.slice(2).join(" ")}
                              </span>
                            );
                          }
                          // Case: "Genus species"
                          if (tokens.length >= 2) {
                            return (
                              <span key={i}>
                                <i>
                                  {tokens[0]} {tokens[1]}
                                </i>{" "}
                                {tokens.slice(2).join(" ")}
                              </span>
                            );
                          }
                          // Fallback: single word (italicise whole thing)
                          return (
                            <span key={i}>
                              <i>{trimmed}</i>
                            </span>
                          );
                        });

                      return (
                        <div key={nodeId} id={nodeId}>
                          <Link
                            to={`/details/${encodeURIComponent(rawCN || "")}`}
                            className="block bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg shadow-sm p-4 transition"
                          >
                            <div className="text-lg font-semibold text-blue-700">
                              {sect && (
                                <span className="font-bold">{sect} </span>
                              )}
                              {cn}
                              {sciName && (
                                <span className="ml-1 text-slate-600 font-normal">
                                  ({sciName})
                                </span>
                              )}
                            </div>
                          </Link>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-slate-500 text-sm italic">
                      No entries available yet.
                    </div>
                  )}
                </div>
              </div>
            ))}
          </section>
          <section
            id="prevention"
            className="bg-white rounded-2xl shadow p-5 md:p-7 mt-6"
          >
            <h2 className="text-xl md:text-2xl font-semibold text-slate-800 mb-2">
              3. Preventing Nematode Spread
            </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Preventing nematodes from entering or moving within your farm is
              the first line of defence.
              Key steps include:
            </p>

            {/* 3.1 Sanitize Equipment and Tools */}
            <div id="sanitize" className="mt-4">
              <button
                onClick={() => toggle("sanitize")}
                className="flex items-center justify-between w-full text-left 
                        bg-slate-50 hover:bg-slate-100 border border-slate-200 
                        rounded-lg shadow-sm p-4 transition 
                        text-lg md:text-xl font-semibold text-[#038764]"
              >
                <span>3.1 Sanitize Equipment and Tools</span>
                {open.sanitize ? (
                  <ChevronDown className="w-5 h-5 text-slate-600" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-slate-600" />
                )}
              </button>
              {open.sanitize && (
                <ul className="list-disc pl-6 text-slate-700 space-y-1 mt-2">
                  <li>
                    Remove soil and plant debris from machinery, tools, and footwear before moving between fields.
                  </li>
                  <li>
                    Pay special attention to tyres, treads, blades, and boots.
                  </li>
                  <li>
                    Where appropriate, use chemical sanitisers (e.g., quaternary ammonia, bleach) and follow instructions carefully.
                  </li>
                </ul>
              )}
            </div>

            {/* 3.2 Manage Planting Material and Soil Movement */}
            <div id="planting" className="mt-4">
              <button
                onClick={() => toggle("planting")}
                className="flex items-center justify-between w-full text-left 
                        bg-slate-50 hover:bg-slate-100 border border-slate-200 
                        rounded-lg shadow-sm p-4 transition 
                        text-lg md:text-xl font-semibold text-[#038764]"
              >
                <span>3.2 Manage Planting Material and Soil Movement</span>
                {open.planting ? (
                  <ChevronDown className="w-5 h-5 text-slate-600" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-slate-600" />
                )}
              </button>
              {open.planting && (
                <ul className="list-disc pl-6 text-slate-700 space-y-1 mt-2">
                  <li>
                    Use certified nematode-free seeds, seedlings, and transplants.
                  </li>
                  <li>
                    Avoid moving soil, compost, mulch, or plant material from known infested areas.
                  </li>
                  <li>
                    Test and treat soil if movement is unavoidable.
                  </li>
                </ul>
              )}
            </div>

            {/* 3.3 Quarantine New Plants */}
            <div id="quarantine" className="mt-4">
              <button
                onClick={() => toggle("quarantine")}
                className="flex items-center justify-between w-full text-left 
                        bg-slate-50 hover:bg-slate-100 border border-slate-200 
                        rounded-lg shadow-sm p-4 transition 
                        text-lg md:text-xl font-semibold text-[#038764]"
              >
                <span>3.3 Quarantine New Plants</span>
                {open.quarantine ? (
                  <ChevronDown className="w-5 h-5 text-slate-600" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-slate-600" />
                )}
              </button>
              {open.quarantine && (
                <ul className="list-disc pl-6 text-slate-700 space-y-1 mt-2">
                  <li>
                    Isolate newly sourced plants before planting.
                  </li>
                  <li>
                    Monitor for early signs of nematode infection (stunting, yellowing, poor roots).
                  </li>
                  <li>
                    Seek advice from local biosecurity or extension services if symptoms appear.
                  </li>
                </ul>
              )}
            </div>
          </section>
          <section
            id="management"
            className="bg-white rounded-2xl shadow p-5 md:p-7 mt-6"
          >
            <h2 className="text-xl md:text-2xl font-semibold text-slate-800 mb-2">
              4. Integrated Nematode Management
            </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Nematode control works best when multiple strategies are combined,
              tailored to your crops, soils, and tropical conditions.
            </p>

            {/* 4.1 Monitoring and Record-Keeping */}
            <div id="monitoring" className="mt-4">
              <button
                onClick={() => toggle("monitoring")}
                className="flex items-center justify-between w-full text-left
                        bg-slate-50 hover:bg-slate-100 border border-slate-200
                        rounded-lg shadow-sm p-4 transition
                        text-lg md:text-xl font-semibold text-[#038764]"
              >
                <span>4.1 Monitoring and Record-Keeping</span>
                {open.monitoring ? (
                  <ChevronDown className="w-5 h-5 text-slate-600" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-slate-600" />
                )}
              </button>
              {open.monitoring && (
                <ul className="list-disc pl-6 text-slate-700 space-y-1 mt-2">
                  <li>
                    Inspect crops and soil regularly – problems are easier to
                    manage if caught early.
                  </li>
                  <li>
                    Track nematode levels, crop rotations, and treatments to
                    support better management decisions.
                  </li>
                  {/* <li>
                    Early detection allows for targeted, lower-cost control and
                    helps prevent major losses.
                  </li> */}
                </ul>
              )}
              {/* 4.2 Crop Rotation and Cultural Practices */}
                <div id="rotation" className="mt-4">
                  <button
                    onClick={() => toggle("rotation")}
                    className="flex items-center justify-between w-full text-left
                            bg-slate-50 hover:bg-slate-100 border border-slate-200
                            rounded-lg shadow-sm p-4 transition
                            text-lg md:text-xl font-semibold text-[#038764]"
                  >
                    <span>4.2 Crop Rotation and Cultural Practices</span>
                    {open.rotation ? (
                      <ChevronDown className="w-5 h-5 text-slate-600" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-slate-600" />
                    )}
                  </button>

                  {open.rotation && (
                    <>
                      <ul className="list-disc pl-6 text-slate-700 space-y-1 mt-2">
                        <li>Rotate crops with non-host or poor-host plants to disrupt nematode life cycles.</li>
                        <li>Use cover crops and maintain soil organic matter to support beneficial organisms.</li>
                        <li>Adjust planting times, solarise soil, or bare fallow when practical.</li>
                        <li>Maintain plant health through good nutrition and moisture.</li>
                      </ul>
                      {/* Side-by-side images with same baseline + responsive heights */}
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Image 1: Wheat tolerance */}
                        <figure className="flex flex-col">
                          {/* Fixed-height, responsive image box so both bottoms align */}
                          <div className="relative w-full h-[280px] sm:h-[320px] md:h-[360px] lg:h-[420px] rounded-xl border border-slate-200 shadow-md overflow-hidden bg-white">
                            <img
                              src={wheatToleranceImg}
                              alt="Intolerant vs tolerant wheat to nematodes (photo: Jason Sheedy)"
                              loading="lazy"
                              className="absolute inset-0 w-full h-full object-contain"
                            />
                          </div>
                          {/* Give captions a minimum height so different line wraps don't shift baselines */}
                          <figcaption className="text-xs text-slate-500 mt-2 text-center min-h-[28px] md:min-h-[32px]">
                            Intolerant vs tolerant wheat to nematodes (Collected by Jason Sheedy).
                          </figcaption>
                        </figure>

                        {/* Image 2: Pineapple mulching */}
                        <figure className="flex flex-col">
                          <div className="relative w-full h-[280px] sm:h-[320px] md:h-[360px] lg:h-[420px] rounded-xl border border-slate-200 shadow-md overflow-hidden bg-white">
                            <img
                              src={pineappleMulchImg}
                              alt="Mulching pineapple residues to enrich soil (collected by Yujuan Jady Li)"
                              loading="lazy"
                              className="absolute inset-0 w-full h-full object-contain"
                            />
                          </div>
                          <figcaption className="text-xs text-slate-500 mt-2 text-center min-h-[28px] md:min-h-[32px]">
                            Mulching pineapple residues to enrich soil (Collected by Yujuan Jady Li).
                          </figcaption>
                        </figure>
                      </div>

                    </>
                  )}
                </div>

            </div>     
        
                    {/* 4.3 Biological Control */}
        <div id="biological" className="mt-4">
          <button
            onClick={() => toggle("biological")}
            className="flex items-center justify-between w-full text-left
                    bg-slate-50 hover:bg-slate-100 border border-slate-200
                    rounded-lg shadow-sm p-4 transition
                    text-lg md:text-xl font-semibold text-[#038764]"
          >
            <span>4.3 Biological Control</span>
            {open.biological ? (
              <ChevronDown className="w-5 h-5 text-slate-600" />
            ) : (
              <ChevronRight className="w-5 h-5 text-slate-600" />
            )}
          </button>

          {open.biological && (
            <>
              <ul className="list-disc pl-6 text-slate-700 space-y-1 mt-2">
                <li>Encourage beneficial fungi, predatory mites, and bacteria that naturally suppress nematodes.</li>
                <li>Support these organisms with organic amendments, compost and healthy soils.</li>
                <li>Effectiveness varies by region and crop — combine with other strategies and monitor results.</li>
              </ul>

              {/* Image: Pasteuria */}
              <figure className="mt-4 flex flex-col">
                <div className="relative w-full h-[280px] sm:h-[320px] md:h-[360px] lg:h-[420px] rounded-xl border border-slate-200 shadow-md overflow-hidden bg-white">
                  <img
                    src={pasteuriaImg}
                    alt="Pasteuria bacteria killing root-lesion nematode in the field (Photo: Yujuan Jady Li)"
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-contain"
                  />
                </div>
                <figcaption className="text-xs text-slate-500 mt-2 text-center min-h-[28px] md:min-h-[32px]">
                  Pasteuria bacteria killing root-lesion nematode in the field (Collected by Yujuan Jady Li).
                </figcaption>
              </figure>
            </>
          )}
        </div>


            {/* 4.4 Chemical Control */}
            {/* 4.4 Chemical Control: Safe Use and Limitations */}
<div id="chemical" className="mt-4">
  <button
    onClick={() => toggle("chemical")}
    className="flex items-center justify-between w-full text-left
            bg-slate-50 hover:bg-slate-100 border border-slate-200
            rounded-lg shadow-sm p-4 transition
            text-lg md:text-xl font-semibold text-[#038764]"
  >
    <span>4.4 Chemical Control: Safe Use and Limitations</span>
    {open.chemical ? (
      <ChevronDown className="w-5 h-5 text-slate-600" />
    ) : (
      <ChevronRight className="w-5 h-5 text-slate-600" />
    )}
  </button>

  {open.chemical && (
    <>
      <div className="mt-2 text-slate-700 space-y-3">
  <p className="font-medium">
    Chemical control is sometimes necessary and nematicides come in two main types:
  </p>

  <ol className="list-decimal pl-6 space-y-3">
    <li>
      <div className="font-semibold">Fumigants</div>
      <p className="text-sm italic">
        (e.g., 1,3-D, metham sodium, chloropicrin)
      </p>
      <p className="mt-1">
        Act quickly by producing gases that diffuse through the soil.
      </p>
      <ul className="list-disc pl-6 space-y-1 mt-1">
        <li>
          <span className="font-semibold">Advantages:</span> fast, broad-spectrum control.
        </li>
        <li>
          <span className="font-semibold">Disadvantages:</span> hazardous, costly, require careful soil preparation and sealing, and reduce beneficial soil organisms.
        </li>
      </ul>
    </li>

    <li>
      <div className="font-semibold">Non-fumigants</div>
      <p className="text-sm italic">
        (e.g., fluensulphone <span className="not-italic">(Nimitz®)</span>, fluopyram <span className="not-italic">(Indemnify®)</span>, fluazaindolizine <span className="not-italic">(Salibro®)</span>)
      </p>
      <p className="mt-1">
        Relatively safer, easier to handle, and with less impact on beneficial soil organisms.
        They reduce nematode reproduction and mobility but generally act more slowly.
      </p>
    </li>
  </ol>

  <ul className="list-disc pl-6 space-y-1">
    <li>Use nematicides only when necessary, following label instructions and safety guidelines.</li>
    <li>Be aware of environmental risks and potential development of resistance.</li>
    <li>Chemical control can provide immediate relief but is less sustainable long-term, particularly in tropical soils.</li>
    <li>Always combine chemical control with cultural and biological strategies for sustainable management.</li>
    <li>Many fumigants may be phased out in the future; integrated management programs are essential for long-term control.</li>
  </ul>

  {/* Further Information */}
  <div className="mt-3">
    <div className="font-semibold text-slate-900 mb-1">Further Information</div>
    <ul className="list-disc pl-6 space-y-1">
      <li>
        Desaeger JA, Wram C, Zasada I (2020). <span className="italic">New reduced-risk agricultural nematicides: Rationale and review.</span> <span className="italic">Journal of Nematology</span> 52, 1–16.
      </li>
      <li>
        Norris CE, Congreves KA (2018). <span className="italic">Alternative management practices improve soil health indices in intensive vegetable cropping systems.</span> <span className="italic">Frontiers in Environmental Science</span> 8, Article 50, 1–18.
      </li>
      <li>
        Stirling GR (2023). <span className="italic">Nematode management.</span> In: Stirling GR (ed) <span className="italic">Plant and soil nematodes: friend and foe.</span> APPsNet.{" "}
        <a href="https://www.appsnet.org/nematodes" target="_blank" rel="noreferrer" className="text-blue-700 underline">
          https://www.appsnet.org/nematodes
        </a>
      </li>
    </ul>
  </div>
</div>



      {/* Two images: equal baseline and responsive */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Image 1: Applying fumigants */}
        <figure className="flex flex-col">
          <div className="relative w-full h-[280px] sm:h-[320px] md:h-[360px] lg:h-[420px] rounded-xl border border-slate-200 shadow-md overflow-hidden bg-white">
            <img
              src={fumigantImg}
              alt="Applying fumigants before planting (Photo: Yujuan Jady Li)"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-contain"
            />
          </div>
          <figcaption className="text-xs text-slate-500 mt-2 text-center min-h-[28px] md:min-h-[32px]">
            Applying fumigants before planting (Collected by Yujuan Jady Li).
          </figcaption>
        </figure>

        {/* Image 2: Nematicide in sweetpotato field */}
        <figure className="flex flex-col">
          <div className="relative w-full h-[280px] sm:h-[320px] md:h-[360px] lg:h-[420px] rounded-xl border border-slate-200 shadow-md overflow-hidden bg-white">
            <img
              src={sweetpotatoNematicideImg}
              alt="Nematicide application in sweetpotato field (Photo: Yujuan Jady Li)"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-contain"
            />
          </div>
          <figcaption className="text-xs text-slate-500 mt-2 text-center min-h-[28px] md:min-h-[32px]">
            Nematicide application in sweetpotato field (Collected by Yujuan Jady Li).
          </figcaption>
        </figure>
      </div>
    </>
  )}
</div>

          </section>
          <section
  id="services"
  className="bg-white rounded-2xl shadow p-5 md:p-7 mt-6"
>
  <h2 className="text-xl md:text-2xl font-semibold text-slate-800 mb-2">
    5. Diagnostic Services
  </h2>
  <p className="text-slate-700 leading-relaxed mb-4">
    Effective nematode management and research depend on accurate diagnosis.
    Correct sampling, handling, and submission of soil and plant material are
    critical to obtain reliable results.
  </p>

  {/* 5.1 Where to Send Samples */}
  <div className="mt-4" id="where">
    <button
      onClick={() => toggle("where")}
      className="flex items-center justify-between w-full text-left
                 bg-slate-50 hover:bg-slate-100 border border-slate-200
                 rounded-lg shadow-sm p-4 transition
                 text-lg md:text-xl font-semibold text-[#038764]"
    >
      <span>5.1 Where to Send Samples</span>
      {open.where ? (
        <ChevronDown className="w-5 h-5 text-slate-600" />
      ) : (
        <ChevronRight className="w-5 h-5 text-slate-600" />
      )}
    </button>

    {open.where && (
      <div className="mt-2 space-y-4 text-slate-700">
        {/* NT */}
        <div>
          <div className="font-semibold text-slate-900">Northern Territory (NT)</div>
          <ul className="list-disc pl-6 space-y-1">
            <li>Northern Territory Department of Agriculture and Fisheries</li>
            <li>Combined Science Services Building, 29 Makagon Road, Berrimah NT</li>
            <li>Plant Pathology Diagnostic Laboratory</li>
            <li>
              Email:{" "}
              <a
                href="mailto:Plant.Pathology@nt.gov.au"
                className="text-blue-700 underline"
              >
                Plant.Pathology@nt.gov.au
              </a>
            </li>
            <li>Phone: (08) 8999 2218</li>
          </ul>
        </div>

        {/* QLD */}
        <div>
          <div className="font-semibold text-slate-900">Queensland (QLD)</div>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              Nematology, Department of Primary Industries, Ecosciences Precinct,
              B3 Joe Baker Street, Dutton Park, QLD 4102
            </li>
            <li>
              or Grow Help &mdash; Attn: Grow Help Australia, Department of Primary
              Industries, Ecosciences Precinct, B3 Joe Baker Street, Dutton Park QLD 4102
            </li>
            <li>
              Website:{" "}
              <a
                href="https://www.business.qld.gov.au/industries/farms-fishing-forestry/agriculture/crops/test/grow-help-australia"
                target="_blank"
                rel="noreferrer"
                className="text-blue-700 underline"
              >
                business.qld.gov.au &rsaquo; Grow Help Australia
              </a>
            </li>
          </ul>
        </div>

        {/* WA */}
        <div>
          <div className="font-semibold text-slate-900">Western Australia (WA)</div>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              Department of Primary Industries and Regional Development (DPIRD)
            </li>
            <li>
              Diagnostics and Laboratory Services (DDLS), 3 Baron-Hay Court, South Perth WA 6151
            </li>
            <li>
              Email:{" "}
              <a href="mailto:DDLS@dpird.wa.gov.au" className="text-blue-700 underline">
                DDLS@dpird.wa.gov.au
              </a>
            </li>
            <li>
              Website:{" "}
              <a
                href="https://www.dpird.wa.gov.au/businesses/biosecurity/diagnostics-and-laboratory-services/"
                target="_blank"
                rel="noreferrer"
                className="text-blue-700 underline"
              >
                dpird.wa.gov.au &rsaquo; Diagnostics and Laboratory Services
              </a>
            </li>
          </ul>
        </div>

        <p className="text-sm text-slate-600">
          Some interstate or commercial laboratories may provide nematode testing as well.
          Always confirm the laboratory has qualified nematologists and check any specific
          sampling requirements or submission forms before sending.
        </p>
      </div>
    )}
  </div>

  {/* 5.2 When to Collect Samples */}
  <div className="mt-4" id="when">
    <button
      onClick={() => toggle("when")}
      className="flex items-center justify-between w-full text-left
                 bg-slate-50 hover:bg-slate-100 border border-slate-200
                 rounded-lg shadow-sm p-4 transition
                 text-lg md:text-xl font-semibold text-[#038764]"
    >
      <span>5.2 When to Collect Samples</span>
      {open.when ? (
        <ChevronDown className="w-5 h-5 text-slate-600" />
      ) : (
        <ChevronRight className="w-5 h-5 text-slate-600" />
      )}
    </button>
    {open.when && (
      <ul className="list-disc pl-6 text-slate-700 space-y-1 mt-2">
        <li>When plants show patchy stunting, yellowing, poor growth, or reduced yields.</li>
        <li>When roots show lesions, galls, or other abnormal symptoms.</li>
        <li>At the end of a crop (preferred timing for estimating risk for the next crop).</li>
        <li>Before planting a new crop, if necessary (to assess nematode risk).</li>
      </ul>
    )}
  </div>

  {/* 5.3 How to Collect Samples */}
  <div className="mt-4" id="how">
    <button
      onClick={() => toggle("how")}
      className="flex items-center justify-between w-full text-left
                 bg-slate-50 hover:bg-slate-100 border border-slate-200
                 rounded-lg shadow-sm p-4 transition
                 text-lg md:text-xl font-semibold text-[#038764]"
    >
      <span>5.3 How to Collect Samples</span>
      {open.how ? (
        <ChevronDown className="w-5 h-5 text-slate-600" />
      ) : (
        <ChevronRight className="w-5 h-5 text-slate-600" />
      )}
    </button>
    {open.how && (
      <div className="mt-2 space-y-3 text-slate-700">
        <div>
          <div className="font-semibold text-slate-900">From affected crops</div>
          <ul className="list-disc pl-6 space-y-1 mt-1">
            <li>Dig up several plants with roots intact.</li>
            <li>Collect ~500 g soil around roots and ~100 g roots.</li>
            <li>Sample both poor and healthy patches for comparison.</li>
          </ul>
        </div>

        <div>
          <div className="font-semibold text-slate-900">Before planting</div>
          <ul className="list-disc pl-6 space-y-1 mt-1">
            <li>Prefer sampling at crop removal/end of the previous crop to assess build-up.</li>
            <li>For pre-plant testing, take multiple cores (20–40 per field) across representative areas.</li>
            <li>
              For low densities, a glasshouse bioassay with a susceptible host can detect nematodes not recovered by soil extraction.
            </li>
            <li>Mix gently and keep ~500 g for testing.</li>
            <li>Sample different soil types or cropping histories separately.</li>
          </ul>
        </div>
      </div>
    )}
  </div>

  {/* 5.4 Handling and Sending Samples */}
  <div className="mt-4" id="handling">
    <button
      onClick={() => toggle("handling")}
      className="flex items-center justify-between w-full text-left
                 bg-slate-50 hover:bg-slate-100 border border-slate-200
                 rounded-lg shadow-sm p-4 transition
                 text-lg md:text-xl font-semibold text-[#038764]"
    >
      <span>5.4 Handling and Sending Samples</span>
      {open.handling ? (
        <ChevronDown className="w-5 h-5 text-slate-600" />
      ) : (
        <ChevronRight className="w-5 h-5 text-slate-600" />
      )}
    </button>
    {open.handling && (
      <ul className="list-disc pl-6 text-slate-700 space-y-1 mt-2">
        <li>Place soil and roots in clearly labelled plastic bags (include site and date).</li>
        <li>Keep samples cool (not in direct sun or hot environments).</li>
        <li>Send promptly by express courier to the diagnostic laboratory.</li>
      </ul>
    )}
  </div>

  {/* 5.5 Information to Include with Samples */}
  <div className="mt-4" id="include">
    <button
      onClick={() => toggle("include")}
      className="flex items-center justify-between w-full text-left
                 bg-slate-50 hover:bg-slate-100 border border-slate-200
                 rounded-lg shadow-sm p-4 transition
                 text-lg md:text-xl font-semibold text-[#038764]"
    >
      <span>5.5 Information to Include with Samples</span>
      {open.include ? (
        <ChevronDown className="w-5 h-5 text-slate-600" />
      ) : (
        <ChevronRight className="w-5 h-5 text-slate-600" />
      )}
    </button>
    {open.include && (
      <div className="mt-2 space-y-3 text-slate-700">
        <ul className="list-disc pl-6 space-y-1">
          <li>Crop/cultivar sampled and observed symptoms.</li>
          <li>Field history (last two years of crops, rotations, chemical/fertilizer practices).</li>
        </ul>

        <div>
          <div className="font-semibold text-slate-900 mb-1">Further information</div>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              Stirling GR, Nicol JM, Reay F (2002) Advisory services for nematode pests.
              Rural Industries Research and Development Corporation (RIRDC).
            </li>
          </ul>
        </div>
      </div>
    )}
  </div>
</section>

        </main>
      </div>
    </FadeIn>
  );
} 