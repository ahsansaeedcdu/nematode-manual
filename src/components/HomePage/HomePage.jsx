// NematodeOverview.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

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
    matchers: [/dagger/i, /xiphinema/i],
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

  return (
    <div className="flex min-h-screen w-screen bg-slate-50">
      {/* Sidebar (packed rectangular card, wider so items stay one line) */}
      <aside className="hidden md:block w-80 p-3 sticky top-0 h-screen">
        <div className="h-full rounded-xl bg-white shadow-md border border-slate-200 p-5 overflow-y-auto">
          <h2 className="text-lg font-bold text-slate-700 mb-4">On this page</h2>
          <nav className="space-y-3">
            {/* 1. Introduction */}
            <div>
              <a
                href="#intro"
                className="block px-3 py-2 rounded-lg text-blue-700 font-semibold hover:bg-blue-50 transition"
              >
                1. Introduction
              </a>
              <div className="ml-3 mt-1 border-l border-slate-200 pl-3 space-y-1">
                <a
                  href="#what-are-nematodes"
                  className="block text-slate-600 hover:text-blue-700 hover:bg-blue-50 text-sm px-2 py-1 rounded-md transition"
                >
                  1.1 What are nematodes
                </a>
                <a
                  href="#biosecurity"
                  className="block text-slate-600 hover:text-blue-700 hover:bg-blue-50 text-sm px-2 py-1 rounded-md transition"
                >
                  1.2 Why biosecurity matters
                </a>
                <a
                  href="#agriculture"
                  className="block text-slate-600 hover:text-blue-700 hover:bg-blue-50 text-sm px-2 py-1 rounded-md transition"
                >
                  1.3 Agriculture in Northern Australia
                </a>
              </div>
            </div>

            {/* 2. Key PPNs */}
            <div>
              <a
                href="#key"
                className="block px-3 py-2 rounded-lg text-blue-700 font-semibold hover:bg-blue-50 transition"
              >
                2. Key Plant-Parasitic Nematodes
              </a>

              {CATEGORIES.map((cat) => (
                <div key={cat.id} className="ml-3 mt-1">
                  <a
                    href={`#${cat.id}`}
                    className="block text-slate-600 hover:text-blue-700 hover:bg-blue-50 text-sm px-2 py-1 rounded-md transition"
                  >
                    {cat.title}
                  </a>

                  {/* Nested nematode entries for this category, sorted by numeric Section */}
                  <div className="ml-4 border-l border-slate-200 pl-2 space-y-1">
                    {groupedByCategory[cat.id]?.map((entry) => {
                      const cn = entry?.["Common name"];
                      const sect = entry?.data?.Section || "";
                      // More unique anchor by combining section + common name
                      const nodeId = slugify(`${sect} ${cn}`);
                      return (
                        <a
                          key={nodeId}
                          href={`#${nodeId}`}
                          className="block text-slate-500 hover:text-blue-700 hover:bg-blue-50 text-xs px-2 py-1 rounded-md transition"
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

          <h3
            id="what-are-nematodes"
            className="text-lg md:text-xl font-semibold text-slate-800 mt-4 mb-2"
          >
            1.1 What are nematodes
          </h3>
          <ul className="list-disc pl-6 text-slate-700 space-y-1">
            <li>Nematodes are tiny, worm-like creatures that live in soil and water.</li>
            <li>Most are harmless or beneficial – they help break down organic matter.</li>
            <li>
              Plant-parasitic nematodes (PPNs) feed on plant roots, reducing water and nutrient uptake.
              Damage often looks like nutrient or water stress—but plants won’t recover after fertilising or watering.
            </li>
            <li>They are too small to see without a microscope but can cause major yield losses.</li>
          </ul>

          <h3
            id="biosecurity"
            className="text-lg md:text-xl font-semibold text-slate-800 mt-4 mb-2"
          >
            1.2 Why biosecurity matters
          </h3>
          <ul className="list-disc pl-6 text-slate-700 space-y-1">
            <li>Biosecurity = stopping pests from entering and spreading.</li>
            <li>PPNs spread easily in soil, water, machinery, tools, and planting material.</li>
            <li>Once they’re in a paddock, removal is difficult and costly – prevention is the best defence.</li>
          </ul>

          <h3
            id="agriculture"
            className="text-lg md:text-xl font-semibold text-slate-800 mt-4 mb-2"
          >
            1.3 Why nematodes matter to agriculture in Northern Australia
          </h3>
          <ul className="list-disc pl-6 text-slate-700 space-y-1">
            <li>PPNs weaken plants, causing stunting, yellowing, and poor root systems.</li>
            <li>Yield losses can range from 20–100%, depending on crop and nematode type.</li>
            <li>
              Crops at risk include broadacre crops (cotton, wheat, mungbeans, etc.), fruit crops
              (melons, bananas, pineapple, etc.), and vegetables (sweet potato, capsicum, tomato, cucumber, etc.).
            </li>
            <li>
              Tropical conditions allow nematodes to multiply quickly – unmanaged outbreaks can spread between farms.
            </li>
          </ul>
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
              {cat.examples?.length > 0 && (
                <div className="text-sm text-slate-600 mt-2">
                  <span className="font-medium">Examples:&nbsp;</span>
                  {cat.examples.join("; ")}
                </div>
              )}

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
      </main>
    </div>
  );
}
