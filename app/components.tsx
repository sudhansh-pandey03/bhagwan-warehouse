"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Boxes, ChevronLeft, ChevronRight, House, MapPin, Menu, MessageCircle, Phone, Warehouse, X } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties, type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { ServicePartner } from "@/components/home/service-partner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";

const phone = "7688866933";
const pages = [
  { label: "Home", href: "/", icon: House, motion: "bounce" },
  { label: "Our Warehouse", href: "/warehouse", icon: Warehouse, motion: "pop" },
  { label: "Our Services", href: "/services", icon: Boxes, motion: "wiggle" },
  { label: "Location", href: "/location", icon: MapPin, motion: "drop" },
  { label: "Contact Us", href: "/contact", icon: MessageCircle, motion: "wiggle" },
] as const;

export function SiteHeader() {
  const path = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [openOnPath, setOpenOnPath] = useState<string | null>(null);
  const menuOpen = openOnPath === path;
  const setMenuOpen = (open: boolean) => setOpenOnPath(open ? path : null);
  const isHome = path === "/";

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 32);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpenOnPath(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return <div className="site-header" data-home={isHome} data-scrolled={scrolled} data-open={menuOpen}>
    <div className="topline"><span>Near Tata RC Motors · Neemrana, Rajasthan</span><span>Warehouse enquiries <a href={`tel:${phone}`}>+91 {phone}</a></span></div>
    <header className="header">
      <Link className="brand nav-brand" href="/" aria-label="Bhagwan Warehousing home">
        <span className="brand-badge" aria-hidden="true"><span className="brand-ping" /><span className="brand-mark">BW</span></span>
        <span className="brand-text"><b>Bhagwan</b><small>Warehousing &amp; Dispatch</small></span>
      </Link>
      <nav className={menuOpen ? "main-nav is-open" : "main-nav"} aria-label="Main navigation" id="main-navigation">
        {pages.map(({ label, href, icon: Icon, motion }, index) => <Link key={href} href={href} style={{ "--i": index } as CSSProperties} aria-current={path === href ? "page" : undefined}>
          <span className="nav-icon" data-motion={motion}><Icon size={16} strokeWidth={1.9} aria-hidden="true" /></span><span>{label}</span>
        </Link>)}
      </nav>
      <ServicePartner />
      <a className="header-call" href={`tel:${phone}`}><span className="call-icon"><Phone size={15} strokeWidth={2.2} aria-hidden="true" /></span><span className="call-label">Call now</span></a>
      <button className="menu-toggle" type="button" aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"} aria-expanded={menuOpen} aria-controls="main-navigation" onClick={() => setMenuOpen(!menuOpen)}>
        <Menu className="menu-icon menu-icon-open" size={21} aria-hidden="true" /><X className="menu-icon menu-icon-close" size={21} aria-hidden="true" />
      </button>
    </header>
  </div>;
}

export function HeroBackground() {
  const image = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotion.matches) return;
    const onScroll = () => image.current?.style.setProperty("--parallax", `${Math.min(window.scrollY * 0.1, 64)}px`);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return <>
    <picture className="hero-background">
      <source media="(max-width: 760px)" srcSet="/warehouse-photos/truck-at-warehouse.jpeg" />
      <Image ref={image} className="hero-photo" src="/assets/neemrana-warehouse-dusk.png" alt="" fill priority sizes="100vw" />
    </picture>
    <div className="truck-arrival" aria-hidden="true">
      <picture>
        <source media="(min-width: 761px)" srcSet="/warehouse-photos/white-truck-cutout.webp" />
        <Image src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" alt="" width={1609} height={843} priority unoptimized />
      </picture>
      <span className="headlight-glow headlight-left" />
      <span className="headlight-glow headlight-right" />
    </div>
  </>;
}

export type FramePhoto = { src: string; alt: string; caption: string };

