import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Boxes, PackageCheck, RefreshCw, Truck, Warehouse } from "lucide-react";
import { Reveal } from "../components";

export const metadata: Metadata = { title: "Warehouse & Cargo Handling Services | Neemrana", description: "Short-term storage, transit cargo storage, loading and unloading, truck-to-truck transfer and temporary godown facility in Neemrana. Contact Bhagwan Warehousing." };

const items = [
  { name: "Short-Term Storage (1–7 Days)", detail: "Keep goods at the warehouse for a short window between collection and onward dispatch.", icon: PackageCheck },
  { name: "Transit Cargo Storage", detail: "A temporary holding point for cargo travelling through the Neemrana corridor.", icon: Boxes },
  { name: "Loading & Unloading", detail: "Coordinate loading or unloading support for your cargo movement.", icon: Truck },
  { name: "Truck-to-Truck Transfer", detail: "Move cargo between trucks as part of a planned transfer.", icon: RefreshCw },
  { name: "Temporary Godown Facility", detail: "A temporary godown option when your operation needs space on the route.", icon: Warehouse },
];

const photos = [
  { src: "/warehouse-photos/warehouse-exterior.jpeg", alt: "Bhagwan Warehousing & Dispatch exterior near Neemrana", caption: "Warehouse entrance" },
  { src: "/warehouse-photos/truck-at-warehouse.jpeg", alt: "Transport truck beside the warehouse", caption: "Truck at the facility" },
  { src: "/warehouse-photos/warehouse-yard.jpeg", alt: "Truck yard at Bhagwan Warehousing & Dispatch", caption: "Warehouse yard" },
  { src: "/warehouse-photos/pallet-jack-and-trolley.jpeg", alt: "Hand pallet jack and drum trolley used for cargo handling", caption: "Handling equipment" },
];

export default function Services() {
  return <>
    <section className="inner-hero"><p className="eyebrow">02 / OUR SERVICES</p><h1>Support for every<br /><em>handover.</em></h1><p>Flexible cargo handling options for transporters and logistics teams moving through Neemrana.</p></section>
    <section className="photo-section"><div className="photo-heading"><div><p className="eyebrow">ON-SITE PHOTOGRAPHS</p><h2>Our Neemrana facility</h2></div><p>Photos supplied by Bhagwan Warehousing &amp; Dispatch.</p></div><div className="photo-grid">{photos.map((photo, index) => <Reveal key={photo.src} delay={index * 50}><figure><Image src={photo.src} alt={photo.alt} width={900} height={650} sizes="(max-width: 700px) 50vw, (max-width: 1000px) 50vw, 25vw" /><figcaption>{photo.caption}</figcaption></figure></Reveal>)}</div></section>
    <section className="service-list">{items.map(({ name, detail, icon: Icon }, index) => <Reveal key={name} delay={index * 45}><article><span className="service-number">0{index + 1}</span><span className="service-row-icon"><Icon size={20} strokeWidth={1.7} aria-hidden="true" /></span><h2>{name}</h2><p>{detail}</p><a href="tel:7688866933" aria-label={`Call to enquire about ${name}`}><ArrowUpRight size={18} aria-hidden="true" /></a></article></Reveal>)}</section>
    <section className="cta-band"><div><p className="section-index">HAVE A SPECIFIC REQUIREMENT?</p><h2>Tell us about<br />your cargo.</h2></div><div><p>Service suitability and availability depend on your cargo and timing. Call us and we will discuss your requirement.</p><Link className="button button-gold" href="/contact">Make an enquiry <ArrowUpRight size={17} aria-hidden="true" /></Link></div></section>
  </>;
}
