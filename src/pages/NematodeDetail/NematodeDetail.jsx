import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './NematodeDetail.css';

const NematodeDetail = () => {
  const { name } = useParams();
  const [nematodeData, setNematodeData] = useState(null);

  useEffect(() => {
    fetch('/data/nematode_data_grouped_by_letter.json')
      .then(res => res.json())
      .then(data => {
        // Find the nematode by name from grouped data
        const allItems = Object.values(data).flat();
        const match = allItems.find(n => n.name === decodeURIComponent(name));
        setNematodeData(match || null);
      })
      .catch(err => console.error('Error loading nematode detail:', err));
  }, [name]);

  if (!nematodeData) return <div>Loading or Nematode not found.</div>;

  return (
    <div className="nematode-detail">
      <h1>{nematodeData.name}</h1>

      {/* TODO: Add Map showing nematodeData.regions later */}
      <div className="nematode-map-placeholder">
        <p>[Map here for: {nematodeData.regions.join(', ')}]</p>
      </div>

      <div className="nematode-info">
        <h3>Associated Plants:</h3>
        <ul>{nematodeData.plants_associated.map((plant, i) => <li key={i}>{plant}</li>)}</ul>

        <h3>States:</h3>
        <p>{nematodeData.states.join(', ')}</p>

        <h3>References:</h3>
        <ul>{nematodeData.references.map((ref, i) => <li key={i}>{ref}</li>)}</ul>
      </div>
    </div>
  );
};

export default NematodeDetail;
