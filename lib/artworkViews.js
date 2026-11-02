// Shared helper to derive ordered multi-angle views from an artwork document.
// Works with both raw DB documents ({ images: [{src, alt, isPrimary}], src, image })
// and normalized client-side objects.

const DEFAULT_LABELS = [
  "Front View",
  "Texture Detail",
  "Profile & Frame",
  "In-Situ Room View",
];

/**
 * Returns an ordered array of { src, label } angle views for an artwork.
 * Primary image always comes first. Falls back to legacy src/image fields.
 */
export function angleViews(artwork) {
  if (!artwork) return [];

  const raw = Array.isArray(artwork.images) ? artwork.images : [];
  const valid = raw.filter(
    (img) => img && typeof img.src === "string" && img.src.trim()
  );

  // Primary angle first, preserve admin-defined order for the rest
  const ordered = [
    ...valid.filter((img) => img.isPrimary),
    ...valid.filter((img) => !img.isPrimary),
  ];

  const views = ordered.map((img, idx) => ({
    src: img.src,
    label: img.alt || img.label || DEFAULT_LABELS[idx % DEFAULT_LABELS.length],
  }));

  // Legacy single-image field (src or image) — include if not already covered
  const single =
    typeof artwork.src === "string" && artwork.src.trim()
      ? artwork.src
      : typeof artwork.image === "string" && artwork.image.trim()
        ? artwork.image
        : null;

  if (single && !views.some((v) => v.src === single)) {
    views.unshift({ src: single, label: "Front View" });
  }

  return views;
}

/**
 * Convenience: the primary (first) image src with placeholder fallback.
 * Use in card/list mappings so grids never receive an images[] object.
 */
export function primarySrc(artwork, fallback = "/art/placeholder.jpg") {
  return angleViews(artwork)[0]?.src || fallback;
}
