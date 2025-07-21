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