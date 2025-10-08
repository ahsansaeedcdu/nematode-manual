import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import React, { useMemo, useCallback, useEffect, useRef, useState } from "react";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { point } from "@turf/helpers";

export const ALL_SENTINEL = "__ALL__";

/** Ensures Leaflet gets a proper size/layout AFTER the map mounts and when inputs change. */
function MapReadyFix({ deps = [] }) {
  const map = useMap();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // When the map signals ready, invalidate size twice (layout often stabilizes over 2 frames).
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
    // Also invalidate on dependent changes (e.g., switching to ALL, new data, tab switch)
    requestAnimationFrame(() => {
      map.invalidateSize(false);
    });
  }, [ready, map, ...deps]);

  // Force one more slight pan-by-zero to trigger a paint if the browser is stubborn.
  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(() => {
      try { map.panBy([0, 0]); } catch {}
    }, 0);
    return () => clearTimeout(t);
  }, [ready, map, ...deps]);

  return null;
}

const CommonNameMap = ({ geoData, combined, selectedCommon }) => {
  /** Build LGA -> entries[] map for the selection (or ALL). */
  const lgaEntryMap = useMemo(() => {
    if (!geoData || !combined) return {};
    const map = {};

    const attachEntryToLGAs = (entry, label) => {
      const { ["Latitude (°S)"]: lat, ["Longitude (°E)"]: lng } = entry;
      if (lat == null || lng == null) return;
      const pt = point([lng, lat]);
      for (const f of geoData.features) {
        if (f.geometry && booleanPointInPolygon(pt, f.geometry)) {
          const lga = f.properties?.LGA_NAME24;
          if (!lga) continue;
          if (!map[lga]) map[lga] = [];
          map[lga].push(label);
        }
      }
    };

    if (selectedCommon === ALL_SENTINEL) {
      Object.values(combined).forEach((group) => {
        const label = group["Common name"];
        (group.Entries || []).forEach((e) => attachEntryToLGAs(e, label));
      });
      return map;
    }

    const group = Object.values(combined).find(
      (g) => g["Common name"] === selectedCommon
    );
    if (!group) return map;
    (group.Entries || []).forEach((e) =>
      attachEntryToLGAs(e, group["Common name"])
    );
    return map;
  }, [geoData, combined, selectedCommon]);

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

  /** Hover handlers (rely on styleFn so reset works even on first hover). */
  const onEachFeature = (feature, layer) => {
    const lgaName = feature.properties?.LGA_NAME24;
    const entries = lgaEntryMap[lgaName] || [];
    if (!lgaName) return;

    const unique = [...new Set(entries)];
    const list =
      selectedCommon === ALL_SENTINEL
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
        const el = e.target.getElement?.();
        if (el) el.style.cursor = "pointer";
      },
      mouseout: (e) => {
        // Reset using the CURRENT base style (not the initial one)
        e.target.setStyle(styleFn(feature));
      },
    });
  };

  /** Key trick:
   * Force a clean unmount/remount of the GeoJSON whenever selection OR lgaEntryMap changes.
   * This avoids stale event handlers/styles on first render & when toggling ALL.
   */
  const geoJsonKey = useMemo(() => {
    // Incorporate a cheap hash of lgaEntryMap size so the layer remounts when ALL toggles.
    const sz = Object.keys(lgaEntryMap).length;
    return `${selectedCommon ?? "none"}-${sz}`;
  }, [selectedCommon, lgaEntryMap]);

  return (
    <MapContainer
      center={[-20, 135]}
      zoom={5}
      style={{ height: "100%", width: "100%" }}
      doubleClickZoom={false}
      className="rounded-xl"
    >
      {/* Force invalidateSize after mount and when selection / data changes */}
      <MapReadyFix deps={[selectedCommon, geoData]} />

      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap contributors"
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
