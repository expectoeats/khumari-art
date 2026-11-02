/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // No remote (http/https) images are used anywhere on the site — all artwork
    // images are local (/public/art, /public/uploads). Keeping remotePatterns
    // wide open ("**") would let anyone proxy arbitrary external URLs through
    // our image optimizer, so it is intentionally removed.
  },
};

module.exports = nextConfig;
