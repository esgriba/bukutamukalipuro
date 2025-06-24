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
  },
  // Add other Next.js config options here
};

module.exports = nextConfig;
