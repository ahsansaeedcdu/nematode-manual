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
