/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Remove `domains` and use remotePatterns instead
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com",
        port: "",
        pathname: "/api/**",
      },
    ],
    dangerouslyAllowSVG: true, // enable SVG loading for remote images
  },
};

export default nextConfig;
