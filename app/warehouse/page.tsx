import Image from "next/image";
import type { Metadata } from "next";
import { ArrowUpRight, Check } from "lucide-react";
import { Reveal } from "../components";

export const metadata: Metadata = {
  title: "Our Warehouse in Neemrana | 1500 Sq. Ft. RCC",
  description: "Learn about Bhagwan Warehousing & Dispatch's 1500 sq. ft. RCC warehouse near Tata RC Motors on NH 48 in Neemrana, Rajasthan.",
};

export default function Warehouse() {
  return <>
    <section className="inner-hero"><p className="eyebrow">01 / OUR WAREHOUSE</p><h1>A dependable place<br /><em>between destinations.</em></h1><p>A 1500 sq. ft. RCC warehouse for short-term cargo storage in Neemrana.</p></section>
    <section className="content-section two-col">
      <Reveal className="facility-photo"><Image src="/warehouse-photos/warehouse-exterior.jpeg" alt="Bhagwan Warehousing & Dispatch warehouse exterior near Neemrana" width={1200} height={900} sizes="(max-width: 760px) 100vw, 50vw" /></Reveal>
      <Reveal className="detail-copy" delay={120}><p className="section-index">THE FACILITY</p><h2>Practical storage<br />close to NH 48.</h2><p>Bhagwan Warehousing &amp; Dispatch is located near Tata RC Motors, NH 48, Neemrana, Rajasthan. The facility is a 1500 sq. ft. RCC warehouse for transport and logistics businesses seeking temporary storage.</p><p>Share your cargo and timing requirements with us to discuss suitability and availability.</p><a className="button button-gold" href="tel:7688866933">Call to discuss availability <ArrowUpRight size={17} aria-hidden="true" /></a></Reveal>
    </section>
    <section className="photo-section"><div className="photo-heading"><div><p className="eyebrow">ON-SITE PHOTOGRAPH</p><h2>A closer look at the facility</h2></div><p>Photograph supplied by Bhagwan Warehousing &amp; Dispatch.</p></div><Reveal className="warehouse-detail-photo"><Image src="/warehouse-photos/truck-at-warehouse.jpeg" alt="Truck at Bhagwan Warehousing & Dispatch" width={1500} height={850} sizes="100vw" /></Reveal></section>
    <section className="dispatch-visual"><div className="dispatch-visual-copy"><p className="section-index">DISPATCH, IN MOTION</p><h2>Ready for the<br /><em>next handover.</em></h2><p>A campaign visual of cargo arriving at a warehouse loading bay, created for Bhagwan Warehousing &amp; Dispatch.</p></div><Reveal className="dispatch-campaign-image"><Image src="/assets/warehouse-dispatch-campaign.png" alt="Illustrative campaign scene of a cargo truck at a lit warehouse loading bay" width={1664} height={936} sizes="(max-width: 760px) 100vw, 58vw" /></Reveal></section>
    <section className="facts-row"><div><small>Warehouse size</small><b>1500 sq. ft.</b></div><div><small>Structure</small><b>RCC warehouse</b></div><div><small>Location</small><b>Neemrana, Rajasthan</b></div></section>
    <section className="facility-points"><div><Check size={19} aria-hidden="true" /><span>Short-term and transit cargo storage enquiries</span></div><div><Check size={19} aria-hidden="true" /><span>Near Tata RC Motors on NH 48</span></div><div><Check size={19} aria-hidden="true" /><span>For transporters, truck operators and logistics businesses</span></div></section>
  </>;
}
