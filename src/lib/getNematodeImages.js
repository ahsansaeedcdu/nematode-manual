// Eagerly import all image modules, then read their default export (the URL)
const modules = import.meta.glob(
  "/src/assets/images/**/*.{png,jpg,jpeg,webp,svg}",
  { eager: true }
);

// Build a { [sourcePath]: url } map
const files = Object.fromEntries(
  Object.entries(modules).map(([p, m]) => [p, m.default || m])
);

export function getImagesForNematode(commonName) {
  if (!commonName) return [];
  const folderName = commonName.trim(); // e.g. "Ring nematodes"
  const prefix = `/src/assets/images/${folderName}/`;

  const items = Object.entries(files)
    .filter(([path]) => path.toLowerCase().startsWith(prefix.toLowerCase()))
    .map(([path, url]) => {
      const filename = path.split("/").pop() || "";
      return { path: url, name: filename.replace(/\.[^.]+$/, "") };
    });

  // Debug once to confirm you see /assets/... (or /@fs/... in dev)
  console.log("Matched images:", items);
  return items;
}
