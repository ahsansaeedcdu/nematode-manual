import { useEffect, useState } from "react";

export default function ImageGallery({ imageDetails = [] }) {
  const [activeIdx, setActiveIdx] = useState(null);
  const isOpen = activeIdx !== null && imageDetails[activeIdx];
  const open = (idx) => setActiveIdx(idx);
  const close = () => setActiveIdx(null);
  const prev = () =>
    setActiveIdx((i) => (i === null ? 0 : (i - 1 + imageDetails.length) % imageDetails.length));
  const next = () =>
    setActiveIdx((i) => (i === null ? 0 : (i + 1) % imageDetails.length));

  // Keyboard: ESC, ←, →
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, imageDetails.length]);

  return (
    <section className="rounded-3xl bg-white dark:bg-slate-900 p-6 md:p-8 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800">
      {/* Title */}
      <header className="mb-6">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight leading-tight">
          <span className="bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-pink-600 bg-clip-text text-transparent">
            Images
          </span>
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {imageDetails?.length || 0} {imageDetails?.length === 1 ? "item" : "items"}
        </p>
      </header>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {imageDetails.map(({ path, name }, i) => (
          <div
            key={`${name ?? "image"}-${i}`}
            onClick={() => open(i)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && open(i)}
            className="group relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-left cursor-zoom-in focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900"
          >
            <figure>
              <div className="aspect-[4/3] bg-white dark:bg-slate-900">
                <img
                  src={path}
                  alt={name || "Image preview"}
                  loading="lazy"
                  className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.03]"
                  onError={(e) => {
                    e.currentTarget.alt = "Image failed to load";
                    e.currentTarget.src =
                      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='450'><rect width='100%' height='100%' fill='%23f1f5f9'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%2394a3b8' font-family='sans-serif' font-size='16'>Image unavailable</text></svg>";
                  }}
                />
              </div>
              {/* FULL title (no truncation) */}
              <figcaption
                className="px-3 py-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 whitespace-normal break-words"
                style={{ hyphens: "auto" }}
              >
                {name || "Untitled"}
              </figcaption>
            </figure>
          </div>
        ))}
      </div>

      {/* Lightbox / Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`Preview ${imageDetails[activeIdx]?.name ?? "image"}`}
          onClick={close}
        >
          <div className="mx-4 w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <div className="relative rounded-2xl overflow-hidden bg-white/95 dark:bg-slate-900/95 ring-1 ring-slate-200/60 dark:ring-slate-700/60">
              {/* TOP TOOLBAR (icons only; not over the image) */}
              <div className="flex items-center justify-between gap-2 border-b border-slate-200/60 dark:border-slate-700/60 px-3 py-2">
                <div className="flex items-center gap-1">
                  {imageDetails.length > 1 && (
                    <>
                      <span
                        role="button"
                        tabIndex={0}
                        title="Previous"
                        aria-label="Previous image"
                        onClick={prev}
                        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && prev()}
                        className="cursor-pointer rounded-md p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        {/* Left chevron icon */}
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                      <span
                        role="button"
                        tabIndex={0}
                        title="Next"
                        aria-label="Next image"
                        onClick={next}
                        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && next()}
                        className="cursor-pointer rounded-md p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        {/* Right chevron icon */}
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                    </>
                  )}
                </div>

                <span
                  role="button"
                  tabIndex={0}
                  title="Close"
                  aria-label="Close"
                  onClick={close}
                  onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && close()}
                  className="cursor-pointer rounded-md p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  {/* Close (X) icon */}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </span>
              </div>

              {/* IMAGE AREA (icons are NOT overlaid) */}
              <div className="px-3 py-3">
                <img
                  src={imageDetails[activeIdx].path}
                  alt={imageDetails[activeIdx].name || "Expanded image"}
                  className="mx-auto max-w-full max-h-[85vh] rounded-md object-contain shadow-2xl"
                />
              </div>

              {/* Caption */}
              <div className="px-4 pb-4 text-center text-sm text-slate-700 dark:text-slate-200 whitespace-normal break-words" style={{ hyphens: "auto" }}>
                {imageDetails[activeIdx].name || "Untitled"}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
