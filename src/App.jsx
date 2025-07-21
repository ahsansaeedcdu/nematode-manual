import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import NematodeMap from './pages/NematodeMap/NematodeMap';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/nematodes/map" element={<NematodeMap />} />
    </Routes>
  );
}
export default App;
