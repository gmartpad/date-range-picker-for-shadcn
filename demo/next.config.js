/** @type {import('next').NextConfig} */
const path = require('path')

const nextConfig = {
  reactStrictMode: true,
  // Set the output file tracing root to the demo directory
  // This prevents Next.js from detecting the parent package-lock.json
  outputFileTracingRoot: path.join(__dirname),
}

module.exports = nextConfig

