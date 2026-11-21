import Link from "next/link";
import type { Metadata } from "next";
import { ArrowDown, ArrowRight, ArrowUpRight, Boxes, PackageCheck, Phone, RefreshCw, Truck, Warehouse } from "lucide-react";
import { HeroBackground, PhotoFrame, Reveal, type FramePhoto } from "./components";

export const metadata: Metadata = {
  title: "Transport Godown in Neemrana | Bhagwan Warehousing",
  description: "Short-term and transit cargo storage in a 5000 sq. ft. RCC warehouse near Tata RC Motors on NH 48, Neemrana. Call or WhatsApp Bhagwan Warehousing & Dispatch.",
};

const services = [
  { name: "Short-Term Storage (1–7 Days)", detail: "A practical place for cargo between pickup, delivery, and onward dispatch.", icon: PackageCheck },
  { name: "Transit Cargo Storage", detail: "Hold goods in Neemrana while coordinating the next part of the transport route.", icon: Boxes },
  { name: "Loading & Unloading", detail: "Arrange cargo handling at the warehouse as part of your transfer or storage requirement.", icon: Truck },
  { name: "Truck-to-Truck Transfer", detail: "Coordinate a direct cargo transfer between trucks at the warehouse.", icon: RefreshCw },
  { name: "Temporary Godown Facility", detail: "Use short-term warehouse space when your transport operation needs a temporary stop.", icon: Warehouse },
];

const facilityPhotos: FramePhoto[] = [
  { src: "/warehouse-photos/truck-at-warehouse.jpeg", alt: "Truck at the Bhagwan Warehousing & Dispatch loading bay with the company sign", caption: "Loading bay · Bhagwan signage" },
  { src: "/warehouse-photos/warehouse-exterior.jpeg", alt: "Bhagwan Warehousing & Dispatch warehouse exterior in Neemrana at dusk", caption: "Warehouse exterior · Neemrana" },
  { src: "/warehouse-photos/warehouse-yard.jpeg", alt: "Open yard in front of the warehouse with trucks at the building", caption: "Warehouse yard" },
  { src: "/warehouse-photos/trucks-in-yard.jpeg", alt: "Trucks parked in the warehouse yard with hills behind", caption: "Trucks in the yard" },
  { src: "/warehouse-photos/pallet-jack-and-trolley.jpeg", alt: "Hand pallet jack and drum trolley used for cargo handling", caption: "Handling equipment · pallet jack & drum trolley" },
  { src: "/warehouse-photos/cctv-camera.jpeg", alt: "CCTV camera mounted on the warehouse building", caption: "CCTV camera on site" },
];

