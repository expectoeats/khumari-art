// In-memory artworks cache for client side to prevent parallel duplicate fetches

let cache = null;
let inflightPromise = null;
let cacheTime = 0;
const CACHE_TTL = 2 * 60 * 1000; // 2 minutes

export async function getCachedArtworks() {
  const now = Date.now();
  if (cache && now - cacheTime < CACHE_TTL) {
    return cache;
  }

  if (inflightPromise) {
    return inflightPromise;
  }

  inflightPromise = fetch("/api/artworks?light=1")
    .then((res) => (res.ok ? res.json() : { artworks: [] }))
    .then((data) => {
      cache = data.artworks || [];
      cacheTime = Date.now();
      inflightPromise = null;
      return cache;
    })
    .catch((err) => {
      inflightPromise = null;
      return cache || [];
    });

  return inflightPromise;
}

export function clearArtworksCache() {
  cache = null;
  cacheTime = 0;
}
