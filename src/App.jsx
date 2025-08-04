import React from 'react';
// import { Routes, Route } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/Home/Home';
import NematodeMap from './pages/NematodeMap/NematodeMap';
import NematodeDetail from './pages/NematodeDetail/NematodeDetail';
import Navbar from './components/Navbar/navBar';

function App() {
  return (
    <Routes>
      <Route path="/" element={ <> <Navbar /><Home /> </>} />
      <Route path="/nematodes/map" element={<NematodeMap />} />
      <Route path="/nematode/:name" element={<NematodeDetail />} />
    </Routes>
  );
}
export default App;
