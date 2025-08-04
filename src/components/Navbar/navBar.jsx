import React, { useState } from "react";
import { Link } from "react-router-dom"; // ✅ Import Link for navigation
import "./Navbar.css";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Close menu after clicking a link (for mobile)
  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo */}
        <div className="nav-logo">
          <Link to="/" onClick={closeMenu}>Nematode</Link>
        </div>

        {/* Desktop & Mobile Links */}
        <ul className={`nav-links ${isOpen ? "active" : ""}`}>
          <li>
            <Link to="/" onClick={closeMenu}>Home</Link>
          </li>
          <li>
            <Link to="/introduction" onClick={closeMenu}>Introduction</Link>
          </li>
          <li>
            <Link to="/nematodes/map" onClick={closeMenu}>Map</Link>
          </li>
        </ul>

        {/* Hamburger Icon */}
        <div className="nav-toggle" onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  );
}
