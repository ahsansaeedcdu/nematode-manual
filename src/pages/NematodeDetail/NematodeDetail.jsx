// NematodeDetail.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
// import MapPreviewModal from "../../components/MapPreviewModal/MapPreviewModal"; // optional

/** --- helpers --- */
const getGenusLabelFromTaxaArray = (scientificTaxa) => {
  if (!Array.isArray(scientificTaxa) || scientificTaxa.length === 0) return null;
  const first = String(scientificTaxa[0] || "").trim();
  const genus = first.split(/\s+/)[0];
  return genus ? `${genus} spp.` : null;
};

const getGenusLabelFromScientificName = (sciName) => {
  if (!sciName) return null;
  const genus = String(sciName).split(/\s+/)[0];
  return genus ? `${genus} spp.` : null;
};

const normalizeGrouped = (data) => data || {};

const flattenEntriesFromTaxaMap = (taxaMap) => {
  const out = [];
  Object.entries(taxaMap || {}).forEach(([taxon, list]) => {
    (list || []).forEach((e) => out.push({ taxon, ...e }));
  });
  return out;
};

// Preferred 1-column details to show in the “Overview” section
const OVERVIEW_ORDER = [
  "Common Name",
  "Scientific Name",
  "Distribution",
  "Crops at Risk",
  "Life Cycle",
  "Why They Matter",
];

// robust array parser
const toArray = (val) => {
  if (Array.isArray(val)) return val.filter(Boolean).map(String);
  if (typeof val === "string") {
    const parts = val.split(/\n|;|,/).map((s) => s.trim()).filter(Boolean);
    return parts.length ? parts : [val].filter(Boolean);
  }
  return [];
};

