import type { Metadata } from "next";
import "./globals.css";
import { SiteFooter, SiteHeader } from "./components";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MessageCircle, Phone } from "lucide-react";
import { LogisticsLoader } from "./logistics-loader";

export const metadata: Metadata = {
  title: { default: "Bhagwan Warehousing & Dispatch | Neemrana", template: "%s | Bhagwan Warehousing" },
  description: "5000 sq. ft. RCC warehouse for short-term and transit cargo storage near NH 48, Neemrana, Rajasthan. Call Bhagwan Warehousing & Dispatch.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className="h-full antialiased"><body className="min-h-full flex flex-col"><LogisticsLoader /><TooltipProvider><SiteHeader /><main>{children}</main><SiteFooter /><div className="mobile-actions"><a href="tel:7688866933"><Phone size={17} aria-hidden="true" />Call</a><a href="https://wa.me/917688866933" target="_blank" rel="noreferrer"><MessageCircle size={17} aria-hidden="true" />WhatsApp</a></div></TooltipProvider></body></html>;
}
