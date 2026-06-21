import { notFound, permanentRedirect } from "next/navigation";

const serviceAnchors: Record<string, string> = {
  "business-websites": "business-websites",
  "web-apps-dashboards": "web-apps-dashboards",
  "ecommerce-websites": "ecommerce",
  ecommerce: "ecommerce",
  "ai-automation": "ai-automation",
};

export function generateStaticParams() {
  return Object.keys(serviceAnchors).map((slug) => ({ slug }));
}

export default async function LegacyServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const anchor = serviceAnchors[slug];

  if (!anchor) {
    notFound();
  }

  permanentRedirect(`/services#${anchor}`);
}
