import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  // Active = blue pill (same as your current look)
  const linkClass = ({ isActive }) =>
    [
      "px-4 py-2 rounded-[12px] text-sm md:text-base font-sans transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300",
      isActive
        ? "bg-[#027FB8] text-white border border-[#027FB8]"
        : "text-black hover:text-[#027FB8]",
    ].join(" ");

  return (
    <nav className="sticky top-0 z-[1001] w-full bg-[#DDEDFF] border-b border-zinc-200 shadow-sm">
      {/* Desktop / tablet */}
      <div className="hidden md:flex h-16 items-center justify-between">
        {/* Left: Brand */}
        <Link
          to="/"
          onClick={() => setOpen(false)}
          className="pl-4 sm:pl-6 flex items-center gap-3"
        >
          {/* Neutral SVG logo */}
          <svg
            className="h-9 w-9"
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
          >
            <defs>
              <linearGradient id="nema-neutral" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#94a3b8" />
                <stop offset="1" stopColor="#334155" />
              </linearGradient>
            </defs>
            <circle cx="12" cy="12" r="10" fill="url(#nema-neutral)" />
            <path
              d="M7 14c2.5-4 7.5-4 10 0"
              stroke="#fff"
              strokeWidth="1.6"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M12 6c1.6 1.2 2.9 3 3.5 5"
              stroke="#fff"
              strokeWidth="1.6"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
          <span className="text-[#84786D] text-2xl md:text-lg font-semibold tracking-tight">
  Plant-parasitic Nematodes in Northern Australia
</span>

        </Link>

        {/* Center: Nav links */}
        <div className="flex items-center gap-8">
          <NavLink to="/" end className={linkClass}>
            Home
          </NavLink>
          <NavLink to="/nematodes/map" className={linkClass}>
            Map
          </NavLink>
          {/* New About link */}
          <NavLink to="/about" className={linkClass}>
            About
          </NavLink>
        </div>

        {/* Right spacer to balance layout */}
        <div className="pr-4 sm:pr-6 w-[292px]" />
      </div>

      {/* Mobile */}
      <div className="md:hidden">
        <div className="h-16 flex items-center justify-between px-4">
          <Link
            to="/"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2"
          >
            <svg
              className="h-8 w-8"
              viewBox="0 0 24 24"
              aria-hidden="true"
              focusable="false"
            >
              <defs>
                <linearGradient id="nema-neutral-sm" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#94a3b8" />
                  <stop offset="1" stopColor="#334155" />
                </linearGradient>
              </defs>
              <circle cx="12" cy="12" r="10" fill="url(#nema-neutral-sm)" />
              <path
                d="M7 14c2.5-4 7.5-4 10 0"
                stroke="#fff"
                strokeWidth="1.6"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M12 6c1.6 1.2 2.9 3 3.5 5"
                stroke="#fff"
                strokeWidth="1.6"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            <span className="text-gray-900 text-base font-semibold">
              Plant-parasitic Nematodes
            </span>
          </Link>

          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
            className="inline-flex items-center justify-center rounded-md p-2 text-slate-700 hover:bg-zinc-100"
          >
            <svg
              className="h-7 w-7"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              {open ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 7h16M4 12h16M4 17h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Slide-down panel */}
        <div
          className={`overflow-hidden transition-[max-height] duration-300 ${
            open ? "max-h-60" : "max-h-0"
          }`}
        >
          <div className="px-4 pb-4">
            <nav className="flex flex-col">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  [
                    "py-2 pl-1 text-sm font-medium transition-colors",
                    isActive
                      ? "text-gray-900"
                      : "text-slate-600 hover:text-gray-900",
                  ].join(" ")
                }
                onClick={() => setOpen(false)}
              >
                Home
              </NavLink>

              <NavLink
                to="/nematodes/map"
                className={({ isActive }) =>
                  [
                    "py-2 pl-1 text-sm font-medium transition-colors",
                    isActive
                      ? "text-gray-900"
                      : "text-slate-600 hover:text-gray-900",
                  ].join(" ")
                }
                onClick={() => setOpen(false)}
              >
                Map
              </NavLink>

              {/* New About link (mobile) */}
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  [
                    "py-2 pl-1 text-sm font-medium transition-colors",
                    isActive
                      ? "text-gray-900"
                      : "text-slate-600 hover:text-gray-900",
                  ].join(" ")
                }
                onClick={() => setOpen(false)}
              >
                About
              </NavLink>
            </nav>
          </div>
        </div>
      </div>
    </nav>
  );
}
