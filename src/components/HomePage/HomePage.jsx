// NematodeOverview.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

/* --------------------------- Static category model --------------------------- */
const CATEGORIES = [
  {
    id: 'sedentary-endoparasite',
    title: '2.1 Sedentary endoparasite',
    blurb:
      'These nematodes develop specialised feeding sites within plant roots. Rather than remaining worm-like, they enter the root and develop into swollen females that are fully or partly embedded in root tissue.',
    examples: [
      'Root-knot nematodes (Meloidogyne spp.)',
      'Cyst nematodes (Heterodera/Globodera spp.)',
    ],
    // keyword rules to slot common names here
    matchers: [/root-?knot/i, /cyst/i, /citrus\s+nematodes?/i, /\bmeloidogyne\b/i],
  },
  {
    id: 'migratory-endoparasite',
    title: '2.2 Migratory endoparasite',
    blurb:
      'These nematodes enter roots and migrate through tissues, feeding as they move. They do not form permanent feeding sites and can cause necrotic lesions and general root damage.',
    examples: [
      'Lesion nematodes (Pratylenchus spp.)',
      'Burrowing nematodes (Radopholus spp.)',
      'Citrus nematodes (Tylenchulus spp.)',
    ],
    matchers: [/lesion/i, /burrowing/i, /radopholus/i, /pratylenchus/i, /tylenchulus/i],
  },
  {
    id: 'ectoparasite',
    title: '2.3 Ectoparasite',
    blurb:
      'These nematodes feed from outside the roots, inserting their stylets into root tissues. They often reduce root growth and function and can vector plant viruses.',
    examples: [
      'Dagger nematodes (Xiphinema spp.)',
      'Ring nematodes (Criconematidae)',
      'Stunt/Spiral/Sheath/Pin/Needle/Stubby-root nematodes',
    ],
    matchers: [/dagger/i, /ring/i, /stunt/i, /spiral/i, /sheath/i, /\bpin\b/i, /needle/i, /stubby-?root/i, /paratrichodorus/i, /tylenchorhynchus/i, /helicotylenchus/i],
  },
  {
    id: 'foliar',
    title: '2.4 Foliar/Stem nematodes',
    blurb:
      'These species attack above-ground tissues (leaves, stems, buds), causing distortion, necrosis, or stunting and can spread via water splash or contaminated plant material.',
    examples: ['Foliar nematodes (Aphelenchoides spp.)', 'Stem nematodes (Ditylenchus spp.)'],
    matchers: [/foliar/i, /aphelenchoides/i, /stem/i, /ditylenchus/i],
  },
  {
    id: 'unclassified',
    title: '2.x Unclassified (pending category)',
    blurb:
      'Nematode groups listed here will be assigned to a formal category once classification data is available.',
    examples: [],
    matchers: [], // fallback bucket
  },
];

/* --------------------------- Helpers --------------------------- */
const EXAMPLE_COMMONS = [
  'Root-knot nematodes',
  'Lesion nematodes',
  'Ring nematodes',
  'Dagger nematodes',
  'Spiral nematodes',
  'Foliar nematodes',
  'Stem nematodes',
];

const normalizeGrouped = (data) => {
  if (!data) return {};
  if (Array.isArray(data)) {
    // Flattened → group by "Common name"
    return data.reduce((acc, e) => {
      const cn = e['Common name'] || '(Unknown group)';
      if (!acc[cn]) acc[cn] = { 'Common name': cn, 'Scientific taxa': [], Entries: {} };
      const tax = (e['Nematode Taxa'] || '(Unspecified taxon)').trim();
      acc[cn].Entries[tax] = acc[cn].Entries[tax] || [];
      acc[cn].Entries[tax].push(e);
      return acc;
    }, {});
  }
  return data;
};

const extractCommonNames = (grouped) => {
  try {
    return Object.values(grouped).map((g) => g['Common name']).filter(Boolean);
  } catch {
    return [];
  }
};

const classifyCommonName = (name) => {
  if (!name) return 'unclassified';
  for (const cat of CATEGORIES) {
    if (cat.id === 'unclassified') continue;
    if (cat.matchers.some((rx) => rx.test(name))) return cat.id;
  }
  return 'unclassified';
};

