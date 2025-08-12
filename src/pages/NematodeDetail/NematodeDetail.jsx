// NematodeDetail.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import MapPreviewModal from "../../components/MapPreviewModal/MapPreviewModal"; // adjust path


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

/** Preferred display order if "data" exists */
const ABOUT_FIELD_ORDER = [
  "Common Name",
  "Scientific Name",
  "Distribution",
  "Crops at Risk",
  "Symptoms",
  "Life Cycle",
  "Why They Matter",
  "Management"
];

export default function NematodeDetail({
  datasetUrl = "/data/combined_nematodes_grouped_by_taxa.json",
}) {
  const { commonName: paramCommonName } = useParams();
  const commonName = decodeURIComponent(paramCommonName || "").trim();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);

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

  // Entries map (historical/new combined format)
  const taxaMap = group?.Entries || {}; // { taxonName: [entries] }

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

  // About section data (if provided under group.data)
  const aboutData = group?.data && typeof group.data === "object" ? group.data : null;

  // Genus label priority: Scientific taxa array -> Scientific Name in aboutData
  const genusLabel = useMemo(() => {
    const fromArray = getGenusLabelFromTaxaArray(group?.["Scientific taxa"]);
    if (fromArray) return fromArray;
    const fromData = getGenusLabelFromScientificName(aboutData?.["Scientific Name"]);
    return fromData || null;
  }, [group, aboutData]);
