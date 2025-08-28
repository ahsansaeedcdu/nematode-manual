// NematodeOverview.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";
import FadeIn from "../FadeIn/FadeIn";
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
    matchers: [ /dagger/i, /xiphinema/i, /needle/i, /paralongidorus/i, /southern\s*sting/i, /ibipora/i, /stubby/i, /paratrichodorus/i, /ring/i, /criconematidae/i, /stunt/i, /tylenchorhynchus/i, /spiral/i, /helicotylenchus/i, /rotylenchus/i, /scutellonema/i, /lance/i, /hoplolaimus/i, /\bpin\b/i, /paratylenchus/i, /gracilacus/i, /\bsheath\b/i, /hemicycliophora/i ],
  },
  {
    id: "foliar",
    title: "2.5 Foliar, leaf or bud nematodes",
    blurb:
      "",
    examples: ["Foliar nematodes (Aphelenchoides spp.)"],
    matchers: [
      /foliar/i,
      /leaf/i,
      /bud/i,
      /aphelenchoides/i
    ],
  },
]
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
  datasetUrl = "/data/combined_nematodes_grouped_by_taxa.json",
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
      map[k].sort((a, b) =>
        compareSections(a?.data?.Section, b?.data?.Section)
      )
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
          <h2 className="text-lg font-bold text-slate-700 mb-4">On this page</h2>
          <nav className="space-y-3">
            {/* 1. Introduction */}
            {/* Section 1 */}
            <div>
              <button
                onClick={() => toggleSidebar("section1")}
                className="flex items-center justify-between w-full text-left 
                          px-3 py-2 rounded-lg text-blue-700 font-semibold 
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
                    className="block text-slate-600 hover:text-blue-700 hover:bg-blue-50 
                              text-sm px-2 py-1 rounded-md transition"
                  >
                    1.1 What are nematodes
                  </a>
                  <a
                    href="#biosecurity"
                    className="block text-slate-600 hover:text-blue-700 hover:bg-blue-50 
                              text-sm px-2 py-1 rounded-md transition"
                  >
                    1.2 Why biosecurity matters
                  </a>
                  <a
                    href="#agriculture"
                    className="block text-slate-600 hover:text-blue-700 hover:bg-blue-50 
                              text-sm px-2 py-1 rounded-md transition"
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
                          px-3 py-2 rounded-lg text-blue-700 font-semibold 
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
                        className="block text-slate-600 hover:text-blue-700 hover:bg-blue-50 
                                  text-sm px-2 py-1 rounded-md transition"
                      >
                        {cat.title}
                      </a>

                      {/* Nested nematode entries */}
                      <div className="ml-4 border-l border-slate-200 pl-2 space-y-1">
                        {groupedByCategory[cat.id]?.map((entry) => {
                          const cn = entry?.["Common name"];
                          const sect = entry?.data?.Section || "";
                          const nodeId = slugify(`${sect} ${cn}`);
                          return (
                            <a
                              key={nodeId}
                              href={`#${nodeId}`}
                              className="block text-slate-500 hover:text-blue-700 hover:bg-blue-50 
                                        text-xs px-2 py-1 rounded-md transition"
                              title={cn}
                            >
                              {sect ? `${sect} ` : ""}{cn}
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
                          px-3 py-2 rounded-lg text-blue-700 font-semibold 
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
                    className="block text-slate-600 hover:text-blue-700 hover:bg-blue-50 
                              text-sm px-2 py-1 rounded-md transition"
                  >
                    3.1 Sanitize Equipment and Tools
                  </a>
                  <a
                    href="#planting"
                    className="block text-slate-600 hover:text-blue-700 hover:bg-blue-50 
                              text-sm px-2 py-1 rounded-md transition"
                  >
                    3.2 Manage Planting Material and Soil Movement
                  </a>
                  <a
                    href="#quarantine"
                    className="block text-slate-600 hover:text-blue-700 hover:bg-blue-50 
                              text-sm px-2 py-1 rounded-md transition"
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
                          px-3 py-2 rounded-lg text-blue-700 font-semibold 
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
                    className="block text-slate-600 hover:text-blue-700 hover:bg-blue-50 
                              text-sm px-2 py-1 rounded-md transition"
                  >
                    4.1 Monitoring and Record-Keeping
                  </a>
                  <a
                    href="#rotation"
                    className="block text-slate-600 hover:text-blue-700 hover:bg-blue-50 
                              text-sm px-2 py-1 rounded-md transition"
                  >
                    4.2 Crop Rotation and Cultural Practices
                  </a>
                  <a
                    href="#biological"
                    className="block text-slate-600 hover:text-blue-700 hover:bg-blue-50 
                              text-sm px-2 py-1 rounded-md transition"
                  >
                    4.3 Biological Control
                  </a>
                  <a
                    href="#chemical"
                    className="block text-slate-600 hover:text-blue-700 hover:bg-blue-50 
                              text-sm px-2 py-1 rounded-md transition"
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
                          rounded-lg text-blue-700 font-semibold hover:bg-blue-50 transition"
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
                  <a href="#sampling" className="block text-slate-600 hover:text-blue-700 hover:bg-blue-50 text-sm px-2 py-1 rounded-md transition">
                    5.1 Sampling Methods
                  </a>
                  <a href="#labs" className="block text-slate-600 hover:text-blue-700 hover:bg-blue-50 text-sm px-2 py-1 rounded-md transition">
                    5.2 State Government Diagnostic Laboratories
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
        <section id="intro" className="bg-white rounded-2xl shadow p-5 md:p-7">
          <h2 className="text-xl md:text-2xl font-semibold text-slate-800 mb-2">
            1. Introduction
          </h2>

          {/* 1.1 */}
          <div id="what-are-nematodes" className="mt-4">
            <button
              onClick={() => toggle("what")}
              className="flex items-center justify-between w-full text-left 
             bg-slate-50 hover:bg-slate-100 border border-slate-200 
             rounded-lg shadow-sm p-4 transition 
             text-lg md:text-xl font-semibold text-slate-800"
            >
              <span>1.1 What are nematodes</span>
              {open.what ? (
                <ChevronDown className="w-5 h-5 text-slate-600" />
              ) : (
                <ChevronRight className="w-5 h-5 text-slate-600" />
              )}
            </button>
            {open.what && (
              <ul className="list-disc pl-6 text-slate-700 space-y-1 mt-2">
                <li>Nematodes are tiny, worm-like creatures that live in soil and water.</li>
                <li>Most are harmless or beneficial – they help break down organic matter.</li>
                <li>
                  Plant-parasitic nematodes (PPNs) feed on plant roots, reducing water and nutrient
                  uptake. Damage often looks like nutrient or water stress—but plants won’t recover after
                  fertilising or watering.
                </li>
                <li>They are too small to see without a microscope but can cause major yield losses.</li>
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
             text-lg md:text-xl font-semibold text-slate-800"
            >
              <span>1.2 Why biosecurity matters</span>
              {open.biosecurity ? (
                <ChevronDown className="w-5 h-5 text-slate-600" />
              ) : (
                <ChevronRight className="w-5 h-5 text-slate-600" />
              )}
            </button>
            {open.biosecurity && (
              <ul className="list-disc pl-6 text-slate-700 space-y-1 mt-2">
                <li>Biosecurity = stopping pests from entering and spreading.</li>
                <li>PPNs spread easily in soil, water, machinery, tools, and planting material.</li>
                <li>
                  Once they’re in a paddock, removal is difficult and costly – prevention is the best
                  defence.
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
             text-lg md:text-xl font-semibold text-slate-800"
            >
              <span>1.3 Why nematodes matter to agriculture in Northern Australia</span>
              {open.agriculture ? (
                <ChevronDown className="w-5 h-5 text-slate-600" />
              ) : (
                <ChevronRight className="w-5 h-5 text-slate-600" />
              )}
            </button>
            {open.agriculture && (
              <ul className="list-disc pl-6 text-slate-700 space-y-1 mt-2">
                <li>PPNs weaken plants, causing stunting, yellowing, and poor root systems.</li>
                <li>Yield losses can range from 20–100%, depending on crop and nematode type.</li>
                <li>
                  Crops at risk include broadacre crops (cotton, wheat, mungbeans, etc.), fruit crops
                  (melons, bananas, pineapple, etc.), and vegetables (sweet potato, capsicum, tomato,
                  cucumber, etc.).
                </li>
                <li>
                  Tropical conditions allow nematodes to multiply quickly – unmanaged outbreaks can spread
                  between farms.
                </li>
              </ul>
            )}
          </div>
        </section>

        {/* 2. Key PPNs */}
        <section id="key" className="bg-white rounded-2xl shadow p-5 md:p-7">
          <h2 className="text-xl md:text-2xl font-semibold text-slate-800 mb-2">
            2. Key Plant-Parasitic Nematodes in Northern Australia
          </h2>

          {CATEGORIES.map((cat) => (
            <div key={cat.id} id={cat.id} className="mt-6">
              <h3 className="text-lg md:text-xl font-semibold text-slate-800">
                {cat.title}
              </h3>
              {cat.blurb && (
                <p className="text-slate-700 leading-relaxed mt-1">{cat.blurb}</p>
              )}
              {/* {cat.examples?.length > 0 && (
                <div className="text-sm text-slate-600 mt-2">
                  <span className="font-medium">Examples:&nbsp;</span>
                  {cat.examples.join("; ")}
                </div>
              )} */}

              {/* Nematode entries for this category (sorted by Section) */}
              <div className="mt-3 space-y-3">
                {groupedByCategory[cat.id]?.length ? (
                  groupedByCategory[cat.id].map((entry) => {
                    const cn = entry?.["Common name"];
                    const sciName =
                      entry?.data?.["Scientific Name"] ||
                      entry?.data?.["Scientific name"] ||
                      "";
                    const sect = entry?.data?.Section || "";
                    const nodeId = slugify(`${sect} ${cn}`);
                    const titleText = `${sect ? sect + " " : ""}${cn}${
                      sciName ? ` (${sciName})` : ""
                    }`;

                    return (
                      <div key={nodeId} id={nodeId}>
                        <Link
                          to={`/details/${encodeURIComponent(cn)}`}
                          className="block bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg shadow-sm p-4 transition"
                        >
                          <div className="text-lg font-semibold text-blue-700">
                            {titleText}
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
        <section id="prevention" className="bg-white rounded-2xl shadow p-5 md:p-7 mt-6">
          <h2 className="text-xl md:text-2xl font-semibold text-slate-800 mb-2">
            3. Preventing Nematode Spread
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Preventing nematodes from entering or moving within your farm is the first line of defence.
            Key steps include:
          </p>

          {/* 3.1 Sanitize Equipment and Tools */}
          <div id="sanitize" className="mt-4">
            <button
              onClick={() => toggle("sanitize")}
              className="flex items-center justify-between w-full text-left 
                        bg-slate-50 hover:bg-slate-100 border border-slate-200 
                        rounded-lg shadow-sm p-4 transition 
                        text-lg md:text-xl font-semibold text-slate-800"
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
                <li>Clean machinery, tools, and footwear before moving between fields or properties.</li>
                <li>Even small amounts of soil or plant debris can carry nematodes.</li>
                <li>
                  Pay special attention to soil that may stick to tyres, treads, blades, or boots.
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
                        text-lg md:text-xl font-semibold text-slate-800"
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
                <li>Only use certified nematode-free seeds, seedlings, and transplants.</li>
                <li>Avoid moving soil, compost, mulch, or plant material from known infested areas.</li>
                <li>
                  If soil must be moved, ensure it is tested and treated where possible.
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
                        text-lg md:text-xl font-semibold text-slate-800"
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
                <li>Isolate newly purchased or sourced plants for observation before planting.</li>
                <li>
                  Monitor regularly for early signs of nematode infection, such as stunted growth,
                  yellowing, or poor root development.
                </li>
                <li>
                  If any symptoms appear, contact local biosecurity or extension services before
                  introducing plants to other areas.
                </li>
              </ul>
            )}
          </div>
        </section>
        <section id="management" className="bg-white rounded-2xl shadow p-5 md:p-7 mt-6">
          <h2 className="text-xl md:text-2xl font-semibold text-slate-800 mb-2">
            4. Integrated Nematode Management
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Nematode control works best when multiple strategies are combined, tailored to your crops,
            soils, and tropical conditions.
          </p>

          {/* 4.1 Monitoring and Record-Keeping */}
          <div id="monitoring" className="mt-4">
            <button
              onClick={() => toggle("monitoring")}
              className="flex items-center justify-between w-full text-left
                        bg-slate-50 hover:bg-slate-100 border border-slate-200
                        rounded-lg shadow-sm p-4 transition
                        text-lg md:text-xl font-semibold text-slate-800"
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
                <li>Inspect crops and soil regularly – problems are easier to manage if caught early.</li>
                <li>
                  Track nematode levels, crop rotations, and treatments to support better management
                  decisions.
                </li>
                <li>
                  Early detection allows for targeted, lower-cost control and helps prevent major losses.
                </li>
              </ul>
            )}
          </div>

          {/* 4.2 Crop Rotation and Cultural Practices */}
          <div id="rotation" className="mt-4">
            <button
              onClick={() => toggle("rotation")}
              className="flex items-center justify-between w-full text-left
                        bg-slate-50 hover:bg-slate-100 border border-slate-200
                        rounded-lg shadow-sm p-4 transition
                        text-lg md:text-xl font-semibold text-slate-800"
            >
              <span>4.2 Crop Rotation and Cultural Practices</span>
              {open.rotation ? (
                <ChevronDown className="w-5 h-5 text-slate-600" />
              ) : (
                <ChevronRight className="w-5 h-5 text-slate-600" />
              )}
            </button>
            {open.rotation && (
              <ul className="list-disc pl-6 text-slate-700 space-y-1 mt-2">
                <li>Rotate crops with non-host or poor-host plants to disrupt nematode life cycles.</li>
                <li>
                  Use cover crops and maintain soil organic matter to improve soil health and support
                  natural nematode antagonists.
                </li>
                <li>
                  Adjust planting times, solarise soil, or use bare fallowing when practical (tropical
                  conditions may limit some practices).
                </li>
                <li>
                  Reduce plant stress by maintaining good nutrition and moisture. Healthy plants are less
                  affected by nematodes.
                </li>
              </ul>
            )}
          </div>

          {/* 4.3 Biological Control */}
          <div id="biological" className="mt-4">
            <button
              onClick={() => toggle("biological")}
              className="flex items-center justify-between w-full text-left
                        bg-slate-50 hover:bg-slate-100 border border-slate-200
                        rounded-lg shadow-sm p-4 transition
                        text-lg md:text-xl font-semibold text-slate-800"
            >
              <span>4.3 Biological Control</span>
              {open.biological ? (
                <ChevronDown className="w-5 h-5 text-slate-600" />
              ) : (
                <ChevronRight className="w-5 h-5 text-slate-600" />
              )}
            </button>
            {open.biological && (
              <ul className="list-disc pl-6 text-slate-700 space-y-1 mt-2">
                <li>
                  Encourage beneficial fungi, predatory mites, and bacteria that naturally suppress
                  nematodes.
                </li>
                <li>
                  Support these organisms with organic amendments, compost and healthy soils.
                </li>
                <li>
                  Effectiveness varies by region and crop — combine with other strategies and monitor
                  results.
                </li>
              </ul>
            )}
          </div>

          {/* 4.4 Chemical Control */}
          <div id="chemical" className="mt-4">
            <button
              onClick={() => toggle("chemical")}
              className="flex items-center justify-between w-full text-left
                        bg-slate-50 hover:bg-slate-100 border border-slate-200
                        rounded-lg shadow-sm p-4 transition
                        text-lg md:text-xl font-semibold text-slate-800"
            >
              <span>4.4 Chemical Control: Safe Use and Limitations</span>
              {open.chemical ? (
                <ChevronDown className="w-5 h-5 text-slate-600" />
              ) : (
                <ChevronRight className="w-5 h-5 text-slate-600" />
              )}
            </button>
            {open.chemical && (
              <ul className="list-disc pl-6 text-slate-700 space-y-1 mt-2">
                <li>Use nematicides only when necessary, following label instructions and safety guidelines.</li>
                <li>Be aware of environmental risks and potential development of resistance.</li>
                <li>
                  Chemical control can provide immediate relief, but is less sustainable long-term,
                  particularly in tropical soils.
                </li>
                <li>
                  Always combine chemical control with cultural and biological strategies for best
                  results.
                </li>
              </ul>
            )}
          </div>
        </section>
        <section id="services" className="bg-white rounded-2xl shadow p-5 md:p-7 mt-6">
          <h2 className="text-xl md:text-2xl font-semibold text-slate-800 mb-2">
            5. Services for Growers
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Effective nematode management begins with accurate diagnosis and tailored strategies.
            The following services and resources are available to support growers:
          </p>

          {/* 5.1 Sampling Methods */}
          <div className="mt-4" id="sampling">
            <button
              onClick={() => toggle("sampling")}
              className="flex items-center justify-between w-full text-left
                        bg-slate-50 hover:bg-slate-100 border border-slate-200
                        rounded-lg shadow-sm p-4 transition
                        text-lg md:text-xl font-semibold text-slate-800"
            >
              <span>5.1 Sampling Methods</span>
              {open.sampling ? (
                <ChevronDown className="w-5 h-5 text-slate-600" />
              ) : (
                <ChevronRight className="w-5 h-5 text-slate-600" />
              )}
            </button>
            {open.sampling && (
              <ul className="list-disc pl-6 text-slate-700 space-y-1 mt-2">
                <li>Correct soil and root sampling is essential for reliable nematode detection.</li>
                <li>
                  Follow recommended guidelines (e.g. sample from the root zone, include fine roots, keep
                  samples cool, and submit promptly).
                </li>
                <li>Early detection allows for timely and cost-effective management.</li>
              </ul>
            )}
          </div>

          {/* 5.2 State Government Diagnostic Laboratories */}
          <div className="mt-4" id="labs">
            <button
              onClick={() => toggle("labs")}
              className="flex items-center justify-between w-full text-left
                        bg-slate-50 hover:bg-slate-100 border border-slate-200
                        rounded-lg shadow-sm p-4 transition
                        text-lg md:text-xl font-semibold text-slate-800"
            >
              <span>5.2 State Government Diagnostic Laboratories</span>
              {open.labs ? (
                <ChevronDown className="w-5 h-5 text-slate-600" />
              ) : (
                <ChevronRight className="w-5 h-5 text-slate-600" />
              )}
            </button>
            {open.labs && (
              <ul className="list-disc pl-6 text-slate-700 space-y-1 mt-2">
                <li>Northern Territory (NT):</li>
                <li>Queensland (QLD):</li>
                <li>Western Australia (WA):</li>
              </ul>
            )}
          </div>
        </section>
      </main>
    </div>
    </FadeIn>
  );
}
