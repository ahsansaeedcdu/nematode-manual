import React from 'react';
// import { Routes, Route } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/Home/Home';
import NematodeMap from './pages/NematodeMap/NematodeMap';
import NematodeDetail from './pages/NematodeDetail/NematodeDetail';
import Navbar from './components/Navbar/navBar';
import Introduction from './components/introduction/introduction';

function App() {
  return (
    <Routes>
      <Route path="/" element={ <> <Navbar /><Home /> </>} />
      {/* <Route path="/introduction" element={ <> <Navbar /><Introduction/> </>} /> */}
      <Route path="/nematodes/map" element={ <> <Navbar/> <NematodeMap /> </> } />
      <Route path="/details/:commonName" element={ <> <Navbar/> <NematodeDetail /> </>} />
    </Routes>
  );
}
export default App;
