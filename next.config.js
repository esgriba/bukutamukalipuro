/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["ujjxluxutvyvzjwqrmxv.supabase.co"],
    // Add future configurations for images here
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ujjxluxutvyvzjwqrmxv.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  }, // Disable ESLint during builds (untuk menghindari error build di Vercel)
  eslint: {
    // Warning: Hanya mengabaikan error selama build
    ignoreDuringBuilds: true,
  },
  // Disable TypeScript type checking during builds
  typescript: {
    // Warning: Hanya mengabaikan error tipe selama build
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
