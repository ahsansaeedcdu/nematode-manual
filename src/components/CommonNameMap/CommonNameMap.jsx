import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import React, { useMemo, useCallback, useEffect, useState } from "react";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { point } from "@turf/helpers";

export const ALL_SENTINEL = "__ALL__";
const MAP_ATTRIBUTION = `
  © OpenStreetMap contributors | LGA data: 
  <a href="https://digital.atlas.gov.au/maps/741d20ab9853496daf90963e7978d393/about" target="_blank" rel="noopener noreferrer">
    Digital Atlas of Australia
  </a>
`;
/** Ensures Leaflet gets a proper size/layout AFTER the map mounts and when inputs change. */
function MapReadyFix({ deps = [] }) {
  const map = useMap();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    map.whenReady(() => {
      requestAnimationFrame(() => {
        map.invalidateSize(false);
        requestAnimationFrame(() => {
          map.invalidateSize(false);
          setReady(true);
        });
      });
    });
  }, [map]);

  useEffect(() => {
    if (!ready) return;
    requestAnimationFrame(() => {
      map.invalidateSize(false);
    });
  }, [ready, map, ...deps]);

  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(() => {
      try {
        map.panBy([0, 0]);
      } catch {}
    }, 0);
    return () => clearTimeout(t);
  }, [ready, map, ...deps]);

  return null;
}

/**
 * Props:
 *  - geoData: GeoJSON of LGAs
 *  - combined: combined_nematodes_with_coords.json object
 *  - selectedCommon: string | ALL_SENTINEL (legacy single-select)
 *  - selectedCommonList: string[] (multi-select from parent)
 *
 * Behavior:
 *  - If selectedCommonList is provided:
 *      - If it contains ALL_SENTINEL -> shade LGAs for ALL common names
 *      - Else shade LGAs that contain ANY of the selected names
 *  - Else fall back to legacy `selectedCommon` behavior (single or ALL_SENTINEL)
 *  - If nothing selected and not ALL -> shade nothing (no preload)
 */
const CommonNameMap = ({
  geoData,
  combined,
  selectedCommon,
  selectedCommonList = undefined,
}) => {
  /** Normalize selection input */
  const { useAll, selectedSet } = useMemo(() => {
    if (Array.isArray(selectedCommonList)) {
      const hasAll = selectedCommonList.includes(ALL_SENTINEL);
      return { useAll: hasAll, selectedSet: new Set(hasAll ? [] : selectedCommonList) };
    }
    if (selectedCommon === ALL_SENTINEL) return { useAll: true, selectedSet: new Set() };
    return {
      useAll: false,
      selectedSet: selectedCommon ? new Set([selectedCommon]) : new Set(),
    };
  }, [selectedCommon, selectedCommonList]);

  /** Build LGA -> entries[] map for ONLY the selected names (or ALL if explicitly requested). */
  const lgaEntryMap = useMemo(() => {
    if (!geoData || !combined) return {};

    // ✅ If user hasn't selected anything and hasn't chosen ALL, shade nothing.
    if (!useAll && selectedSet.size === 0) return {};

    const lgaMap = {};

    const attachEntryToLGAs = (entry, label) => {
      const { ["Latitude (°S)"]: lat, ["Longitude (°E)"]: lng } = entry;
      if (lat == null || lng == null) return;
      const pt = point([lng, lat]);
      for (const f of geoData.features) {
        if (f.geometry && booleanPointInPolygon(pt, f.geometry)) {
          const lga = f.properties?.LGA_NAME24;
          if (!lga) continue;
          if (!lgaMap[lga]) lgaMap[lga] = [];
          lgaMap[lga].push(label);
        }
      }
    };

    Object.values(combined).forEach((group) => {
      const label = group["Common name"];
      if (!label) return;
      if (!useAll && !selectedSet.has(label)) return;
      (group.Entries || []).forEach((e) => attachEntryToLGAs(e, label));
    });

    return lgaMap;
  }, [geoData, combined, useAll, selectedSet]);

  /** Stable style function; mouseout uses this to reliably reset. */
  const styleFn = useCallback(
    (feature) => {
      const lgaName = feature.properties?.LGA_NAME24;
      const entries = lgaEntryMap[lgaName] || [];
      return {
        fillColor: entries.length ? "#f87171" : "#e5e7eb",
        color: "#ffffff",
        weight: 0.6,
        opacity: 1,
        fillOpacity: entries.length ? 0.8 : 0.4,
      };
    },
    [lgaEntryMap]
  );
  // function chunkArray(arr, size) {
  //   const chunks = [];
  //   for (let i = 0; i < arr.length; i += size) {
  //     chunks.push(arr.slice(i, i + size));
  //   }
  //   return chunks;
  // }

  const onEachFeature = (feature, layer) => {
    const lgaName = feature.properties?.LGA_NAME24;
    const entries = lgaEntryMap[lgaName] || [];
    if (!lgaName) return;

    const unique = [...new Set(entries)];
    const list = useAll
    ? unique.slice(0, 8).join(", ") + (unique.length > 8 ? "…" : "")
    : unique.join(", ");

    const tooltip = `
      <strong>${lgaName}</strong><br/>
      ${
        entries.length
          ? `${entries.length} records<br/>${list || ""}`
          : "No records"
      }
    `;
    layer.bindTooltip(tooltip, { sticky: true, opacity: 0.95, className: "leaflet-tooltip_common" });

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
        const el = e.target.getElement?.();
        if (el) el.style.cursor = "pointer";
      },
      mouseout: (e) => {
        e.target.setStyle(styleFn(feature));
      },
    });
  };

  /** Force a clean remount of GeoJSON when selection or data changes. */
  const geoJsonKey = useMemo(() => {
    const sz = Object.keys(lgaEntryMap).length;
    const sig =
      useAll ? "ALL" : `SEL:${Array.from(selectedSet).sort().join("|") || "none"}`;
    return `${sig}-${sz}`;
  }, [lgaEntryMap, useAll, selectedSet]);

  return (
    <MapContainer
      center={[-20, 135]}
      zoom={5}
      style={{ height: "100%", width: "100%" }}
      doubleClickZoom={false}
      className="rounded-xl"
    >
      {/* Force invalidateSize after mount and when selection / data changes */}
      <MapReadyFix deps={[useAll, Array.from(selectedSet).join("|"), geoData]} />

      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution={MAP_ATTRIBUTION}
      />

      {geoData && (
        <GeoJSON
          key={geoJsonKey}
          data={geoData}
          style={styleFn}
          onEachFeature={onEachFeature}
        />
      )}
    </MapContainer>
  );
};

export default CommonNameMap;
