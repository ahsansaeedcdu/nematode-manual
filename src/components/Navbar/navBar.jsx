import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    [
      "px-5 py-2 rounded-full text-xl font-semibold transition", // bigger text
      isActive
        ? "text-blue-700 bg-blue-200 ring-1 ring-blue-300"
        : "text-blue-600 hover:text-blue-800 hover:bg-blue-100/60",
    ].join(" ");

  return (
    <nav className="w-full bg-[#f1faee] shadow-sm">
      {/* Desktop / tablet */}
      <div className="mx-auto max-w-none px-6">
        <div className="hidden md:flex h-20 items-center justify-center gap-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-xl bg-blue-600 grid place-items-center text-white font-bold ring-2 ring-blue-400/40 group-hover:ring-blue-300/60 transition">
              N
            </div>
            <span className="text-blue-800 group-hover:text-blue-900 text-2xl font-bold tracking-tight">
              Plant-parasitic Nematodes in Northern Australia
            </span>
          </Link>

          {/* Separator dot */}
          <span className="text-blue-400 text-xl select-none">•</span>

          {/* Centered links */}
          <div className="flex items-center gap-3">
            <NavLink to="/" end className={linkClass}>
              Home
            </NavLink>
            <NavLink to="/nematodes/map" className={linkClass}>
              Map
            </NavLink>
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="md:hidden">
        <div className="h-16 px-4 flex items-center justify-center relative">
          {/* Logo centered */}
          <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
            <div className="h-9 w-9 rounded-xl bg-blue-600 grid place-items-center text-white font-bold">
              N
            </div>
            <span className="text-blue-800 text-lg font-bold tracking-tight">
              Plant-parasitic Nematodes
            </span>
          </Link>

          {/* Toggle at right */}
          <button
            onClick={() => setOpen(v => !v)}
            aria-label="Toggle menu"
            className="absolute right-4 inline-flex items-center justify-center rounded-md p-2 text-blue-700 hover:text-blue-900 hover:bg-blue-100"
          >
            <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
            <div className="rounded-2xl bg-blue-100 ring-1 ring-blue-200 backdrop-blur-sm p-3 flex flex-col gap-3">
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
