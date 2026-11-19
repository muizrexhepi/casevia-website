import type { Metadata, Viewport } from "next";
import { ConvexAuthNextjsServerProvider } from "@/lib/crm/auth-server";
import "./crm.css";
export const metadata: Metadata = {
  title: { absolute: "Workspace · Muiz Rexhepi" },
  description: "Private sales workspace",
  robots: { index: false, follow: false },
  manifest: "/crm/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Muiz CRM", statusBarStyle: "default" },
  icons: { icon: "/crm-assets/icon.svg", apple: "/crm-assets/icon-192.png" },
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f5f5f3",
};
export default function CrmLayout({ children }: { children: React.ReactNode }) {
  if (!process.env.NEXT_PUBLIC_CONVEX_URL)
    return (
      <div className="crm-root crm-signin">
        <div className="crm-signin-card">
          <span className="crm-brand-mark">m.</span>
          <h1>Connect your workspace</h1>
          <p>
            Set NEXT_PUBLIC_CONVEX_URL to your CRM development deployment. Your
            public website remains available.
          </p>
        </div>
      </div>
    );
  return (
    <ConvexAuthNextjsServerProvider>{children}</ConvexAuthNextjsServerProvider>
  );
}
