import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "HTI Digital Operations — PoC Demo",
    short_name: "HTI PoC",
    description: "Middleware monitoring demo untuk sistem-sistem HTI (GATES/ERP, WMS, Jpayroll)",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#b91c1c",
    icons: [
      { src: "/icon", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