// Put this near the top of NematodeDetail.jsx (inside the component or module)
  const imageDetails = [
    { path: '/data/RKN Juvenile Under Microscope.jpg', name: 'RKN Juvenile Under Microscope.jpg' },
    { path: '/data/Root Galls on Tomato Caused by RKN.jpg', name: 'Root Galls on Tomato Caused by RKN.jpg' },
    { path: '/data/RKN Juvenile Under Microscope.jpg', name: 'RKN Juvenile Under Microscope.jpg' },
    { path: '/data/Root Galls on Tomato Caused by RKN.jpg', name: 'Root Galls on Tomato Caused by RKN.jpg' },
  ];

  return (
    <div className="min-h-screen w-screen bg-blue-50">
      <main className="max-w-[1200px] mx-auto w-full px-4 py-6 space-y-6">
        {/* Hero */}
        <section className="bg-white rounded-2xl shadow p-6 md:p-8 border-l-4 border-blue-600">
          {loading ? (
            <div className="animate-pulse">
              <div className="h-6 w-1/3 bg-blue-100 rounded mb-2" />
              <div className="h-10 w-2/3 bg-blue-100 rounded" />
            </div>
          ) : err ? (
            <div className="text-rose-700">
              Failed to load data: <span className="font-mono">{err}</span>
            </div>
          ) : group ? (
            <>
              <div className="text-sm uppercase tracking-wide text-blue-700/80">
                Common name
              </div>
              <h1 className="text-2xl md:text-3xl font-semibold text-blue-900">
                {group["Common name"] || commonName}
              </h1>
              {genusLabel && (
                <div className="mt-2 text-blue-800/80 italic">
                  Likely genus: {genusLabel}
                </div>
              )}
              {/* About text */}
              <div className="mt-4 text-blue-900/90 leading-relaxed">
                {aboutData ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {ABOUT_FIELD_ORDER.filter((k) => aboutData[k])
                      .concat(
                        Object.keys(aboutData).filter(
                          (k) => !ABOUT_FIELD_ORDER.includes(k) && aboutData[k]
                        )
                      )
                      .map((k) => (
                        <div key={k} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <div className="text-xs uppercase tracking-wide text-blue-700/80">
                            {k}
                          </div>
                          <div className="mt-1 text-sm whitespace-pre-line">
                            {String(aboutData[k])}
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p>
                    This section provides an overview of{" "}
                    <strong>{group["Common name"] || commonName}</strong>. When structured
                    details are added to the dataset, they’ll appear here.
                  </p>
                )}
              </div>
            </>
          ) : (
            <div className="text-blue-900/90">
              No data found for <strong>{commonName}</strong>.
            </div>
          )}
        </section>

        {/* Images */}
        <section className="bg-white rounded-2xl shadow p-6 md:p-8 border border-blue-100">
          <h2 className="text-xl md:text-2xl font-semibold text-blue-800">Images</h2>
          <p className="text-blue-900/80 mb-4">
            {/* Add reference photos or diagnostic images here (galls, lesions, adults/juveniles, etc.). */}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {imageDetails.map(({ path, name }, i) => {
              const title = name; // or strip extension: name.replace(/\.[^.]+$/, '')
              return (
                <figure
                  key={`${name}-${i}`}
                  className="rounded-xl overflow-hidden border border-blue-200 bg-blue-50"
                >
                  <div className="aspect-video">
                    <img
                      src={encodeURI(path)}            // handles spaces in file names
                      alt={title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.03]"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  </div>
                  <figcaption className="px-2.5 py-2 text-xs text-blue-900/90">
                    {title}
                  </figcaption>
                </figure>
              );
            })}
          </div>

        </section>

        {/* Taxa summary chips */}
        <section className="bg-white rounded-2xl shadow p-6 md:p-8 border border-blue-100">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h2 className="text-xl md:text-2xl font-semibold text-blue-800">
              Related taxa
            </h2>
            {taxaList.length > 0 && (
              <div className="text-sm text-blue-800/80">
                {taxaList.reduce((sum, t) => sum + t.count, 0)} total records
              </div>
            )}
          </div>

          {loading ? (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 animate-pulse">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-8 bg-blue-100 rounded-full" />
              ))}
            </div>
          ) : taxaList.length === 0 ? (
            <div className="text-blue-900/70 text-sm mt-2 italic">
              No taxa recorded yet for this common name.
            </div>
          ) : (
            <div className="mt-3 flex flex-wrap gap-2">
              {taxaList.map((t) => (
                <button
                  key={t.name}
                  type="button"
                  onClick={() => {
                    // hook up later (e.g., filter entries or open map)
                    if (coords) {
                      setSelectedEntry({
                        lat: Number(e["Latitude (°S)"]),
                        lng: Number(e["Longitude (°E)"]),
                        title: `${region}, ${state}`,
                        subtitle: group?.["Common name"] || commonName,
                        details: {
                          Taxon: e.taxon || (e["Nematode Taxa"] || "").trim() || "N/A",
                          Plant: plant,
                          Site: site || "N/A",
                          Date: date ? String(date).slice(0, 10) : "N/A",
                          Reference: ref || "N/A",
                        },
                      });
                      setMapModalOpen(true);
                    }
                  }}
                  className="px-3 py-1.5 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-900 text-sm border border-blue-200 transition"
                  title={`${t.name} (${t.count})`}
                >
                  <span className="font-medium">{t.name}</span>
                  <span className="ml-2 text-blue-700/70">({t.count})</span>
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Entries list */}
        <section className="bg-white rounded-2xl shadow p-6 md:p-8 border border-blue-100">
          <h2 className="text-xl md:text-2xl font-semibold text-blue-800">
            All related entries
          </h2>
          <p className="text-blue-900/80 mb-4">
            Each card represents a recorded occurrence for this nematode group. Click a card to open
            details.
          </p>

          {loading ? (
            <div className="space-y-3 animate-pulse">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-20 bg-blue-100 rounded-xl" />
              ))}
            </div>
          ) : allEntries.length === 0 ? (
            <div className="text-blue-900/70 text-sm italic">
              No entries available for this nematode yet.
            </div>
          ) : (
            <div className="space-y-3">
              {allEntries.map((e, idx) => {
                const region = e["Sampling Region"] || "Unknown region";
                const state = e["Sampling State"] || "Unknown state";
                const plant = (e["Plant Associated"] || "").replace(/\*/g, "").trim() || "N/A";
                const site = e["Site Description"];
                const ref = e["Reference"];
                const date = e["Sampling Date"];
                const coords =
                  e["Latitude (°S)"] != null && e["Longitude (°E)"] != null
                    ? `${e["Latitude (°S)"]}, ${e["Longitude (°E)"]}`
                    : null;

                return (
                  <button
                    key={`${region}-${state}-${idx}`}
                    type="button"
                    onClick={() => {
                      // plug your action here (e.g., open modal map at coords)
                      if (coords) {
                        setSelectedEntry({
                          lat: Number(e["Latitude (°S)"]),
                          lng: Number(e["Longitude (°E)"]),
                          title: `${region}, ${state}`,
                          subtitle: group?.["Common name"] || commonName,
                          details: {
                            Taxon: e.taxon || (e["Nematode Taxa"] || "").trim() || "N/A",
                            Plant: plant,
                            Site: site || "N/A",
                            Date: date ? String(date).slice(0, 10) : "N/A",
                            Reference: ref || "N/A",
                          },
                        });
                        setMapModalOpen(true);
                      }
                    }}
                    className="w-full text-left bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl p-4 transition shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm uppercase tracking-wide text-blue-700/80">
                          {e.taxon || "Taxon"}
                        </div>
                        <div className="mt-0.5 text-base font-semibold text-blue-900">
                          {region}, {state}
                        </div>
                        <div className="mt-1 text-sm text-blue-900/80">
                          <span className="font-medium">Plant:</span> {plant}
                          {site ? (
                            <>
                              {" "}
                              <span className="text-blue-700/40">•</span>{" "}
                              <span className="font-medium">Site:</span> {site}
                            </>
                          ) : null}
                          {coords ? (
                            <>
                              {" "}
                              <span className="text-blue-700/40">•</span>{" "}
                              <span className="font-medium">Coords:</span> {coords}
                            </>
                          ) : null}
                        </div>
                      </div>
                      <div className="text-right text-xs text-blue-900/70">
                        {date ? String(date).slice(0, 10) : null}
                        {ref ? <div className="mt-1">{ref}</div> : null}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <footer className="py-6 text-center text-xs text-blue-900/70">
        © {new Date().getFullYear()} Northern Australia Nematode Portal
      </footer>
      <MapPreviewModal
        isOpen={mapModalOpen}
        onClose={() => setMapModalOpen(false)}
        entry={selectedEntry}
      />
    </div>
  );
}
