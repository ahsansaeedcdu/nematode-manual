import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import NematodeMap from "./pages/NematodeMap/NematodeMap";
import NematodeDetail from "./pages/NematodeDetail/NematodeDetail";
import Navbar from "./components/Navbar/navBar";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import Footer from "./components/Footer/Footer"; 
import ImageGallery from "./components/ImageGallery/ImageGallery";
import AboutUs from "./pages/about/AboutUs";

function App() {
  return (
    <>
      <ScrollToTop />

      <Routes>
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Home />
              <Footer />   
            </>
          }
        />

        <Route
          path="/nematodes/map"
          element={
            <>
              <Navbar />
              <NematodeMap />
              <Footer />   {/* ← here */}
            </>
          }
        />
        <Route
          path="/details/:commonName"
          element={
            <>
              <Navbar />
              <NematodeDetail />
              <Footer />   
            </>
          }
        />

        <Route
          path="/about"
          element={
            <>
              <Navbar />
              <AboutUs />
              <Footer />   
            </>
          }
        />

      </Routes>
    </>
  );
}
export default App;