// split a sentence-ish string into gentle bullet points
const splitToBullets = (text) =>
  String(text || "")
    .split(/(?:\.\s+|;\s+|,\s+)(?=[A-Z(])/)
    .map((s) => s.trim().replace(/[.;,]$/, ""))
    .filter(Boolean);

export default function NematodeDetail({
  datasetUrl = "/data/combined_nematodes_grouped_by_taxa.json",
}) {
  const { commonName: paramCommonName } = useParams();
  const commonName = decodeURIComponent(paramCommonName || "").trim();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  // const [mapModalOpen, setMapModalOpen] = useState(false);
  // const [selectedEntry, setSelectedEntry] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(datasetUrl);
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        const json = await res.json();
        if (!cancelled) setData(json);
      } catch (e) {
        if (!cancelled) setErr(String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [datasetUrl]);

  const grouped = useMemo(() => normalizeGrouped(data), [data]);

  // Try exact key first; if missing, fallback to case-insensitive match
  const group = useMemo(() => {
    if (!grouped || typeof grouped !== "object") return null;
    if (grouped[commonName]) return grouped[commonName];
    const k = Object.keys(grouped).find(
      (key) => key.trim().toLowerCase() === commonName.toLowerCase()
    );
    return k ? grouped[k] : null;
  }, [grouped, commonName]);

  const taxaMap = group?.Entries || {};
  const taxaList = useMemo(
    () =>
      Object.keys(taxaMap)
        .map((name) => ({ name, count: (taxaMap[name] || []).length }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    [taxaMap]
  );

  const allEntries = useMemo(
    () =>
      flattenEntriesFromTaxaMap(taxaMap).sort((a, b) => {
        const aR = (a["Sampling Region"] || "").toLowerCase();
        const bR = (b["Sampling Region"] || "").toLowerCase();
        return aR.localeCompare(bR);
      }),
    [taxaMap]
  );

  const aboutData = group?.data && typeof group.data === "object" ? group.data : null;

  // Genus label priority: Scientific taxa array -> Scientific Name in aboutData
  const genusLabel = useMemo(() => {
    const fromArray = getGenusLabelFromTaxaArray(group?.["Scientific taxa"]);
    if (fromArray) return fromArray;
    const fromData = getGenusLabelFromScientificName(aboutData?.["Scientific Name"]);
    return fromData || null;
  }, [group, aboutData]);

  // demo images (replace with actual images if available)
  const imageDetails = [
    { path: "/data/RKN Juvenile Under Microscope.jpg", name: "RKN Juvenile Under Microscope.jpg" },
    { path: "/data/Root Galls on Tomato Caused by RKN.jpg", name: "Root Galls on Tomato Caused by RKN.jpg" },
    { path: "/data/RKN Juvenile Under Microscope.jpg", name: "RKN Juvenile Under Microscope.jpg" },
    { path: "/data/Root Galls on Tomato Caused by RKN.jpg", name: "Root Galls on Tomato Caused by RKN.jpg" },
  ];

  /** --- renderers (STRICT single-column) --- */

  // Symptoms can be:
  // 1) object like { Roots: "...", Aboveground: "..." }
  // 2) array of strings
  // 3) single string
  const renderSymptoms = (val) => {
    const isObj = val && typeof val === "object" && !Array.isArray(val);
    if (isObj) {
      const preferred = ["Roots", "Belowground", "Aboveground", "Leaves", "Stems", "Fruits", "General"];
      const keys = Object.keys(val || {});
      const order = [...preferred.filter((k) => keys.includes(k)), ...keys.filter((k) => !preferred.includes(k))];

      return (
        <section className="rounded-2xl border border-sky-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl md:text-2xl font-semibold text-slate-800">Symptoms</h2>
          <div className="mt-4 space-y-4">
            {order.map((k) => {
              const v = val[k];
              const bullets = Array.isArray(v) ? v : splitToBullets(v);
              return (
                <div key={k}>
                  <div className="text-sm font-semibold uppercase tracking-wide text-sky-700/90">{k}</div>
                  {bullets.length > 1 ? (
                    <ul className="mt-1 list-disc pl-6 text-slate-800 space-y-1">
                      {bullets.map((b, i) => <li key={i}>{b}</li>)}
                    </ul>
                  ) : (
                    <p className="mt-1 text-slate-800">{String(v)}</p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      );
    }

    const items = Array.isArray(val) ? val : toArray(val);
    return (
      <section className="rounded-2xl border border-sky-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl md:text-2xl font-semibold text-slate-800">Symptoms</h2>
        {items?.length ? (
          <ul className="mt-3 list-disc pl-6 text-slate-800 space-y-1">
            {items.map((it, i) => <li key={i}>{it}</li>)}
          </ul>
        ) : (
          <p className="mt-3 text-slate-600">No symptoms listed.</p>
        )}
      </section>
    );
  };

  const renderManagement = (val) => {
    const items = Array.isArray(val) ? val : toArray(val);
    return (
      <section className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl md:text-2xl font-semibold text-slate-800">Management Options</h2>
        {items?.length ? (
          <ul className="mt-3 list-disc pl-6 text-slate-800 space-y-1">
            {items.map((it, i) => <li key={i}>{it}</li>)}
          </ul>
        ) : (
          <p className="mt-3 text-slate-600">No management options listed.</p>
        )}
      </section>
    );
  };

  // Show references as clean modern text (no links), in its own section
  const renderFurtherInformation = (val) => {
    const items = Array.isArray(val) ? val : toArray(val);
    return (
      <section className="rounded-2xl border border-violet-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl md:text-2xl font-semibold text-slate-800">Further Information</h2>
        {items?.length ? (
          <ol className="mt-3 list-decimal pl-6 space-y-3">
            {items.map((it, i) => (
              <li key={i} className="text-slate-800 leading-relaxed">
                {/* If item is object, try a readable fallback; else show string */}
                {typeof it === "object" ? JSON.stringify(it) : String(it)}
              </li>
            ))}
          </ol>
        ) : (
          <p className="mt-3 text-slate-600">No references provided.</p>
        )}
      </section>
    );
  };

  return (
    <div className="min-h-screen w-screen bg-white">
      <main className="max-w-[1200px] mx-auto w-full px-6 md:px-8 py-8 space-y-8">
        {/* Header / Hero */}
        <section className="rounded-3xl bg-white/90 backdrop-blur-sm shadow-md ring-1 ring-slate-200 p-7 md:p-9">
          {loading ? (
            <div className="animate-pulse">
              <div className="h-5 w-1/3 bg-slate-100 rounded mb-3" />
              <div className="h-9 w-2/3 bg-slate-100 rounded" />
            </div>
          ) : err ? (
            <div className="text-rose-700">
              Failed to load data: <span className="font-mono">{err}</span>
            </div>
          ) : group ? (
            <>
              {/* STRICT single-column labels */}
              {/* <div className="text-xs uppercase tracking-wider text-slate-500">Common name</div> */}
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
                {aboutData?.Title || group["Common name"] || commonName}
              </h1>

              {/* {aboutData?.["Scientific Name"] && (
                <div className="mt-4">
                  <div className="text-xs uppercase tracking-wider text-slate-500">
                    Scientific name
                  </div>
                  <div className="text-lg md:text-xl text-slate-800 italic">
                    {aboutData["Scientific Name"]}
                  </div>
                </div>
              )} */}

              {/* Genus label */}
              {/* {genusLabel && (
                <div className="mt-3">
                  <div className="text-xs uppercase tracking-wider text-slate-500">Likely genus</div>
                  <div className="text-slate-800 italic">{genusLabel}</div>
                </div>
              )} */}
            </>
          ) : (
            <div className="text-slate-800">
              No data found for <strong>{commonName}</strong>.
            </div>
          )}
        </section>

        {/* Overview section (single column cards) */}
        {aboutData && (
          <section className="space-y-4">
            {/* <h2 className="text-2xl font-semibold text-slate-900">Overview</h2> */}
            <div className="space-y-4">
              {OVERVIEW_ORDER.filter((k) => aboutData[k]).map((k) => (
                <div key={k} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                  <div className="text-sm uppercase tracking-wide text-slate-500">{k}</div>
                  <div className="mt-1 whitespace-pre-line text-slate-800">
                    {String(aboutData[k])}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Symptoms (object/array aware) */}
        {aboutData?.Symptoms && renderSymptoms(aboutData.Symptoms)}

        {/* Management Options */}
        {(aboutData?.["Management Options"] || aboutData?.Management) &&
          renderManagement(aboutData["Management Options"] ?? aboutData.Management)
        }

        {/* Further Information (separate section, text only) */}
        {aboutData?.["Further Information"] && renderFurtherInformation(aboutData["Further Information"])}

        {/* Images */}
        <section className="rounded-3xl bg-white p-6 md:p-8 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-2xl font-semibold text-slate-900">Images</h2>
          <p className="text-slate-600 mb-4">Reference and diagnostic images.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {imageDetails.map(({ path, name }, i) => (
              <figure
                key={`${name}-${i}`}
                className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50"
              >
                <div className="aspect-video">
                  <img
                    src={encodeURI(path)}
                    alt={name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.03]"
                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                  />
                </div>
                <figcaption className="px-3 py-2 text-xs text-slate-700">{name}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* Related taxa */}
        <section className="rounded-3xl bg-white p-6 md:p-8 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h2 className="text-2xl font-semibold text-slate-900">Related taxa</h2>
          </div>

          {loading ? (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 animate-pulse">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-8 bg-slate-100 rounded-full" />
              ))}
            </div>
          ) : (taxaList?.length ?? 0) === 0 ? (
            <div className="text-slate-600 text-sm mt-2 italic">
              No taxa recorded yet for this common name.
            </div>
          ) : (
            <div className="mt-3 flex flex-wrap gap-2">
              {taxaList.map((t) => (
                <span
                  key={t.name}
                  className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-800 text-sm border border-slate-200"
                  title={`${t.name} (${t.count})`}
                >
                  <span className="font-medium">{t.name}</span>
                  <span className="ml-2 text-slate-600">({t.count})</span>
                </span>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Optional modal (kept but not wired above) */}
      {/* <MapPreviewModal
        isOpen={mapModalOpen}
        onClose={() => setMapModalOpen(false)}
        entry={selectedEntry}
      /> */}
    </div>
  );
}
