import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { SiteFooterCta } from "@/components/site-footer-cta";
export default function PublicLayout({children}:{children:React.ReactNode}){return <><a href="#main-content" className="sr-only z-[100] focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:rounded-md focus:bg-primary focus:px-4 focus:py-3 focus:text-primary-foreground">Skip to content</a><Navbar/><main id="main-content" className="flex-1">{children}</main><SiteFooterCta/><Footer/></>;}
