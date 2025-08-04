import React, { useState } from "react";
import "./Navbar.css";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo */}
        <div className="nav-logo">MyLogo</div>

        {/* Desktop Links */}
        <ul className={`nav-links ${isOpen ? "active" : ""}`}>
          <li><a href="#home">Home</a></li>
          <li><a href="#about">Introduction</a></li>
          
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
