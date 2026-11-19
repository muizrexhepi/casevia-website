import type { MetadataRoute } from "next";
export function GET() {
  const manifest: MetadataRoute.Manifest = {
    id: "/crm",
    name: "Muiz Rexhepi · Workspace",
    short_name: "Muiz CRM",
    description: "Your private sales workspace",
    start_url: "/crm",
    scope: "/crm",
    display: "standalone",
    background_color: "#f7f7f5",
    theme_color: "#f7f7f5",
    icons: [
      {
        src: "/crm-assets/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/crm-assets/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
  return Response.json(manifest, {
    headers: {
      "Content-Type": "application/manifest+json",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
