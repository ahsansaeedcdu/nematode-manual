import React, { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { motion, AnimatePresence } from "framer-motion";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Local Leaflet icon fix (independent of your other map)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function RecenterAndInvalidate({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    if (!map) return;
    const target = [lat, lng];
    map.setView(target, 11, { animate: true });
    setTimeout(() => map.invalidateSize(), 50);
    setTimeout(() => map.invalidateSize(), 250);
  }, [lat, lng, map]);
  return null;
}

export default function MapPreviewModal({
  isOpen,
  onClose,
  entry, // { lat, lng, title?, subtitle?, details?: Record<string,string> }
}) {
  const overlayRef = useRef(null);

  // Close on ESC
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen || !entry) return null;

  const { lat, lng, title, subtitle, details } = entry;
  
  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        ref={overlayRef}
        className="fixed inset-0 z-50 bg-blue-950/40 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        onClick={(e) => {
            if (e.target === overlayRef.current) onClose?.();
        }}
      >
        {/* Modal */}
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{
                duration: 0.35,
                ease: "easeInOut"
            }}
        >
          <div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl border border-blue-100 overflow-hidden">
            {/* Header */}
            <div className="px-5 py-3 border-b border-blue-100 bg-blue-50">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-blue-900">
                    {title || "Location preview"}
                  </h3>
                  {subtitle && (
                    <p className="text-sm text-blue-800/80">{subtitle}</p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="px-3 py-1.5 rounded-lg bg-white text-blue-700 border border-blue-200 hover:bg-blue-100 transition text-sm"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Map */}
            <div className="h-[380px] md:h-[460px]">
              <MapContainer
                center={[lat, lng]}
                zoom={11}
                style={{ height: "100%", width: "100%" }}
                doubleClickZoom={false}
                className="bg-blue-50"
              >
                <TileLayer
                  url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://stadiamaps.com/">Stadia Maps</a>'
                />
                <RecenterAndInvalidate lat={lat} lng={lng} />
                <Marker position={[lat, lng]}>
                  <Popup>
                    <div className="text-sm">
                      <div className="font-semibold">{title || "Entry"}</div>
                      {details &&
                        Object.entries(details).map(([k, v]) => (
                          <div key={k}>
                            <span className="text-blue-800/80">{k}:</span>{" "}
                            {String(v)}
                          </div>
                        ))}
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            </div>

            {/* Footer (optional details row) */}
            {details && (
              <div className="px-5 py-3 border-t border-blue-100 bg-blue-50/60 text-sm text-blue-900/90 grid grid-cols-1 md:grid-cols-2 gap-2">
                {Object.entries(details).map(([k, v]) => (
                  <div key={k}>
                    <span className="font-medium">{k}: </span>
                    <span>{String(v)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
