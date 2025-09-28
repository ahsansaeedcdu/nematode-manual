import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { point } from "@turf/helpers";

const CommonNameMap = () => {
  const [geoData, setGeoData] = useState(null);
  const [combined, setCombined] = useState({});
  const [allCommonNames, setAllCommonNames] = useState([]);
  const [selectedCommon, setSelectedCommon] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch("/data/LGA_2024_context.json").then((r) => r.json()),
      fetch(
        "/data/combined_nematodes_with_coords.json"
      ).then((r) => r.json()),
    ]).then(([geo, combinedData]) => {
      setGeoData(geo);
      setCombined(combinedData);
      const names = Object.values(combinedData)
        .map((g) => g["Common name"])
        .filter(Boolean);
      const sortedUniqueNames = [...new Set(names)].sort();
      setAllCommonNames(sortedUniqueNames);
      if (sortedUniqueNames.length > 0) {
        setSelectedCommon(sortedUniqueNames[0]);
      }
    });
  }, []);

  const lgaEntryMap = useMemo(() => {
    if (!geoData || !selectedCommon) return {};
    const map = {};
    const group = Object.values(combined).find(
      (g) => g["Common name"] === selectedCommon
    );
    if (!group) return {};
    (group.Entries || []).forEach((entry) => {
      const { ["Latitude (°S)"]: lat, ["Longitude (°E)"]: lng } = entry;
      if (lat == null || lng == null) return;
      const pt = point([lng, lat]);
      geoData.features.forEach((f) => {
        if (f.geometry && booleanPointInPolygon(pt, f.geometry)) {
          const lga = f.properties?.LGA_NAME24;
          if (!map[lga]) map[lga] = [];
          map[lga].push(entry["Nematode Taxa"] || selectedCommon);
        }
      });
    });
    return map;
  }, [geoData, combined, selectedCommon]);

  const styleFn = useCallback(
    (feature) => {
      const lgaName = feature.properties?.LGA_NAME24;
      const entries = lgaEntryMap[lgaName] || [];
      return {
        fillColor: entries.length ? "#60a5fa" : "#e5e7eb",
        color: "#ffffff",
        weight: 0.6,
        opacity: 1,
        fillOpacity: entries.length ? 0.8 : 0.4,
      };
    },
    [lgaEntryMap]
  );

  const onEachFeature = (feature, layer) => {
    const lgaName = feature.properties?.LGA_NAME24;
    const entries = lgaEntryMap[lgaName] || [];
    if (!lgaName) return;
    const tooltip = `
      <strong>${lgaName}</strong><br/>
      ${
        entries.length
          ? `${entries.length} records<br/>${[...new Set(entries)].join(", ")}`
          : "No records"
      }
    `;
    layer.bindTooltip(tooltip, { sticky: true, opacity: 0.95 });
    layer.on({
      mouseover: (e) => {
        const base = styleFn(feature);
        e.target.setStyle({
          ...base,
          weight: 2,
          color: "#111827",
          fillOpacity: 0.9,
        });
        if (e.target.bringToFront) e.target.bringToFront();
      },
      mouseout: (e) => {
        e.target.setStyle(styleFn(feature));
      },
    });
  };

  return (
    // IMPORTANT: this grid mirrors your NematodeGeoMap layout.
    // Put this component inside a wrapper with fixed height (you already use h-[80vh]).
    <div className="h-full grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Sidebar — same look/width/feel as the taxa sidebar */}
      <aside className="md:col-span-1">
        <div className="bg-white rounded-2xl shadow p-4 sticky top-[84px] max-h-[calc(100vh-120px)] flex flex-col">
          <h2 className="text-lg font-semibold mb-3">Nematodes</h2>

          {/* Scrollable list box with border like taxa panel */}
          <div className="flex-1 overflow-y-auto rounded-xl border border-[#E3E5E7] p-2">
            {allCommonNames.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-1 gap-2">
                {allCommonNames.map((name) => (
                  <label
                    key={name}
                    className="flex items-center justify-between gap-3 p-2 rounded-lg border border-[#E3E5E7] hover:border-slate-300 cursor-pointer"
                    title={name}
                  >
                    <span className="text-sm truncate">{name}</span>
                    <input
                      type="radio"
                      name="commonName"
                      value={name}
                      checked={selectedCommon === name}
                      onChange={() => setSelectedCommon(name)}
                      className="h-4 w-4 accent-blue-600"
                    />
                  </label>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-sm p-2">Loading…</p>
            )}
          </div>

          <div className="mt-3 text-xs text-slate-600">
            LGAs in blue contain records for the selected Common name.
          </div>
        </div>
      </aside>

      {/* Map Panel — same card + height behavior as taxa map */}
      <section className="md:col-span-3">
        <div className="bg-white rounded-2xl shadow overflow-hidden h-full">
          <div className="h-full">
            <MapContainer
              center={[-20, 135]}
              zoom={5}
              style={{ height: "100%", width: "100%" }}
              doubleClickZoom={false}
              className="rounded-xl"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="© OpenStreetMap contributors"
              />
              {geoData && selectedCommon && (
                <GeoJSON
                  key={selectedCommon}
                  data={geoData}
                  style={styleFn}
                  onEachFeature={onEachFeature}
                />
              )}
            </MapContainer>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CommonNameMap;
