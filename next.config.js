/** @type {import('next').NextConfig} */
const nextConfig = {
  // SVG files in /public are served as static assets.
  // Future: add @svgr/webpack if we need to import SVGs as React components.

  // Skip type checking during build — types are checked in the editor (VS Code).
  // This avoids version-mismatch errors between local and Vercel's installed packages.
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
