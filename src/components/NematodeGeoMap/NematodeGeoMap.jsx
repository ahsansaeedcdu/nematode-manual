import React, { useEffect, useState, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './NematodeGeoMap.css';
import L from 'leaflet'; // Import Leaflet library for custom icon

// Fix for default marker icon in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});


// Utility function to get a consistent color for a nematode group
const getNematodeGroupColor = (groupName) => {
    const colors = [
        '#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#A1FF33',
        '#33A1FF', '#FF8C33', '#8CFF33', '#33FF8C', '#FF33E0',
        '#E0FF33', '#33E0FF', '#FF3333', '#33FF33', '#3333FF',
        '#FFD700', '#ADFF2F', '#00FFFF', '#FF00FF', '#8A2BE2'
    ];
    let hash = 0;
    for (let i = 0; i < groupName.length; i++) {
        hash = groupName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
};


// Reusable GeoJSON layer component with interactions
const GeoJSONLayerWithInteractions = ({
    geoData, // Passed for historical map, but can be null for new map if no GeoJSON needed
    detailedNematodeRecords, // Can be historicalDetailedNematodeRecords or newMapDetailedNematodeRecords (flat array for new map)
    getFeatureBaseStyle, // Will be null for new map
    selectedLGA, // Will be null for new map
    setSelectedLGA, // Will be null for new map
    lgaLayersRef, // Will be null for new map
    selectedLGAStyle, // Will be null for new map
    selectedNematodeGroups = [], // For new map, these are the original keys (e.g., "Meloidogyne sp.")
    showMarkers = false
}) => {
    const map = useMap();

    const onEachFeature = (feature, layer) => {
        const lgaName = feature.properties?.LGA_NAME24?.trim();

        if (!lgaName) {
            console.warn("Feature missing LGA_NAME24 property:", feature);
            return;
        }

        // Only store LGA layer ref and apply styles if getFeatureBaseStyle is provided (i.e., for maps with GeoJSON regions)
        if (getFeatureBaseStyle && lgaLayersRef) {
            lgaLayersRef.current[lgaName] = layer;
            layer.setStyle(getFeatureBaseStyle(feature));
        }


        // For tooltips on LGAs (only relevant for historical map now)
        // detailedNematodeRecords will be structured differently for historical vs new map
        // For historical: LGA_NAME -> Array<{ common_nematode_name: string }>
        // For new map: flat array of records, so this logic won't be called for new map's onEachFeature
        const allRecordsForLGA = Array.isArray(detailedNematodeRecords) ? [] : detailedNematodeRecords[lgaName] || [];
        
        let uniqueNematodesInTooltip = new Set();
        if (selectedNematodeGroups.length > 0) {
            // This path is primarily for the historical map's tooltip, where selectedNematodeGroups is empty
            // or if we ever re-introduce LGA coloring/filtering on new map.
            allRecordsForLGA.filter(record =>
                selectedNematodeGroups.includes(record.common_nematode_name)
            ).forEach(record => uniqueNematodesInTooltip.add(record.common_nematode_name));
        } else {
            // This path is for historical map's default tooltip (no filters)
            // or if new map ever had LGA tooltips without filters
            allRecordsForLGA.forEach(record => uniqueNematodesInTooltip.add(record.common_nematode_name || record.species || record));
        }

        const tooltipContent = `
            <strong>${lgaName}</strong><br/>
            ${uniqueNematodesInTooltip.size > 0
                ? Array.from(uniqueNematodesInTooltip).join(', ')
                : 'No nematodes found (or none matching filters)'}
        `;

        layer.bindTooltip(tooltipContent, {
            direction: 'center',
            sticky: true,
            opacity: 0.9,
            className: 'custom-tooltip'
        });

        layer.on({
            mouseover: (e) => {
                if (lgaName === selectedLGA) return;
                e.target.setStyle({
                    weight: 2,
                    color: '#000',
                    fillOpacity: 0.8,
                });
            },
            mouseout: (e) => {
                if (lgaName === selectedLGA) return;
                // Only reset style if getFeatureBaseStyle is provided
                if (getFeatureBaseStyle) {
                    e.target.setStyle(getFeatureBaseStyle(feature));
                }
            },
            click: () => {
                if (setSelectedLGA) { // Only call if setSelectedLGA is provided
                    setSelectedLGA(lgaName);
                }
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

     const markersToDisplay = [];
    if (showMarkers && Array.isArray(detailedNematodeRecords)) {
        detailedNematodeRecords.forEach(record => {
            // Ensure lat/lng exist and are numbers, and originalGroupKey exists for filtering
            if (record.lat != null && record.lng != null && !isNaN(record.lat) && !isNaN(record.lng) && record.originalGroupKey) {
                // Only show marker if its group is explicitly selected
                if (selectedNematodeGroups.includes(record.originalGroupKey)) {
                    markersToDisplay.push(record);
                }
            }
        });
    }

    return (
        <>
            {/* Only render GeoJSON if geoData is provided (e.g., for historical map) */}
            {geoData && (
                <GeoJSON
                    key={JSON.stringify(selectedNematodeGroups || [])}
                    data={geoData}
                    onEachFeature={onEachFeature}
                />
            )}
            
            {showMarkers && markersToDisplay.map((record, index) => {
                // Use originalGroupKey for consistent coloring with checkbox labels
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
                    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
                `;
                const customIcon = L.divIcon({
                    className: "custom-marker-icon",
                    html: `<span style="${markerHtmlStyles}" />`,
                    iconSize: [24, 24],
                    iconAnchor: [12, 24],
                    popupAnchor: [0, -20]
                });

                return (
                    <Marker
                        key={`marker-${record["Sample ID"] || index}-${record.lat}-${record.lng}`}
                        position={[record.lat, record.lng]}
                        icon={customIcon}
                    >
                        <Popup>
                            <div className="font-semibold text-gray-800">
                                <p className="mb-1"><strong>Nematode:</strong> {record.common_nematode_name}</p>
                                <p className="mb-1"><strong>Original:</strong> {record.original_nematode_name}</p>
                                <p className="mb-1"><strong>Plant:</strong> {record["Plant Associated"] || 'N/A'}</p>
                                <p className="mb-1"><strong>Region:</strong> {record["Sampling Region"] || 'N/A'}</p>
                                <p className="mb-1"><strong>State:</strong> {record["Sampling State"] || 'N/A'}</p>
                                {record.sample_size != null && <p className="mb-1"><strong>Sample Size:</strong> {record.sample_size}</p>}
                                {record["Site Description"] && <p className="mb-1"><strong>Site:</strong> {record["Site Description"]}</p>}
                            </div>
                        </Popup>
                    </Marker>
                );
            })}
        </>
    );
};


// --- Historical Map Component (Your provided code, encapsulated) ---
const HistoricalMap = () => {
    const [geoData, setGeoData] = useState(null);
    const [nematodeMap, setNematodeMap] = useState({});
    const [selectedLGA, setSelectedLGA] = useState(null);
    const lgaLayersRef = useRef({});
    const prevSelectedLgaRef = useRef(null);

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
            fillColor: hasData ? '#ff4d4d' : '#e0e0e0',
            color: '#555',
            weight: 1,
            fillOpacity: 0.6
        };
    }, [nematodeMap]);

    const selectedLGAStyle = {
        fillColor: '#6a0dad',
        color: '#333',
        weight: 2,
        fillOpacity: 0.8
    };
    
    useEffect(() => {
        if (prevSelectedLgaRef.current && lgaLayersRef.current[prevSelectedLgaRef.current]) {
            const prevLayer = lgaLayersRef.current[prevSelectedLGA]; // Corrected: use prevSelectedLgaRef.current
            prevLayer.setStyle(getFeatureBaseStyle({ properties: { LGA_NAME24: prevSelectedLgaRef.current } }));
        }

        if (selectedLGA && lgaLayersRef.current[selectedLGA]) {
            const currentLayer = lgaLayersRef.current[selectedLGA];
            currentLayer.setStyle(selectedLGAStyle);
        }

        prevSelectedLgaRef.current = selectedLGA;
    }, [selectedLGA, getFeatureBaseStyle, selectedLGAStyle]); // Added selectedLGAStyle to dependencies

    // This is a minimal version of GeoJSONLayerWithInteractions that matches your original code
    const GeoJSONLayerForHistorical = ({ geoData, nematodeMap, getFeatureBaseStyle, selectedLGA, setSelectedLGA, lgaLayersRef, selectedLGAStyle }) => {
        const map = useMap();
        
        const onEachFeature = (feature, layer) => {
            const lgaName = feature.properties?.LGA_NAME24?.trim();

            if (!lgaName) return;
            lgaLayersRef.current[lgaName] = layer;

            if (lgaName === selectedLGA) {
                layer.setStyle(selectedLGAStyle);
            } else {
                layer.setStyle(getFeatureBaseStyle(feature));
            }
            
            const species = nematodeMap[lgaName] || [];
            const tooltipContent = `<strong>${lgaName}</strong><br/>${species.length > 0 ? species.join(', ') : 'No nematodes found'}`;

            layer.bindTooltip(tooltipContent, {
                direction: 'center',
                sticky: true,
                opacity: 0.9,
                className: 'custom-tooltip'
            });

            layer.on({
                mouseover: (e) => {
                    if (lgaName === selectedLGA) return;
                    e.target.setStyle({ weight: 2, color: '#000', fillOpacity: 0.8 });
                },
                mouseout: (e) => {
                    if (lgaName === selectedLGA) return;
                    e.target.setStyle(getFeatureBaseStyle(feature));
                },
                click: () => {
                    setSelectedLGA(lgaName);
                    const bounds = layer.getBounds();
                    if (map) { map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 }); }
                }
            });
        };

        if (!geoData) return null;

        return <GeoJSON data={geoData} onEachFeature={onEachFeature} />;
    };

    return (
        <MapContainer
            center={[-25.2744, 133.7751]}
            zoom={5}
            style={{ height: '100%', width: '100%' }}
            doubleClickZoom={false}
            className="rounded-lg"
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
            />
            <GeoJSONLayerForHistorical
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

// --- Main App Component that manages the toggle ---
const NematodeGeoMap = () => {
  // New Map States
  // newMapGeoData is no longer used for rendering GeoJSON on New Map
  const [newMapDetailedNematodeRecords, setNewMapDetailedNematodeRecords] = useState([]); // Now a flat array
  // These states/refs are no longer used for New Map LGA selection/interaction
  const [newMapSelectedLGA, setNewMapSelectedLGA] = useState(null);
  const newMapLgaLayersRef = useRef({});
  const newMapPrevSelectedLgaRef = useRef(null);

  // New Map Filtering States
  const [newMapAllNematodeGroups, setNewMapAllNematodeGroups] = useState([]);
  const [newMapSelectedNematodeGroups, setNewMapSelectedNematodeGroups] = useState([]);

  // Loading state for the new map
  const [newMapIsLoading, setNewMapIsLoading] = useState(false);

  const [showHistoricalMap, setShowHistoricalMap] = useState(true);

  // Removed nematode_common_names_map from here as it's not used for New Map filtering/checkboxes


  // --- Effect for New Map Data and Filters ---
  useEffect(() => {
    const fetchNewMapData = async () => {
      setNewMapIsLoading(true); // Start loading
      try {
        const combinedNemaRes = await fetch('/data/combined_nematode_data.json');
        const combinedNemaRawData = await combinedNemaRes.json();

        const uniqueGroupKeys = new Set();
        const allDetailedRecordsFlat = []; // This will store all records as a flat array

        // Ensure combinedNemaRawData is an object before iterating its values
        if (typeof combinedNemaRawData === 'object' && combinedNemaRawData !== null) {
            Object.entries(combinedNemaRawData).forEach(([groupKey, recordsArray]) => {
                // Ensure recordsArray is an array before iterating
                if (Array.isArray(recordsArray)) {
                    uniqueGroupKeys.add(groupKey); // Add the top-level key for checkboxes
                    recordsArray.forEach(record => {
                        // Attach the original group key to each record for filtering later
                        record.originalGroupKey = groupKey;
                        allDetailedRecordsFlat.push(record);
                    });
                }
            });
        } else {
            console.warn("combined_nematode_data.json is not an object or is null:", combinedNemaRawData);
        }

        const sortedUniqueGroupKeys = Array.from(uniqueGroupKeys).sort();
        setNewMapAllNematodeGroups(sortedUniqueGroupKeys);

        if (sortedUniqueGroupKeys.length > 0) {
            setNewMapSelectedNematodeGroups([sortedUniqueGroupKeys[0]]);
        } else {
            setNewMapSelectedNematodeGroups([]);
        }

        setNewMapDetailedNematodeRecords(allDetailedRecordsFlat); // Set the flat array of records

      } catch (error) {
        console.error("Error fetching or processing new map data:", error);
      } finally {
        setNewMapIsLoading(false); // End loading
      }
    };

    if (!showHistoricalMap) {
      fetchNewMapData();
    } else {
      // Clear new map data when switching away
      setNewMapDetailedNematodeRecords([]);
      setNewMapAllNematodeGroups([]);
      setNewMapSelectedNematodeGroups([]);
      // Reset New Map specific LGA states, though they are not used for rendering regions anymore
      setNewMapSelectedLGA(null);
      newMapLgaLayersRef.current = {};
      newMapPrevSelectedLgaRef.current = null;
      setNewMapIsLoading(false); // Ensure loading is false when map is not active
    }
  }, [showHistoricalMap]);


  const handleNewMapCheckboxChange = useCallback((event) => {
    const { value, checked } = event.target;
    setNewMapSelectedNematodeGroups(prev => {
      if (checked) {
        return [...prev, value];
      } else {
        return prev.filter(group => group !== value);
      }
    });
  }, []);

  const handleClearNewMapFilters = useCallback(() => {
    setNewMapSelectedNematodeGroups([]);
  }, []);


  // These styles and useEffect for LGA interaction are no longer needed for the New Map
  // as regions are not rendered and LGA selection is not part of its functionality.


  return (
    <div className="flex flex-col md:flex-row min-h-screen w-screen bg-gray-100 font-sans">
      {/* Sidebar for Historical Map */}
      {showHistoricalMap && (
        <div className="md:w-1/4 w-full p-4 bg-white shadow-lg flex flex-col rounded-lg m-2 md:m-4 h-full">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 flex-shrink-0">Historical Map Info</h2>
          <div className="flex-grow pr-2">
            {/* <p className="text-gray-700">This sidebar displays information relevant to the historical nematode data. You can add details, legends, or other controls here.</p> */}
            <p className="text-gray-700 mt-2">This map shows general nematode presence (red LGAs) based on historical records.</p>
            {/* Add more content specific to the historical map here */}
          </div>
        </div>
      )}

      {/* Filter Sidebar (only for New Map) */}
      {!showHistoricalMap && (
        <div className="md:w-1/4 w-full p-4 bg-white shadow-lg flex flex-col rounded-lg m-2 md:m-4 h-full overflow-y-auto">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 flex-shrink-0 overflow-y-auto">Nematode Filters (New Map)</h2>
          <div className="flex-grow overflow-y-auto pr-2">
            {newMapIsLoading ? (
              <p className="text-gray-500">Loading nematode groups...</p>
            ) : newMapAllNematodeGroups.length > 0 ? (
              newMapAllNematodeGroups.map(group => (
                <label key={group} className="flex items-center mb-2 text-gray-700 cursor-pointer hover:bg-gray-50 p-1 rounded-md transition duration-150 ease-in-out">
                  <input
                    type="checkbox"
                    value={group}
                    checked={newMapSelectedNematodeGroups.includes(group)}
                    onChange={handleNewMapCheckboxChange}
                    className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-base">{group}</span>
                </label>
              ))
            ) : (
              <p className="text-gray-500">No nematode groups found or data not loaded.</p>
            )}
          </div>
          <button
            onClick={handleClearNewMapFilters}
            className="mt-4 px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 transition duration-300 ease-in-out flex-shrink-0"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Map Section */}
      <div className="flex flex-col flex-grow items-center justify-center p-2 md:p-4">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Nematode Distribution Maps</h1>

        <button
          onClick={() => setShowHistoricalMap(!showHistoricalMap)}
          className="mb-4 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-300 ease-in-out"
        >
          {showHistoricalMap ? 'Show New Map' : 'Show Historical Map'}
        </button>

        <div className="w-full h-full rounded-lg shadow-xl overflow-hidden">
          {showHistoricalMap ? (
            <HistoricalMap />
          ) : (
            <MapContainer
              center={[-25.2744, 133.7751]}
              zoom={5}
              style={{ height: '100%', width: '100%' }}
              doubleClickZoom={false}
              className="rounded-lg"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              <GeoJSONLayerWithInteractions
                geoData={null} // Explicitly pass null for new map to hide regions
                detailedNematodeRecords={newMapDetailedNematodeRecords} // Now a flat array
                getFeatureBaseStyle={null} // Explicitly pass null
                selectedLGA={null} // Explicitly pass null
                setSelectedLGA={null} // Explicitly pass null
                lgaLayersRef={null} // Explicitly pass null
                selectedLGAStyle={null} // Explicitly pass null
                selectedNematodeGroups={newMapSelectedNematodeGroups}
                showMarkers={true}
              />
            </MapContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default NematodeGeoMap;
