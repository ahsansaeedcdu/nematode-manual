// src/pages/Home/Home.jsx (create this file)
import React, { useState, useEffect } from "react";
import SearchBar from "../../components/searchbar/SearchBar";
import AZFilter from "../../components/A-Zfilter/AZFilter";
import NematodeList from "../../components/nematodeList/NematodeList";
import nematodeData from "../../data/nematodeData";
// import HomePage  from '../../components/HomePage/HomePage';
import { Link } from "react-router-dom";
import "../../App.css";
import HomePage from "../../components/HomePage/HomePage";

function Home() {
  const [query, setQuery] = useState("");
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [nematodeData, setNematodeData] = useState({});

  // useEffect(() => {
  //   fetch("/data/nematode_data_grouped_by_letter.json")
  //     .then((res) => res.json())
  //     .then((data) => setNematodeData(data))
  //     .catch((err) => console.error("Failed to load nematode data:", err));
  // }, []);

  return (
    <main className="main">
      {/* <header className="header">
        
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
      </header> */}
      <HomePage />
      {/* {Object.entries(nematodeData)
      .filter(([letter]) => !selectedLetter || letter === selectedLetter)
      .map(([letter, items]) => {
        const filteredItems = items.filter(item =>
          item.name.toLowerCase().startsWith(query.toLowerCase()) // <-- UPDATE HERE
        );

        if (filteredItems.length === 0) return null;

        return (
          <NematodeList
            key={letter}
            letter={letter}
            items={filteredItems}
          />
        );
      })} */}
    </main>
  );
}

export default Home;
