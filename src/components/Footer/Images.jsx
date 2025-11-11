// src/components/Images.jsx (or src/components/Footer/Images.jsx)
import React, { useMemo, useState } from "react";

// === existing loader logic ===
const modules = import.meta.glob(
  "/src/assets/images2/**/*.{png,jpg,jpeg,JPG,JPEG,webp,svg}",
  { eager: true }
);

const files = Object.fromEntries(
  Object.entries(modules).map(([p, m]) => [p, m.default || m])
);

// keep for other parts of the app
export function getImagesForNematode(commonName) {
  if (!commonName) return [];
  const folderName = commonName.trim();
  const prefix = `/src/assets/images2/${folderName}/`;
  const items = Object.entries(files)
    .filter(([path]) => path.toLowerCase().startsWith(prefix.toLowerCase()))
    .map(([path, url]) => {
      const filename = path.split("/").pop() || "";
      return { path: url, name: filename.replace(/\.[^.]+$/, "") };
    });
  return items;
}

// build a flat, sorted list of all images
function useAllImages() {
  return useMemo(() => {
    const list = Object.entries(files).map(([path, url]) => {
      const parts = path.split("/");
      const filename = parts[parts.length - 1] || "";

      const title = filename
        .replace(/\.[^.]+$/, "") // remove extension
        .replace(/[-_]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();

      return {
        key: path,
        url,
        title: title || "Untitled image",
      };
    });

    return list.sort((a, b) => a.title.localeCompare(b.title));
  }, []);
}

function Lightbox({ image, onClose }) {
  if (!image) return null;
  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 px-4"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] max-w-5xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute -right-3 -top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-slate-700 shadow"
        >
          Close
        </button>
        <img
          src={image.url}
          alt={image.title}
          className="max-h-[85vh] w-full rounded-2xl bg-white object-contain"
        />
        <p className="mt-2 text-center text-sm text-slate-100">
          {image.title}
        </p>
      </div>
    </div>
  );
}

export default function Images() {
  const [selected, setSelected] = useState(null);
  const images = useAllImages();
  const totalImages = images.length;

  return (
    // BREAK OUT of any centered container and take full viewport width
    <main className="relative left-1/2 right-1/2 -mx-[50vw] w-screen bg-slate-50 px-4 py-8 md:px-8 lg:px-16">
      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold text-[#027fb8]">
         List of Images
        </h1>
        <p className="mt-2 text-sm md:text-base text-slate-600">
           Tap or click any image to view it larger.
        </p>
        
      </header>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {images.map((img) => (
          <button
            key={img.key}
            type="button"
            onClick={() => setSelected(img)}
            className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-[#027fb8]/60 hover:shadow-md"
          >
            <div className="h-32 w-full overflow-hidden sm:h-36 md:h-40">
              <img
                src={img.url}
                alt={img.title}
                className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
              />
            </div>
            <div className="px-2 py-2 text-left">
              <p className="line-clamp-2 text-xs font-medium text-slate-800 md:text-sm">
                {img.title}
              </p>
            </div>
          </button>
        ))}
      </div>

      <Lightbox image={selected} onClose={() => setSelected(null)} />
    </main>
  );
}
