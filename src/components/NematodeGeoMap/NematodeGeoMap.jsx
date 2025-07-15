import React, { useEffect, useState, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './NematodeGeoMap.css';

const NematodeGeoMap = () => {
  const [geoData, setGeoData] = useState(null);
  const [nematodeMap, setNematodeMap] = useState({});
  const [selectedLGA, setSelectedLGA] = useState(null);
  const lgaLayersRef = useRef({}); // Store references to Leaflet layers by LGA Name
  const prevSelectedLgaRef = useRef(null); // New: To track the *previously* selected LGA's name

  useEffect(() => {
    fetch('/data/LGA_2024_AUST_GDA2020.json')
      .then(res => res.json())
      .then(setGeoData);

    fetch('/data/lga_nematode_map.json')
      .then(res => res.json())
      .then(setNematodeMap);
  }, []);

  const getFeatureBaseStyle = useCallback((feature) => {
    const lgaName = feature.properties?.LGA_NAME24?.trim();
    const hasData = lgaName && Array.isArray(nematodeMap[lgaName]) && nematodeMap[lgaName].length > 0;

    return {
      fillColor: hasData ? '#ff4d4d' : '#e0e0e0', // Base color
      color: '#555',
      weight: 1,
      fillOpacity: 0.6
    };
  }, [nematodeMap]);

  const selectedLGAStyle = {
    fillColor: '#6a0dad', // Distinct color for selected
    color: '#333',
    weight: 2,
    fillOpacity: 0.8
  };

  // Effect to update layer styles when selectedLGA changes
  useEffect(() => {
    // If there was a previously selected LGA, reset its style
    if (prevSelectedLgaRef.current && lgaLayersRef.current[prevSelectedLgaRef.current]) {
      const prevLayer = lgaLayersRef.current[prevSelectedLgaRef.current];
      // Important: Pass a dummy feature object to getFeatureBaseStyle to provide properties
      // Or, better, store the base style along with the layer ref if it's dynamic
      prevLayer.setStyle(getFeatureBaseStyle({ properties: { LGA_NAME24: prevSelectedLgaRef.current } }));
    }

    // Apply style to the newly selected LGA
    if (selectedLGA && lgaLayersRef.current[selectedLGA]) {
      const currentLayer = lgaLayersRef.current[selectedLGA];
      currentLayer.setStyle(selectedLGAStyle);
    }

    // Update the reference to the previously selected LGA for the next click
    prevSelectedLgaRef.current = selectedLGA;

  }, [selectedLGA, getFeatureBaseStyle]); // Dependencies: selectedLGA, getFeatureBaseStyle


  const GeoJSONLayerWithInteractions = ({ geoData, nematodeMap, getFeatureBaseStyle, selectedLGA, setSelectedLGA, lgaLayersRef, selectedLGAStyle }) => {
    const map = useMap();

    const onEachFeature = (feature, layer) => {
      const lgaName = feature.properties?.LGA_NAME24?.trim();

      // Store a reference to this specific Leaflet layer in the ref
      lgaLayersRef.current[lgaName] = layer;

      // Apply initial style. Use the selected style if it matches the initial selectedLGA
      if (lgaName === selectedLGA) {
        layer.setStyle(selectedLGAStyle);
      } else {
        layer.setStyle(getFeatureBaseStyle(feature));
      }

      const species = nematodeMap[lgaName] || [];
      const tooltipContent = `
        <strong>${lgaName}</strong><br/>
        ${species.length > 0 ? species.join(', ') : 'No nematodes found'}
      `;

      layer.bindTooltip(tooltipContent, {
        direction: 'center',
        sticky: true,
        opacity: 0.9,
        className: 'custom-tooltip'
      });

      layer.on({
        mouseover: (e) => {
          // If the hovered LGA is the currently selected one, do nothing
          if (lgaName === selectedLGA) return;
          e.target.setStyle({
            weight: 2,
            color: '#000',
            fillOpacity: 0.8,
          });
        },
        mouseout: (e) => {
          // If the hovered LGA is the currently selected one, do nothing
          if (lgaName === selectedLGA) return;
          // Reset to its base style
          e.target.setStyle(getFeatureBaseStyle(feature));
        },
        click: () => {
          setSelectedLGA(lgaName); // This triggers the useEffect above
          const bounds = layer.getBounds();
          if (map) {
            map.fitBounds(bounds, {
              padding: [50, 50],
              maxZoom: 12,
            });
          }
        }
      });
    };

    if (!geoData) return null;

    return (
      <GeoJSON
        data={geoData}
        onEachFeature={onEachFeature}
        // No 'style' prop needed here, as styling is handled in onEachFeature initially
        // and then via direct layer manipulation in useEffect
      />
    );
  };

  return (
    <MapContainer
      center={[-25.2744, 133.7751]}
      zoom={5}
      style={{ height: '90vh', width: '100vw' }}
      doubleClickZoom={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <GeoJSONLayerWithInteractions
        geoData={geoData}
        nematodeMap={nematodeMap}
        getFeatureBaseStyle={getFeatureBaseStyle}
        selectedLGA={selectedLGA}
        setSelectedLGA={setSelectedLGA}
        lgaLayersRef={lgaLayersRef}
        selectedLGAStyle={selectedLGAStyle}
      />
    </MapContainer>
  );
};

export default NematodeGeoMap;