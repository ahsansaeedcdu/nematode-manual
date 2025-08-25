import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    [
      "px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200",
      isActive
        ? "text-white bg-cyan-600/30 ring-1 ring-cyan-300/40"
        : "text-white hover:bg-cyan-500/20 hover:text-cyan-100",
    ].join(" ");
  
  return (
    <nav className="w-full bg-slate-800 fixed top-0 left-0 w-full z-50 px-[30px]">
      {/* Desktop / tablet */}
      <div className="w-full px-4">
        {/* 3-column grid: left logo / center nav / right actions (optional) */}
        <div className="hidden md:grid h-16 items-center grid-cols-3">
          {/* Left: Logo */}
          <div className="flex items-center justify-start">
            <Link to="/" className="flex items-center gap-2 group">
              
              <span className="text-white/90 group-hover:text-white text-lg font-semibold tracking-tight">
                Nematode
              </span>
            </Link>
          </div>

          {/* Center: Nav links */}
          <div className="flex items-center justify-center gap-8">
            <NavLink to="/" end className={linkClass}>
              Home
            </NavLink>
            {/* <NavLink to="/introduction" className={linkClass}>Introduction</NavLink> */}
            <NavLink to="/nematodes/map" className={linkClass}>
              Map
            </NavLink>
          </div>

          {/* Right: Placeholder for actions (optional). Keeps center perfectly centered */}
          <div className="flex items-center justify-end gap-2">
            {/* Example:
            <Link to="/profile" className="text-slate-200 hover:text-white">Profile</Link>
            */}
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="md:hidden">
        <div className="h-14 px-4 flex items-center justify-center relative">
          {/* Logo centered */}
          <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
            
            <span className="text-white text-lg font-semibold tracking-tight">Nematode</span>
          </Link>

          {/* Toggle at right (doesn't break centering) */}
          <button
            onClick={() => setOpen(v => !v)}
            aria-label="Toggle menu"
            className="absolute right-4 inline-flex items-center justify-center rounded-md p-2 text-slate-200 hover:text-white hover:bg-white/10"
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Slide-down panel */}
        <div
          className={`overflow-hidden transition-[max-height] duration-300 ${
            open ? "max-h-64" : "max-h-0"
          }`}
        >
          <div className="px-4 pb-4">
            <div className="rounded-2xl bg-slate-800/70 ring-1 ring-white/10 backdrop-blur-sm p-2 flex flex-col gap-2">
              <NavLink to="/" end className={linkClass} onClick={() => setOpen(false)}>
                Home
              </NavLink>
              <NavLink to="/introduction" className={linkClass} onClick={() => setOpen(false)}>
                Introduction
              </NavLink>
              <NavLink to="/nematodes/map" className={linkClass} onClick={() => setOpen(false)}>
                Map
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
