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
import Acknowledgments from "./pages/acknowledgement/Acknowledgments";
import Contributors from "./pages/contributors/Contributors";
import FootnotesPage from "./pages/footnotes/FootnotesPage";
import DisclaimerPage from "./pages/disclaimer/DisclaimerPage";


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
              <Footer />
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

        {/* NEW: Image Gallery page (since it's imported) */}
        <Route
          path="/image-gallery"
          element={
            <>
              <Navbar />
              <main className="min-h-[60vh] bg-white">
                <div className="max-w-7xl mx-auto px-6 md:px-8 py-8">
                  <ImageGallery />
                </div>
              </main>
              <Footer />
            </>
          }
        />

        {/* NEW: Disclaimer page */}
        <Route
          path="/disclaimer"
          element={
            <>
              <Navbar />
              <DisclaimerPage />
              <Footer />
            </>
          }
        />

        {/* NEW: Footnotes page */}
        <Route
          path="/footnotes"
          element={
            <>
              <Navbar />
              <FootnotesPage />
              <Footer />
            </>
          }
        />

        <Route
          path="/acknowledgments"
          element={
            <>
              <Navbar />
              <Acknowledgments />
              <Footer />
            </>
          }
        />

        <Route
          path="/contributors"
          element={
            <>
              <Navbar />
              <Contributors />
              <Footer />
            </>
          }
        />
      </Routes>
    </>
  );
}

export default App;
