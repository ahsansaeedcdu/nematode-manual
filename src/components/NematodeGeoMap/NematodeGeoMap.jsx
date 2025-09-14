import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  useMap,
  Marker,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import FadeIn from "../FadeIn/FadeIn";

// import './NematodeGeoMap.css';
import L from "leaflet";
// import "leaflet-simple-map-screenshoter";
import * as htmlToImage from "html-to-image";
/* -------------------- Leaflet marker fix -------------------- */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

/* --------------------------- helpers --------------------------- */

const getNematodeGroupColor = (groupName) => {
  const colors = [
    "#FF5733",
    "#33FF57",
    "#3357FF",
    "#FF33A1",
    "#A1FF33",
    "#33A1FF",
    "#FF8C33",
    "#8CFF33",
    "#33FF8C",
    "#FF33E0",
    "#E0FF33",
    "#33E0FF",
    "#FF3333",
    "#33FF33",
    "#3333FF",
    "#FFD700",
    "#ADFF2F",
    "#00FFFF",
    "#FF00FF",
    "#8A2BE2",
  ];
  let hash = 0;
  for (let i = 0; i < (groupName || "").length; i++) {
    hash = groupName.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

// parse "4-47" -> 47; number -> number
const parseSampleSizeMax = (v) => {
  if (v == null) return null;
  if (typeof v === "number") return v;
  const s = String(v).trim();
  const m = s.match(/^(\d+)\s*-\s*(\d+)$/);
  if (m) return Math.max(Number(m[1]), Number(m[2]));
  const n = Number(s.replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : null;
};

// jitter overlapping marker coordinates so they don’t stack
const jitterMarkers = (points, baseDegrees = 0.00035) => {
  const groups = new Map();
  points.forEach((p, i) => {
    const k = `${Number(p.lat).toFixed(6)},${Number(p.lng).toFixed(6)}`;
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(i);
  });

  const out = points.map((p) => ({ ...p }));
  const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
  groups.forEach((idxs) => {
    if (idxs.length <= 1) return;
    const rStep = baseDegrees;
    idxs.forEach((idx, n) => {
      const r = rStep * Math.ceil(n / 6);
      const theta = GOLDEN_ANGLE * n;
      const dLat = r * Math.sin(theta);
      const latRad = (points[idx].lat * Math.PI) / 180;
      const dLng = r * Math.cos(theta) * Math.max(0.25, Math.cos(latRad));
      out[idx].lat += dLat;
      out[idx].lng += dLng;
    });
  });
  return out;
};

// flatten your combined JSON (grouped by Common name) into marker records
const flattenCombinedData = (combined) => {
  const out = [];
  if (!combined || typeof combined !== "object") return out;

  Object.values(combined).forEach((group) => {
    const commonName = group["Common name"];
    const scientific = group["Scientific taxa"] || [];
    const entries = group["Entries"] || [];
    entries.forEach((e) => {
      const lat = e["Latitude (°S)"];
      const lng = e["Longitude (°E)"];
      if (lat == null || lng == null) return;
      out.push({
        lat,
        lng,
        originalGroupKey: commonName,
        nematode: e["Nematode Taxa"] || scientific.join(", "),
        common_nematode_name: commonName,
        "Sampling Region": e["Sampling Region"] || "",
        "Sampling State": e["Sampling State"] || "",
        "Site Description": e["Site Description"] || "",
        "Plant Associated": e["Plant Associated"] || "",
        sample_size: parseSampleSizeMax(e["Sample Size"]),
        reference: e["Reference"] ?? null,
        material: e["Material"] ?? null,
        collected_by: e["Collected by"] ?? null,
        date: e["Sampling Date"] ?? null,
      });
    });
  });

  // jitter
  const pts = out.map((r) => ({ lat: r.lat, lng: r.lng }));
  const jittered = jitterMarkers(pts);
  jittered.forEach((p, i) => {
    out[i].lat = p.lat;
    out[i].lng = p.lng;
  });
  return out;
};
function formatNematodeName(name) {
  if (!name) return "N/A";

  return name.split(" ").map((part, i, arr) => {
    // If it's "sp." or "spp.", leave normal
    if (part === "sp." || part === "spp.") {
      return <span key={i}> {part}</span>;
    }

    // Italicise genus (first word) and species (second word if present)
    if (i === 0 || (i === 1 && arr[0][0] === arr[0][0].toUpperCase())) {
      return <em key={i}> {part}</em>;
    }

    // Otherwise leave normal
    return <span key={i}> {part}</span>;
  });
}
/* ----------------- GeoJSONLayerWithInteractions (used by NEW map for markers only) ----------------- */
const GeoJSONLayerWithInteractions = ({
  geoData,
  detailedNematodeRecords,
  getFeatureBaseStyle,
  selectedLGA,
  setSelectedLGA,
  lgaLayersRef,
  selectedLGAStyle,
  selectedNematodeGroups = [],
  showMarkers = false,
}) => {
  const map = useMap();

  const onEachFeature = (feature, layer) => {
    const lgaName = feature.properties?.LGA_NAME24?.trim();
    if (!lgaName) return;

    if (getFeatureBaseStyle && lgaLayersRef) {
      lgaLayersRef.current[lgaName] = layer;
      layer.setStyle(getFeatureBaseStyle(feature));
    }

    layer.on({
      mouseover: (e) => {
        if (lgaName === selectedLGA) return;
        e.target.setStyle({ weight: 2, color: "#000", fillOpacity: 0.8 });
      },
      mouseout: (e) => {
        if (lgaName === selectedLGA) return;
        if (getFeatureBaseStyle)
          e.target.setStyle(getFeatureBaseStyle(feature));
      },
      click: () => {
        if (setSelectedLGA) setSelectedLGA(lgaName);
        const bounds = layer.getBounds();
        if (map) map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
      },
    });
  };

  const markersToDisplay = useMemo(() => {
    if (!showMarkers || !Array.isArray(detailedNematodeRecords)) return [];
    return detailedNematodeRecords.filter(
      (record) =>
        record.lat != null &&
        record.lng != null &&
        !isNaN(record.lat) &&
        !isNaN(record.lng) &&
        record.originalGroupKey &&
        selectedNematodeGroups.includes(record.originalGroupKey)
    );
  }, [showMarkers, detailedNematodeRecords, selectedNematodeGroups]);

  return (
    <>
      {geoData && (
        <GeoJSON
          key={JSON.stringify(selectedNematodeGroups || [])}
          data={geoData}
          onEachFeature={onEachFeature}
        />
      )}

      {showMarkers &&
        markersToDisplay.map((record, index) => {
          const markerHtmlStyles = `
          background-color: ${getNematodeGroupColor(record.originalGroupKey)};
          width: 1.5rem;
          height: 1.5rem;
          display: block;
          left: -0.75rem;
          top: -0.75rem;
          position: relative;
          border-radius: 1.5rem 1.5rem 0;
          transform: rotate(45deg);
          border: 1px solid #FFFFFF;
          box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.25);
        `;
          const customIcon = L.divIcon({
            className: "custom-marker-icon",
            html: `<span style="${markerHtmlStyles}" />`,
            iconSize: [24, 24],
            iconAnchor: [12, 24],
            popupAnchor: [0, -20],
          });

          const rawPlant = record["Plant Associated"] || "";
          const plantClean =
            String(rawPlant).replace(/\*/g, "").trim() || "N/A";

          return (
            <Marker
              key={`marker-${record["Sampling Region"] || "r"}-${record["Sampling State"] || "s"}-${index}`}
              position={[record.lat, record.lng]}
              icon={customIcon}
            >
              <Popup>
                <div className="font-semibold text-slate-800">
                  {/* <p className="mb-1"><strong>Common name:</strong> {record.common_nematode_name}</p> */}
                  <p className="mb-1">
                    {" "}
                    <strong>Nematode Taxa:</strong>{" "}
                    {record.nematode
                      ? formatNematodeName(record.nematode)
                      : "N/A"}{" "}
                  </p>
                  <p className="mb-1">
                    <strong>Associated Plant(s):</strong> {plantClean}
                  </p>
                  <p className="mb-1">
                    <strong>Region:</strong>{" "}
                    {[record["Sampling Region"], record["Sampling State"]]
                      .filter((v) => v && String(v).trim())
                      .join(", ") || "N/A"}
                  </p>
                  {/* <p className="mb-1"><strong>State:</strong> {record['Sampling State'] || 'N/A'}</p> */}
                  {record.sample_size != null && (
                    <p className="mb-1">
                      <strong>Highest Recorded Density:</strong>{" "}
                      {Math.round(Number(record.sample_size))} nematodes/200 mL
                      soil
                    </p>
                  )}
                  {/* {record['Site Description'] && <p className="mb-1"><strong>Site:</strong> {record['Site Description']}</p>}
                {record.reference && <p className="mb-1"><strong>Reference:</strong> {record.reference}</p>} */}
                </div>
              </Popup>
            </Marker>
          );
        })}
    </>
  );
};
// function ensureBorderPatchCSS() {
//   if (document.getElementById("tw-border-off-css")) return;
//   const css = `
//     /* Disable Tailwind's global borders ONLY during screenshot */
//     .leaflet-container.tw-borders-off,
//     .leaflet-container.tw-borders-off * ,
//     .leaflet-container.tw-borders-off *::before,
//     .leaflet-container.tw-borders-off *::after {
//       border-style: none !important;
//       border-width: 0 !important;
//       border-color: transparent !important;
//     }
//   `;
//   const style = document.createElement("style");
//   style.id = "tw-border-off-css";
//   style.textContent = css;
//   document.head.appendChild(style);
// }

// const MapScreenshoter= ({ name = "map" }) => {
//   const map = useMap();

//   useEffect(() => {
//     if (!map) return;
//     ensureBorderPatchCSS();

//     // Use an integer DPR to avoid tile seams; 1 or 2 are sensible
//     const dpr = Math.max(1, Math.round(window.devicePixelRatio || 1));

//     // Define a magnification factor
//     const magnificationFactor = 5; // Adjust this value to control the size

//     // Add the plugin control
//     const control = L.simpleMapScreenshoter({
//       position: "topleft",
//       cropImageByInnerWH: true,      // capture EXACT viewport
//       hideElementsWithSelectors: [],  // keep UI as-is
//       preventDownload: false,
//       screenName: () => `${name}-${Date.now()}`,
//       mimeType: "image/png",
//       domtoimageOptions: {
//         width: map.getSize().x * dpr * magnificationFactor,
//         height: map.getSize().y * dpr * magnificationFactor,
//         style: {
//           transform: `scale(${dpr * magnificationFactor})`,
//           transformOrigin: "top left",
//           backgroundColor: "white",
//         },
//         quality: 1,
//       },
//       onPixelDataFail: async ({ plugin, domtoimageOptions }) =>
//         plugin._getPixelDataOfNormalMap(domtoimageOptions),
//     }).addTo(map);

//     // Toggle Tailwind border patch during the screenshot only
//     const onStart = () => map.getContainer().classList.add("tw-borders-off");
//     const onEnd   = () => map.getContainer().classList.remove("tw-borders-off");

//     map.on("simpleMapScreenshoter.takeScreen", onStart);
//     map.on("simpleMapScreenshoter.done", onEnd);
//     map.on("simpleMapScreenshoter.error", onEnd);

//     return () => {
//       map.off("simpleMapScreenshoter.takeScreen", onStart);
//       map.off("simpleMapScreenshoter.done", onEnd);
//       map.off("simpleMapScreenshoter.error", onEnd);
//       control?.remove?.();
//     };
//   }, [map, name]);

//   return null;
// }

/* --------------------------- HistoricalMap (simpler visuals, same data) --------------------------- */
/* --------------------------- HistoricalMap (tooltip + hover) --------------------------- */
const HistoricalMap = () => {
  const [geoData, setGeoData] = useState(null);
  const [nematodeMap, setNematodeMap] = useState({});

  useEffect(() => {
    fetch("/data/LGA_2024_context.json")
      .then((res) => res.json())
      .then(setGeoData);
    fetch("/data/lga_nematode_map.json")
      .then((res) => res.json())
      .then(setNematodeMap);
  }, []);

  // Base style: minimal borders, soft fills
  const styleFn = useCallback(
    (feature) => {
      const lgaName = feature.properties?.LGA_NAME24?.trim();
      const hasData =
        lgaName &&
        Array.isArray(nematodeMap[lgaName]) &&
        nematodeMap[lgaName].length > 0;
      return {
        fillColor: hasData ? "#f87171" : "#e5e7eb", // red-300 vs gray-200
        color: "#ffffff", // thin white boundary
        weight: 0.6,
        opacity: 1,
        fillOpacity: 0.75,
      };
    },
    [nematodeMap]
  );

  const onEachFeature = (feature, layer) => {
    // Apply base style
    layer.setStyle(styleFn(feature));

    const lgaName = feature.properties?.LGA_NAME24?.trim();
    const species = (lgaName && nematodeMap[lgaName]) || [];
    const tooltipContent = `
      <strong>${lgaName || "Unknown LGA"}</strong><br/>
      ${species.length ? species.join(", ") : "Unconfirmed presence of PPN"}
    `;

    // Tooltip
    layer.bindTooltip(tooltipContent, {
      sticky: true,
      opacity: 0.95,
      className: "custom-tooltip",
    });

    // Hover outline + subtle emphasis
    layer.on({
      mouseover: (e) => {
        const base = styleFn(feature);
        e.target.setStyle({
          ...base,
          weight: 2.2,
          color: "#111827", // slate-900-ish for a crisp outline
          fillOpacity: 0.85,
        });
        const el = e.target.getElement?.();
        if (el) el.style.cursor = "pointer";
        if (e.target.bringToFront) e.target.bringToFront();
      },
      mouseout: (e) => {
        e.target.setStyle(styleFn(feature));
      },
    });
  };

  return (
     <div className="relative h-full w-full"> {/* [ADDED] wrapper for overlay positioning */}
      <MapContainer
        center={[-25.2744, 133.7751]}
        zoom={5}
        style={{ height: "100%", width: "100%" }}
        doubleClickZoom={false}
        className="rounded-xl"
      >
        {/* [ADDED] CORS so snapshots work */}
        {/* Enable CORS so snapshots include tiles */}
        <TileLayer
          crossOrigin="anonymous"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />
        {geoData && (
          <GeoJSON data={geoData} style={styleFn} onEachFeature={onEachFeature} />
        )}
      </MapContainer>

      {/* Tiny legend OVER the map (not inside MapContainer) */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg shadow p-3 text-sm text-slate-700">
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-sm inline-block" style={{ backgroundColor: "#f87171" }}></span>



          Nematodes present
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="w-3.5 h-3.5 rounded-sm inline-block" style={{ backgroundColor: "#e5e7eb" }}></span>



          No record
        </div>
      </div>
    </div>
  );
};

/* --------------------------- Main wrapper (UI refreshed) --------------------------- */
const NematodeGeoMap = () => {
  // New Map States
  const [newMapDetailedNematodeRecords, setNewMapDetailedNematodeRecords] =
    useState([]);
  const [newMapAllNematodeGroups, setNewMapAllNematodeGroups] = useState([]);
  const [newMapSelectedNematodeGroups, setNewMapSelectedNematodeGroups] =
    useState([]);
  const [newMapIsLoading, setNewMapIsLoading] = useState(false);
  const [showHistoricalMap, setShowHistoricalMap] = useState(true);

  // search / filter text for the checkbox grid
  const [groupQuery, setGroupQuery] = useState("");
  const mapShotRef = useRef(null); // [ADDED]

    const handleDownloadSnapshot = async () => { // [ADDED]
      const node = mapShotRef.current;
      if (!node) return;
      try {
        // Optional: wait for any images/tiles still decoding
        await Promise.all(
          Array.from(node.querySelectorAll("img")).map((img) =>
            img.decode().catch(() => {})
          )
        );

        const dataUrl = await htmlToImage.toPng(node, {
          pixelRatio: 2,
          cacheBust: true,
          backgroundColor: "#ffffff",
          width: node.clientWidth,
          height: node.clientHeight,
        });
        const a = document.createElement("a");
        const ts = new Date().toISOString().replace(/[:.]/g, "-");
        a.download = `nematodes-map-${ts}.png`;
        a.href = dataUrl;
        a.click();
      } catch (err) {
        console.error("Snapshot failed:", err);
        alert("Snapshot failed. Wait for tiles to finish loading and try again.");
      }
    };
  // load new map data when New Map tab is shown
  useEffect(() => {
    const fetchNewMapData = async () => {
      setNewMapIsLoading(true);
      try {
        const res = await fetch("/data/combined_nematodes_with_coords.json");
        const combined = await res.json();

        const groupNames = Object.values(combined)
          .map((g) => g["Common name"])
          .filter(Boolean);
        const unique = Array.from(new Set(groupNames)).sort();
        setNewMapAllNematodeGroups(unique);

        const flat = flattenCombinedData(combined);
        setNewMapDetailedNematodeRecords(flat);

        // pick first few by default, or none—your call
        setNewMapSelectedNematodeGroups([]);
      } catch (e) {
        console.error("Error loading combined nematode data:", e);
        setNewMapAllNematodeGroups([]);
        setNewMapDetailedNematodeRecords([]);
        setNewMapSelectedNematodeGroups([]);
      } finally {
        setNewMapIsLoading(false);
      }
    };

    if (!showHistoricalMap) {
      fetchNewMapData();
    } else {
      // clear when leaving
      setNewMapDetailedNematodeRecords([]);
      setNewMapAllNematodeGroups([]);
      setNewMapSelectedNematodeGroups([]);
      setNewMapIsLoading(false);
    }
  }, [showHistoricalMap]);

  const handleNewMapCheckboxChange = useCallback((event) => {
    const { value, checked } = event.target;
    setNewMapSelectedNematodeGroups((prev) =>
      checked ? [...prev, value] : prev.filter((g) => g !== value)
    );
  }, []);
  const handleClearNewMapFilters = useCallback(
    () => setNewMapSelectedNematodeGroups([]),
    []
  );
  const handleSelectAll = useCallback(
    () => setNewMapSelectedNematodeGroups(newMapAllNematodeGroups),
    [newMapAllNematodeGroups]
  );

  const filteredGroups = useMemo(() => {
    const q = groupQuery.trim().toLowerCase();
    if (!q) return newMapAllNematodeGroups;
    return newMapAllNematodeGroups.filter((name) =>
      name.toLowerCase().includes(q)
    );
  }, [groupQuery, newMapAllNematodeGroups]);

  return (
    <FadeIn>
      <div className="min-h-screen w-screen bg-slate-50 text-slate-800 flex flex-col">
        {/* Header */}
        <header className="w-full border-b bg-white/90 backdrop-blur-sm sticky top-0 z-10">
          <div className="max-w-[1400px] mx-auto px-4 py-3 flex items-center justify-between">
            <h2 className="text-xl md:text-2xl font-semibold tracking-tight !text-[#027fb8]">
              Distribution of Plant-parasitic Nematodes in Norhtern Australia
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowHistoricalMap(true)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${showHistoricalMap ? "bg-blue-400 text-black shadow" : "bg-slate-100 hover:bg-slate-200"}`}
              >
                Overview
              </button>
              <button
                onClick={() => setShowHistoricalMap(false)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${!showHistoricalMap ? "bg-blue-400 text-black shadow" : "bg-slate-100 hover:bg-slate-200"}`}
              >
                Taxa
              </button>
               {/* [ADDED] Download / Snapshot button */}
              <button
                onClick={handleDownloadSnapshot}
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-black shadow bg-slate-100 hover:bg-slate-200"
                title="Save current map as PNG"
              >
                Download / Snapshot
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-[1400px] mx-auto w-full px-3 md:px-4 py-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Left Sidebar */}
          <aside className="md:col-span-1">
            {showHistoricalMap ? (
              <div className="bg-white rounded-2xl shadow p-4 top-[84px]">
                <h2 className="text-lg font-semibold mb-2">About this map</h2>
                <p className="text-sm text-slate-600">
                This map shows where plant-parasitic nematodes (PPNs) have been found in Northern Australia.
                </p>
                <div className="mt-4">
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-center gap-3">
                      <span className="inline-block h-4 w-4 shrink-0 rounded-full bg-[#f87171] ring-1 ring-[#f87171]/40" />
                      <span>
                        <strong>Confirmed</strong> – nematodes have been detected in these areas.
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="inline-block h-4 w-4 shrink-0 rounded-full bg-[#e5e7eb] ring-1 ring-[#e5e7eb]/60" />
                      <span>
                        <strong>Unconfirmed</strong> – nematodes may occur, but not yet verified.​
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="mt-4 p-3 rounded-lg bg-slate-50 border text-sm">
                  <strong>Tip:</strong> Zoom in to see details for specific
                  regions.
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow p-4 sticky top-[84px] max-h-[calc(100vh-120px)] flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold">Nematodes</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={handleSelectAll}
                      className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 rounded text-xs font-medium 
                              transition-transform duration-200 ease-in-out hover:scale-105 hover:shadow"
                    >
                      Select all
                    </button>

                    <button
                      onClick={handleClearNewMapFilters}
                      className="px-2.5 py-1.5 bg-rose-500 hover:bg-rose-600 text-black rounded text-xs font-medium 
                              transition-transform duration-200 ease-in-out hover:scale-105 hover:shadow"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {/* Search */}
                <div className="mb-3 relative">
                  <img
                    src="/search-icon.svg"
                    alt="Search"
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                  />
                  <input
                    type="text"
                    placeholder="Search common name…"
                    value={groupQuery}
                    onChange={(e) => setGroupQuery(e.target.value)}
                    className="w-full rounded-lg border border-[#E3E5E7] pl-10 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#027fb8]"
                  />
                </div>


                {/* Scrollable checkbox grid */}
                <div className="flex-1 overflow-y-auto rounded-xl border border-[#E3E5E7] p-2">
                  {newMapIsLoading ? (
                    <p className="text-slate-500 text-sm p-2">
                      Loading nematode groups…
                    </p>
                  ) : filteredGroups.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-1 gap-2">
                      {filteredGroups.map((group) => {
                        const formatName = (name) => {
                          if (name.toLowerCase().includes("nematode")) {
                            return name; // leave untouched
                          }

                          const parts = name.split(" ");
                          if (parts.length === 0) return name;

                          if (parts.includes("spp.") || parts.includes("sp.")) {
                            // Italicize only Genus
                            return (
                              <>
                                <i>{parts[0]}</i> {parts.slice(1).join(" ")}
                              </>
                            );
                          }

                          if (parts.length >= 2) {
                            // Italicize Genus + species
                            return (
                              <>
                                <i>
                                  {parts[0]} {parts[1]}
                                </i>{" "}
                                {parts.slice(2).join(" ")}
                              </>
                            );
                          }

                          return name;
                        };

                        return (
                          <label
                            key={group}
                            className="flex items-center justify-between gap-3 p-2 rounded-lg border border-[#E3E5E7] hover:border-slate-300 cursor-pointer"
                            title={group}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span
                                className="inline-block w-3.5 h-3.5 rounded shrink-0"
                                style={{
                                  backgroundColor: getNematodeGroupColor(group),
                                }}
                              />
                              <span className="text-sm truncate">
                                {formatName(group)}
                              </span>
                            </div>
                            <input
                              type="checkbox"
                              value={group}
                              checked={newMapSelectedNematodeGroups.includes(
                                group
                              )}
                              onChange={handleNewMapCheckboxChange}
                              className="h-4 w-4 accent-blue-600"
                            />
                          </label>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-slate-500 text-sm p-2">
                      No matching groups.
                    </p>
                  )}
                </div>

                {/* Small legend */}
                {!showHistoricalMap && (
                  <div className="mt-3 text-xs text-slate-600">
                    Markers are colored by Common name. Multiple points at the
                    same location are gently offset so each remains clickable.
                  </div>
                )}
              </div>
            )}
          </aside>

          {/* Map Panel */}
          <section className="md:col-span-3">
            <div className="bg-white rounded-2xl shadow overflow-hidden">
              {/* [ADDED] Only the area inside this wrapper gets captured */}
              <div ref={mapShotRef} className="h-[80vh]"> {/* [ADDED] */}
                {showHistoricalMap ? (
                  <HistoricalMap />
                ) : (
                  <MapContainer
                    center={[-25.2744, 133.7751]}
                    zoom={5}
                    style={{ height: "100%", width: "100%" }}
                    doubleClickZoom={false}
                    className="rounded-xl"
                  >
                    {/* [ADDED] CORS so snapshots include tiles */}
                    <TileLayer
                      crossOrigin="anonymous"
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution="© OpenStreetMap contributors"
                    />
                    <GeoJSONLayerWithInteractions
                      geoData={null}
                      detailedNematodeRecords={newMapDetailedNematodeRecords}
                      getFeatureBaseStyle={null}
                      selectedLGA={null}
                      setSelectedLGA={null}
                      lgaLayersRef={null}
                      selectedLGAStyle={null}
                      selectedNematodeGroups={newMapSelectedNematodeGroups}
                      showMarkers={true}
                    />
                  </MapContainer>
                )}
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        {/* <footer className="py-4 text-center text-xs text-slate-500">
        Data visualisation prototype · Leaflet + Tailwind
      </footer> */}
      </div>
    </FadeIn>
  );
};

export default NematodeGeoMap;
