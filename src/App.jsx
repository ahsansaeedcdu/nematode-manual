<<<<<<< HEAD
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import NematodeMap from './pages/NematodeMap/NematodeMap';
import NematodeDetail from './pages/NematodeDetail/NematodeDetail';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/nematodes/map" element={<NematodeMap />} />
      <Route path="/nematode/:name" element={<NematodeDetail />} />
    </Routes>
  );
}

export default App;
=======
// src/App.jsx
import React, { useState } from 'react';
import './App.css';
import SearchBar from './components/searchbar/SearchBar';
import AZFilter from './components/A-Zfilter/AZFilter';
import NematodeList from './components/nematodeList/NematodeList';
import nematodeData from './data/nematodeData';  //  data source

function App() {
  const [query, setQuery] = useState('');
  const [selectedLetter, setSelectedLetter] = useState(null);

  return (
    <>
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
      </header>

      
        {Object.entries(nematodeData)
          // If a letter is selected, only keep that section
          .filter(([letter]) =>
            selectedLetter ? letter === selectedLetter : true
          )
          // Render each letter’s list, but also apply the search query
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
    </>
  );
}

export default App;
>>>>>>> bf4577e9c82e59973c10a714d353526f73ca8107
