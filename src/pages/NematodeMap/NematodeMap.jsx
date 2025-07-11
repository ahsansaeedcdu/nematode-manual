// src/pages/NematodeMap/NematodeMap.jsx
import React from 'react';
import NematodeGeoMap from '../../components/NematodeGeoMap/NematodeGeoMap';

function NematodeMap() {
  return (
    <div>
      <h2 style={{ textAlign: 'center' }}>Nematode Distribution Map</h2>
      <NematodeGeoMap />
    </div>
  );6
}

export default NematodeMap;