/* --------------------------- Component --------------------------- */
export default function NematodeOverview({
  datasetUrl = '/data/combined_nematodes_grouped_by_taxa.json',
}) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  // Fetch grouped data if available
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(datasetUrl);
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        const json = await res.json();
        if (!cancelled) setData(json);
      } catch (e) {
        // No data yet is fine; we’ll fallback to examples
        if (!cancelled) setError(String(e));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [datasetUrl]);

  // Build list of common names (from data or fallback)
  const commonNames = useMemo(() => {
    const grouped = normalizeGrouped(data);
    const names = extractCommonNames(grouped);
    if (names.length > 0) return names.sort((a, b) => a.localeCompare(b));
    return EXAMPLE_COMMONS;
  }, [data]);

  // Group names by category using keyword rules
  const groupedByCategory = useMemo(() => {
    const map = Object.fromEntries(CATEGORIES.map((c) => [c.id, []]));
    commonNames.forEach((cn) => {
      const id = classifyCommonName(cn);
      (map[id] || map['unclassified']).push(cn);
    });
    // Sort each list A→Z
    Object.keys(map).forEach((k) => map[k].sort((a, b) => a.localeCompare(b)));
    return map;
  }, [commonNames]);

  return (
    <div className="min-h-screen w-screen bg-slate-50">
      <main className="max-w-[1200px] mx-auto w-full px-4 py-6">
        {/* 1. Introduction */}
        <section id="intro" className="bg-white rounded-2xl shadow p-5 md:p-7">
          <h2 className="text-xl md:text-2xl font-semibold text-slate-800 mb-2">1. Introduction</h2>

          <h3 className="text-lg md:text-xl font-semibold text-slate-800 mt-4 mb-2">
            1.1 What are nematodes
          </h3>
          <p className="text-slate-700 leading-relaxed">
            Nematodes are microscopic, worm-like organisms commonly found in soil and water. While many
            are harmless or even beneficial, plant-parasitic nematodes (PPNs) feed on plant roots,
            disrupting water and nutrient uptake and causing significant crop damage.
          </p>

          <h3 className="text-lg md:text-xl font-semibold text-slate-800 mt-4 mb-2">
            1.2 Why biosecurity matters
          </h3>
          <p className="text-slate-700 leading-relaxed">
            Strong biosecurity measures are essential to prevent the introduction and spread of PPNs.
            Northern Australia’s geographic isolation and unique agricultural systems make it particularly
            vulnerable to invasive nematodes.
          </p>

          <h3 className="text-lg md:text-xl font-semibold text-slate-800 mt-4 mb-2">
            1.3 Why nematodes matter to agriculture in Northern Australia
          </h3>
          <p className="text-slate-700 leading-relaxed">
            PPNs can reduce crop yield and quality, leading to serious economic losses. The region’s
            tropical climate and diverse cropping systems create ideal conditions for nematode outbreaks,
            highlighting the need for effective, region-specific management strategies.
          </p>
        </section>

        {/* 2. Key PPNs with groupings */}
        <section id="key" className="mt-6">
          <div className="bg-white rounded-2xl shadow p-5 md:p-7">
            <h2 className="text-xl md:text-2xl font-semibold text-slate-800 mb-2">
              2. Key Plant-Parasitic Nematodes in Northern Australia
            </h2>

            {CATEGORIES.map((cat) => (
              <div key={cat.id} className="mt-5">
                <h3 className="text-lg md:text-xl font-semibold text-slate-800">{cat.title}</h3>
                {cat.blurb && <p className="text-slate-700 leading-relaxed mt-1">{cat.blurb}</p>}
                {cat.examples?.length > 0 && (
                  <div className="text-sm text-slate-600 mt-2">
                    <span className="font-medium">Examples:&nbsp;</span>
                    {cat.examples.join('; ')}
                  </div>
                )}

                {/* <div className="mt-3">
                  {groupedByCategory[cat.id]?.length ? (
                    <ul className="list-disc pl-6 space-y-1">
                      {groupedByCategory[cat.id].map((cn) => (
                        <li key={cn}>
                          <Link
                            to={`/details/${encodeURIComponent(cn)}`}
                            className="text-blue-700 hover:text-blue-900 underline-offset-2 hover:underline"
                          >
                            {cn}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-slate-500 text-sm italic">
                      No entries available yet.
                    </div>
                  )}
                </div> */}
                <div className="mt-3 space-y-3">
                {groupedByCategory[cat.id]?.length ? (
                    groupedByCategory[cat.id].map((cn) => {
                    // First scientific taxa (if available in data)
                    const grouped = normalizeGrouped(data);
                    const sciTaxa =
                        grouped?.[cn]?.['Scientific taxa']?.[0] || 'Unknown spp.';
                    const entriesCount = Object.keys(grouped?.[cn]?.Entries || {}).length;

                    return (
                        <Link
                        key={cn}
                        to={`/details/${encodeURIComponent(cn)}`}
                        className="block bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg shadow-sm p-4 transition"
                        >
                        <div className="text-lg font-semibold text-blue-700">
                            {cn}
                        </div>
                        <div className="text-sm italic text-slate-600">
                            {sciTaxa.endsWith('spp.') ? sciTaxa : `${sciTaxa} spp.`}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                            {entriesCount} type{entriesCount !== 1 ? 's' : ''} recorded
                        </div>
                        </Link>
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
          </div>
        </section>

        {/* 3. Preventing Nematode Spread */}
        <section id="prevention" className="mt-6">
          <div className="bg-white rounded-2xl shadow p-5 md:p-7">
            <h2 className="text-xl md:text-2xl font-semibold text-slate-800 mb-2">
              3. Preventing Nematode Spread
            </h2>
            <ul className="list-disc pl-6 text-slate-700 space-y-1">
              <li>Clean and disinfect machinery, tools, and footwear between fields.</li>
              <li>Use certified nematode-free seeds and plants.</li>
              <li>Avoid moving soil from infested areas.</li>
              <li>Quarantine new plants before planting.</li>
            </ul>
          </div>
        </section>

        {/* 4. Integrated Nematode Management */}
        <section id="management" className="mt-6">
          <div className="bg-white rounded-2xl shadow p-5 md:p-7">
            <h2 className="text-xl md:text-2xl font-semibold text-slate-800 mb-2">
              4. Integrated Nematode Management
            </h2>
            <ul className="list-disc pl-6 text-slate-700 space-y-1">
              <li>
                <strong>Crop Rotation:</strong> Use non-host crops to break nematode cycles.
              </li>
              <li>
                <strong>Biological Controls:</strong> Introduce beneficial microorganisms.
              </li>
              <li>
                <strong>Soil Health:</strong> Maintain organic matter and use cover crops.
              </li>
              <li>
                <strong>Chemical Controls:</strong> Apply nematicides as a last resort and follow
                labels.
              </li>
            </ul>
          </div>
        </section>

        {/* 5. Resources for Growers */}
        <section id="resources" className="mt-6">
          <div className="bg-white rounded-2xl shadow p-5 md:p-7">
            <h2 className="text-xl md:text-2xl font-semibold text-slate-800 mb-2">
              5. Resources for Growers
            </h2>
            <div className="text-slate-700 space-y-2">
              <div>
                <strong>NT:</strong> Northern Territory Department of Industry, Tourism and Trade
              </div>
              <div>
                <strong>QLD:</strong>{' '}
                <span className="italic text-slate-500">[Insert Contact]</span>
              </div>
              <div>
                <strong>WA:</strong>{' '}
                <span className="italic text-slate-500">[Insert Contact]</span>
              </div>
            </div>
          </div>
        </section>

        {/* Data load status (optional subtle note) */}
        {error && (
          <div className="mt-4 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded p-3">
            Couldn’t load data from {datasetUrl}. Showing example groups until data is available.
          </div>
        )}
      </main>

      <footer className="py-6 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Northern Australia Nematode Portal
      </footer>
    </div>
  );
}
