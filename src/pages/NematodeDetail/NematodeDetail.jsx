// NematodeDetail.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";
import FadeIn from "../../components/FadeIn/FadeIn";
import { PDFDownloadLink } from "@react-pdf/renderer";
import DetailPDF from "../../components/DetailPDF/DetailPDF";
import { getImagesForNematode } from "../../lib/getNematodeImages";
import ImageGallery from "../../components/ImageGallery/ImageGallery";

// import MapPreviewModal from "../../components/MapPreviewModal/MapPreviewModal"; // optional

/** --- helpers --- */
const getGenusLabelFromTaxaArray = (scientificTaxa) => {
  if (!Array.isArray(scientificTaxa) || scientificTaxa.length === 0)
    return null;
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
  "Host Range",
  "Life Cycle",
  "Why They Matter",
  "Symptoms",
  "Management Options",
  "Further Information",
];

// robust array parser
const toArray = (val) => {
  if (Array.isArray(val)) return val.filter(Boolean).map(String);
  if (typeof val === "string") {
    const parts = val
      .split(/\n|;|,/)
      .map((s) => s.trim())
      .filter(Boolean);
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
  datasetUrl = "https://nematodes.blob.core.windows.net/nematodes-data/combined_nematodes_grouped_by_taxa.json?sp=r&st=2025-09-26T04:33:50Z&se=2025-10-11T12:48:50Z&sv=2024-11-04&sr=b&sig=GjO1cbb63mLtK5fYFoUVD7ufEQZu99n8vt9nZBDuz2Y%3D",
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
    return () => {
      cancelled = true;
    };
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

  const aboutData =
    group?.data && typeof group.data === "object" ? group.data : null;
  
  // Genus label priority: Scientific taxa array -> Scientific Name in aboutData
  const genusLabel = useMemo(() => {
    const fromArray = getGenusLabelFromTaxaArray(group?.["Scientific taxa"]);
    if (fromArray) return fromArray;
    const fromData = getGenusLabelFromScientificName(
      aboutData?.["Scientific Name"]
    );
    return fromData || null;
  }, [group, aboutData]);

  const [open, setOpen] = useState({
    "Common Name": true,
    "Scientific Name": true,
    "Host Range": true,
    "Life Cycle": true,
    "Why They Matter": true,
    Symptoms: true,
    "Management Options": true,
    "Further Information": true,
  }); // track which sections are open

  const toggle = (key) => {
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const formatScientificName = (text) => {
    if (!text) return "";

    // Split words to check each part
    return text.split(" ").map((word, idx) => {
      const lower = word.toLowerCase();
      if (lower === "sp." || lower === "spp.") {
        return (
          <span key={idx} className="not-italic">
            {word}{" "}
          </span>
        );
      }
      // Italicise genus/species names
      return (
        <span key={idx} className="italic">
          {word}{" "}
        </span>
      );
    });
  };
  const splitIntoSentences = (text) => {
    if (!text) return [];
    return text
      .split(/\. (?=[A-Z])/)
      .map((s, idx, arr) => (idx < arr.length - 1 ? s.trim() + "." : s.trim()));
  };
  const imageDetails = getImagesForNematode(commonName);
  return (
    <FadeIn>
      <div className="min-h-screen w-screen bg-white">
        <main className="max-w-[1200px] mx-auto w-full px-6 md:px-8 py-8 space-y-8">
          {/* Header / Hero */}
          {(loading || err || !group) && (
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
              ) : (
                <div className="text-slate-800">
                  No data found for <strong>{commonName}</strong>.
                </div>
              )}
            </section>
          )}

          <div className="flex gap-3 mb-6">
            <PDFDownloadLink
              document={
                <DetailPDF aboutData={aboutData} imageDetails={imageDetails} />
              }
              fileName={`${aboutData?.Title || aboutData?.["Common Name"] || commonName || "nematode-detail"}.pdf`}
            >
              {({ loading }) => (
                <button className="px-3 py-1.5 bg-[#027FB8] text-white rounded hover:bg-blue-700 transition">
                  {loading ? "Preparing PDF..." : "Download PDF"}
                </button>
              )}
            </PDFDownloadLink>

            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 bg-[#027FB8] hover:bg-blue-700 rounded text-white"
            >
              Print
            </button>
          </div>

          {/* Overview section (single column cards) */}
          {aboutData && (
            <section className="space-y-4">
              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <h2 className="text-3xl md:text-4xl font-bold text-[#027fb8] leading-tight">
                  {(() => {
                    const rawCommon =
                      aboutData?.["Common Name"] ||
                      group["Common name"] ||
                      commonName ||
                      "";
                    const hasNematodeWord = /\bnematodes?\b/i.test(rawCommon);
                    if (hasNematodeWord) return <span>{rawCommon}</span>;

                    // Common name is a taxon (Genus species OR Genus sp./spp.)
                    const parts = rawCommon.trim().split(/\s+/);
                    if (parts.length === 0) return null;

                    // Genus + sp./spp. → italicize only Genus
                    if (/\bsp\.?\b|\bspp\.?\b/i.test(parts[1] || "")) {
                      return (
                        <>
                          <span className="italic">{parts[0]}</span>
                          {parts[1] ? ` ${parts[1]}` : ""}
                          {parts.slice(2).length
                            ? ` ${parts.slice(2).join(" ")}`
                            : ""}
                        </>
                      );
                    }

                    // Genus + species → italicize both
                    if (parts.length >= 2) {
                      return (
                        <>
                          <span className="italic">{parts[0]}</span>{" "}
                          <span className="italic">{parts[1]}</span>
                          {parts.slice(2).length
                            ? ` ${parts.slice(2).join(" ")}`
                            : ""}
                        </>
                      );
                    }

                    // Single word (Genus) → italicize it
                    return <span className="italic">{parts[0]}</span>;
                  })()}

                  {aboutData?.["Scientific Name"] && (
                    <>
                      {" ("}
                      {
                        // Scientific name (can be multiple with & or ,)
                        aboutData["Scientific Name"]
                          .split(/(&|,)/)
                          .map((chunk, i, arr) => {
                            const t = chunk.trim();
                            if (t === "&" || t === ",") {
                              return (
                                <span key={i} className="mx-1">
                                  {t}
                                </span>
                              );
                            }
                            if (!t) return null;

                            const w = t.split(/\s+/);

                            // Genus + sp./spp. → italicize only Genus
                            if (/\bsp\.?\b|\bspp\.?\b/i.test(w[1] || "")) {
                              return (
                                <span key={i}>
                                  <span className="italic">{w[0]}</span>
                                  {w[1] ? ` ${w[1]}` : ""}
                                  {w.slice(2).length
                                    ? ` ${w.slice(2).join(" ")}`
                                    : ""}
                                </span>
                              );
                            }

                            // Genus + species → italicize both
                            if (w.length >= 2) {
                              return (
                                <span key={i}>
                                  <span className="italic">{w[0]}</span>{" "}
                                  <span className="italic">{w[1]}</span>
                                  {w.slice(2).length
                                    ? ` ${w.slice(2).join(" ")}`
                                    : ""}
                                </span>
                              );
                            }

                            // Single word (Genus) → italicize it
                            return (
                              <span key={i}>
                                <span className="italic">{w[0]}</span>
                              </span>
                            );
                          })
                      }
                      {")"}
                    </>
                  )}
                </h2>

                {OVERVIEW_ORDER.filter((k) => aboutData[k]).map((k) => (
                  <div
                    key={k}
                    className="border-b border-slate-200 last:border-0 py-3"
                  >
                    {/* Clickable title */}
                    <button
                      onClick={() => toggle(k)}
                      className="flex items-center justify-between w-full text-left"
                    >
                      <span className="text-sm uppercase tracking-wide text-[#038764] font-semibold">
                        {k}
                      </span>
                      {open[k] ? (
                        <ChevronDown className="w-4 h-4 text-slate-500" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-500" />
                      )}
                    </button>

                    {/* Collapsible content */}
                    {open[k] && (
                      <div className="mt-2 text-[#292929] text-sm">
                        {k === "Scientific Name" ? (
                          formatScientificName(String(aboutData[k]))
                        ) : k === "Why They Matter" ? (
                          <ul className="list-disc pl-5 space-y-1">
                            {splitIntoSentences(String(aboutData[k])).map(
                              (line, i) => (
                                <li key={i}>{line}</li>
                              )
                            )}
                          </ul>
                        ) : k === "Symptoms" ? (
                          (() => {
                            const val = aboutData[k];
                            const isObj =
                              val &&
                              typeof val === "object" &&
                              !Array.isArray(val);
                            if (isObj) {
                              const preferred = [
                                "Roots",
                                "Belowground",
                                "Aboveground",
                                "Leaves",
                                "Stems",
                                "Fruits",
                              ];
                              const keys = Object.keys(val || {});
                              const order = [
                                ...preferred.filter((x) => keys.includes(x)),
                                ...keys.filter((x) => !preferred.includes(x)),
                              ];
                              return (
                                <div className="space-y-3">
                                  {order.map((part) => {
                                    const v = val[part];
                                    const bullets = Array.isArray(v)
                                      ? v
                                      : splitToBullets(v);
                                    return (
                                      <div key={part}>
                                        <div className="text-xs font-semibold uppercase tracking-wide text-sky-700/90">
                                          {part}
                                        </div>
                                        {bullets.length > 1 ? (
                                          <ul className="mt-1 list-disc pl-6 space-y-1">
                                            {bullets.map((b, i) => (
                                              <li key={i}>{b}</li>
                                            ))}
                                          </ul>
                                        ) : (
                                          <p className="mt-1">{String(v)}</p>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              );
                            }
                            const items = Array.isArray(val)
                              ? val
                              : toArray(val);
                            return (
                              <ul className="list-disc pl-6 space-y-1">
                                {items.map((it, i) => (
                                  <li key={i}>{it}</li>
                                ))}
                              </ul>
                            );
                          })()
                        ) : k === "Management Options" ? (
                          <ul className="list-disc pl-5 space-y-1">
                            {(Array.isArray(aboutData[k])
                              ? aboutData[k]
                              : toArray(aboutData[k])
                            ).map((it, i) => (
                              <li key={i}>{it}</li>
                            ))}
                          </ul>
                        ) : k === "Further Information" ? (
                          <ol className="list-decimal pl-5 space-y-2">
                            {(Array.isArray(aboutData[k])
                              ? aboutData[k]
                              : [String(aboutData[k])]
                            ).map((it, i) => (
                              <li key={i} className="leading-relaxed">
                                {String(it)}
                              </li>
                            ))}
                          </ol>
                        ) : (
                          splitIntoSentences(String(aboutData[k])).map(
                            (line, i) => (
                              <p key={i} className="mb-1">
                                {line}
                              </p>
                            )
                          )
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Images */}
          <ImageGallery imageDetails={imageDetails} />
          {/* Related taxa */}
          <section className="rounded-3xl bg-white p-6 md:p-8 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <h2 className="text-2xl font-semibold text-slate-900">
                Related taxa
              </h2>
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
    </FadeIn>
  );
}