/** One shared frame that cycles through facility photos: crossfade, slow zoom, arrows, dots, swipe and arrow keys. */
export function PhotoFrame({ photos, interval = 5200, children }: { photos: FramePhoto[]; interval?: number; children?: ReactNode }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);
  const count = photos.length;
  const go = (step: number) => setIndex((i) => (i + step + count) % count);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % count), interval);
    return () => window.clearTimeout(id);
  }, [index, paused, count, interval]);

  const current = photos[index];
  return <div className="photo-stage" role="region" aria-roledescription="carousel" aria-label="Photos of the Bhagwan Warehousing facility" data-paused={paused}
    style={{ "--interval": `${interval}ms` } as CSSProperties}
    onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
    onFocus={() => setPaused(true)} onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPaused(false); }}
    onKeyDown={(e) => { if (e.key === "ArrowLeft") go(-1); if (e.key === "ArrowRight") go(1); }}
    onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
    onTouchEnd={(e) => { if (touchX.current === null) return; const dx = e.changedTouches[0].clientX - touchX.current; if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1); touchX.current = null; }}>
    <div className="photo-stage-frame">
      {photos.map((photo, i) => <figure key={photo.src} className="photo-slide" data-active={i === index} aria-hidden={i !== index}>
        <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 760px) 100vw, 1240px" priority={i === 0} />
      </figure>)}
      <div className="photo-stage-shade" aria-hidden="true" />
      {children}
      <button className="photo-nav photo-prev" type="button" aria-label="Previous photo" onClick={() => go(-1)}><ChevronLeft size={22} aria-hidden="true" /></button>
      <button className="photo-nav photo-next" type="button" aria-label="Next photo" onClick={() => go(1)}><ChevronRight size={22} aria-hidden="true" /></button>
      <div className="photo-stage-bar">
        <p className="photo-stage-caption" aria-live="polite"><span>{String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}</span>{current.caption}</p>
        <div className="photo-dots">{photos.map((photo, i) => <button key={photo.src} type="button" className="photo-dot" aria-label={`Show photo ${i + 1}: ${photo.caption}`} aria-current={i === index ? "true" : undefined} onClick={() => setIndex(i)}><span><i /></span></button>)}</div>
      </div>
    </div>
  </div>;
}

export function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node || !("IntersectionObserver" in window)) { setVisible(true); return; }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    observer.observe(node);
    setReady(true);
    return () => observer.disconnect();
  }, []);
  const style = { "--reveal-delay": `${delay}ms` } as CSSProperties;
  return <div ref={ref} style={style} className={`reveal${ready ? " reveal-ready" : ""}${visible ? " is-visible" : ""} ${className}`}>{children}</div>;
}

export function SiteFooter() {
  return <footer className="footer"><div className="footer-brand"><Link className="brand brand-light" href="/"><span className="brand-mark">BW</span><span><b>Bhagwan</b><small>Warehousing &amp; Dispatch</small></span></Link><p>Short-term storage and cargo handling in Neemrana, Rajasthan.</p></div><div className="footer-links"><b>Contact</b><a href={`tel:${phone}`}>+91 {phone}</a><a href="https://wa.me/917688866933" target="_blank" rel="noreferrer">WhatsApp us</a></div><div className="footer-links"><b>Find us</b><span>Near Tata RC Motors, NH 48</span><span>Neemrana, Rajasthan</span><Link href="/location">View the location</Link></div><small className="copyright">© 2026 Bhagwan Warehousing &amp; Dispatch</small></footer>;
}

export function WhatsAppForm() {
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const msg = `Hello, I have a warehouse enquiry.\nName: ${data.get("name")}\nPhone: ${data.get("phone")}\nRequirement: ${data.get("requirement")}\nCargo / notes: ${data.get("notes") || "Not provided"}`;
    window.open(`https://wa.me/91${phone}?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
  }
  return <form className="enquiry-form" onSubmit={submit}>
    <Label htmlFor="enquiry-name">Your name<Input id="enquiry-name" className="form-control" name="name" required placeholder="Name" /></Label>
    <Label htmlFor="enquiry-phone">Phone number<Input id="enquiry-phone" className="form-control" name="phone" required type="tel" placeholder="Your contact number" /></Label>
    <Label htmlFor="enquiry-requirement">What do you need?<NativeSelect className="form-select" id="enquiry-requirement" name="requirement" required defaultValue=""><NativeSelectOption value="" disabled>Select a service</NativeSelectOption><NativeSelectOption>Short-term storage (1–7 days)</NativeSelectOption><NativeSelectOption>Transit cargo storage</NativeSelectOption><NativeSelectOption>Loading &amp; unloading</NativeSelectOption><NativeSelectOption>Truck-to-truck transfer</NativeSelectOption><NativeSelectOption>Temporary godown facility</NativeSelectOption><NativeSelectOption>Other enquiry</NativeSelectOption></NativeSelect></Label>
    <Label htmlFor="enquiry-notes">Details (optional)<Textarea id="enquiry-notes" className="form-control" name="notes" rows={3} placeholder="Cargo type, dates, or truck details" /></Label>
    <Button className="button button-gold w-full justify-between" type="submit">Send enquiry on WhatsApp <ArrowUpRight size={17} aria-hidden="true" /></Button>
    <small>Opens WhatsApp with your enquiry ready to send.</small>
  </form>;
}
