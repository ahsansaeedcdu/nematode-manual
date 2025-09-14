
const modules = import.meta.glob(
  "/src/assets/images/**/*.{png,jpg,jpeg,JPG,JPEG,webp,svg}",
  { eager: true }
);

const files = Object.fromEntries(
  Object.entries(modules).map(([p, m]) => [p, m.default || m])
);

export function getImagesForNematode(commonName) {
  // Return an empty array if no name is provided.
  if (!commonName) return [];
  const folderName = commonName.trim();
  const prefix = `/src/assets/images/${folderName}/`;
  const items = Object.entries(files)

    .filter(([path]) => path.toLowerCase().startsWith(prefix.toLowerCase()))
    .map(([path, url]) => {
      // Extract the filename from the full path.
      const filename = path.split("/").pop() || "";
      // Create a clean name without the file extension.
      return { path: url, name: filename.replace(/\.[^.]+$/, "") };
    });
  return items;
}