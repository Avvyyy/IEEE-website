import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Placeholder content images are SVGs generated locally; swap in real
    // photos (JPG/PNG) before launch and this can be removed.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
  },
};

export default nextConfig;
