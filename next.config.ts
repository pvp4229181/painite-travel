import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      // Images uploaded through the admin
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
  serverExternalPackages: ["mongoose", "nodemailer"],
  // URLs from the previous version of painitetravels.com that now live elsewhere.
  async redirects() {
    return [
      { source: "/journal/article/:slug", destination: "/journal/:slug", permanent: true },
      { source: "/privacy-policy", destination: "/privacy", permanent: true },
      { source: "/terms-and-conditions", destination: "/terms", permanent: true },
      { source: "/contact-us", destination: "/plan-your-journey", permanent: true },
    ];
  },
};

export default nextConfig;
