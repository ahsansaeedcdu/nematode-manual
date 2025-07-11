// src/pages/Home/Home.jsx (create this file)
import React, { useState } from 'react';
import SearchBar from '../../components/searchbar/SearchBar';
import AZFilter from '../../components/A-Zfilter/AZFilter';
import NematodeList from '../../components/nematodeList/NematodeList';
import nematodeData from '../../data/nematodeData';
import { Link } from 'react-router-dom';
import '../../App.css';

function Home() {
  const [query, setQuery] = useState('');
  const [selectedLetter, setSelectedLetter] = useState(null);

  return (
    <main className="main">
      <header className="header">
        <h1>NEMATODE</h1>
        <SearchBar
          value={query}
          onChange={setQuery}
          onClear={() => setQuery('')}
        />
        <AZFilter
          activeLetter={selectedLetter}
          onLetterClick={letter =>
            setSelectedLetter(prev => (prev === letter ? null : letter))
          }
        />
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Link to="/nematodes/map" className="map-button">
            🌍 View Nematode Map
          </Link>
        </div>
      </header>

      {Object.entries(nematodeData)
        .filter(([letter]) => !selectedLetter || letter === selectedLetter)
        .map(([letter, items]) => {
          const filteredItems = items.filter(item =>
            item.name.toLowerCase().includes(query.toLowerCase())
          );
          if (filteredItems.length === 0) return null;

          return (
            <NematodeList
              key={letter}
              letter={letter}
              items={filteredItems}
            />
          );
        })}
    </main>
  );
}

export default Home;