export default function Home() {
  return <>
    <section className="hero" aria-labelledby="home-title">
      <HeroBackground />
      <div className="hero-overlay" aria-hidden="true" />
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-copy">
        <Reveal className="hero-content">
          <p className="hero-kicker"><span /> Bhagwan Warehousing &amp; Dispatch <span className="kicker-divider">/</span> Neemrana, Rajasthan</p>
          <h1 id="home-title">Transport godown <span>in Neemrana</span></h1>
          <p className="hero-lede">Short-term cargo storage near NH 48.</p>
          <p className="hero-text">A 5000 sq. ft. RCC warehouse for transporters, truck operators and logistics businesses near Tata RC Motors.</p>
          <div className="hero-actions">
            <a className="button button-gold" href="tel:7688866933">Call now <span>76888 66933</span><ArrowUpRight size={17} aria-hidden="true" /></a>
            <a className="button button-glass" href="https://wa.me/917688866933" target="_blank" rel="noreferrer">Enquire on WhatsApp <ArrowUpRight size={17} aria-hidden="true" /></a>
          </div>
        </Reveal>
      </div>
      <div className="hero-bottomline"><span>5000 sq. ft. RCC warehouse</span><span>Near Tata RC Motors · NH 48</span><a href="#warehouse">Explore the facility <ArrowDown size={15} aria-hidden="true" /></a></div>
      <span className="hero-index" aria-hidden="true">01 <i /> NEEMRANA</span>
    </section>

    <section className="service-marquee" aria-label="Warehouse services"><div className="marquee-intro"><span className="section-index">01 / WHAT WE DO</span><p>Storage and handling<br />for the journey ahead.</p></div><div className="marquee-services">{services.slice(0, 3).map(({ name, icon: Icon }) => <div className="marquee-item" key={name}><Icon size={19} strokeWidth={1.6} aria-hidden="true" /><span>{name}</span></div>)}</div><Link className="round-link" href="/services" aria-label="View all services"><ArrowRight size={20} aria-hidden="true" /></Link></section>

    <section className="warehouse-showcase" id="warehouse">
      <div className="showcase-heading"><Reveal><p className="section-index">02 / THE WAREHOUSE</p><h2>Space for the<br /><em>in-between.</em></h2></Reveal><Reveal delay={100}><p className="showcase-copy">When a load needs to wait between pickup, delivery or onward dispatch, a practical local warehouse can help your operation stay on track.</p><Link className="text-link" href="/warehouse">Explore our warehouse <ArrowUpRight size={16} aria-hidden="true" /></Link></Reveal></div>
      <Reveal><PhotoFrame photos={facilityPhotos}>
        <div className="capacity-card"><span className="capacity-mark">BW</span><div><b>5000 sq. ft.</b><span>RCC warehouse · NH 48</span></div></div>
      </PhotoFrame></Reveal>
      <div className="warehouse-facts"><div><span>Structure</span><b>RCC warehouse</b></div><div><span>Facility size</span><b>5000 sq. ft.</b></div><div><span>Location</span><b>Near NH 48, Neemrana</b></div></div>
    </section>

    <section className="services-section" id="services">
      <div className="services-heading"><Reveal><p className="section-index">03 / SERVICES</p><h2>Move cargo<br /><em>with less friction.</em></h2></Reveal><Reveal delay={100}><p>Flexible storage and cargo handling options for transporters, truck operators and logistics businesses.</p><Link className="text-link" href="/services">See service details <ArrowUpRight size={16} aria-hidden="true" /></Link></Reveal></div>
      <div className="service-cards">{services.map(({ name, detail, icon: Icon }, index) => <Reveal className="service-card-wrap" key={name} delay={index * 65}><article className="service-card"><span className="service-card-index">0{index + 1}</span><div className="service-icon"><Icon size={22} strokeWidth={1.6} aria-hidden="true" /></div><h3>{name}</h3><p>{detail}</p><a href="tel:7688866933" aria-label={`Call to ask about ${name}`}><ArrowUpRight size={18} aria-hidden="true" /></a></article></Reveal>)}<Reveal className="service-card-wrap" delay={services.length * 65}><a className="service-card service-card-cta" href="tel:7688866933"><span className="service-card-index">06</span><div className="service-icon"><Phone size={22} strokeWidth={1.6} aria-hidden="true" /></div><h3>Not sure which service fits?</h3><p>Tell us your cargo and timing, and we will discuss what suits your requirement.</p><span className="cta-call">Call 76888 66933 <ArrowUpRight size={17} aria-hidden="true" /></span></a></Reveal></div>
    </section>

    <section className="route-section" id="location">
      <div className="route-copy"><Reveal><p className="section-index">04 / LOCATION</p><h2>A useful stop<br />on the <em>Neemrana</em><br />corridor.</h2><p className="route-address">Near Tata RC Motors<br />NH 48 · Neemrana, Rajasthan</p><a className="button button-gold" href="https://www.google.com/maps/search/?api=1&query=Tata+RC+Motors+Neemrana+Rajasthan" target="_blank" rel="noreferrer">Open Google Maps <ArrowUpRight size={17} aria-hidden="true" /></a></Reveal></div>
      <Reveal className="route-map"><iframe title="Map showing Tata RC Motors, Neemrana" src="https://maps.google.com/maps?q=Tata%20RC%20Motors%2C%20Neemrana%2C%20Rajasthan&t=&z=14&ie=UTF8&iwloc=&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></Reveal>
      <div className="route-stamp" aria-hidden="true">NH<br /><b>48</b></div>
    </section>

    <section className="contact-band" id="contact"><Reveal className="contact-band-inner"><div><p className="section-index">05 / LET’S TALK LOGISTICS</p><h2>Need space for<br /><em>the next handover?</em></h2></div><div className="contact-band-actions"><p>Tell us about your cargo and timing. Call directly or send a WhatsApp enquiry.</p><a className="button button-gold" href="tel:7688866933">Call now · 76888 66933 <ArrowUpRight size={17} aria-hidden="true" /></a><a className="contact-whatsapp" href="https://wa.me/917688866933" target="_blank" rel="noreferrer">Enquire on WhatsApp <ArrowUpRight size={16} aria-hidden="true" /></a></div></Reveal></section>
  </>;
}
