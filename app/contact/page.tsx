import type { Metadata } from "next";
import { ArrowUpRight, MapPin, MessageCircle, Phone } from "lucide-react";
import { Reveal, WhatsAppForm } from "../components";

export const metadata: Metadata = { title: "Contact Bhagwan Warehousing | Neemrana Enquiries", description: "Contact Bhagwan Warehousing & Dispatch in Neemrana. Call or WhatsApp 7688866933 for short-term cargo storage and warehouse enquiries." };

export default function Contact() {
  return <>
    <section className="inner-hero"><p className="eyebrow">04 / CONTACT US</p><h1>Let’s talk<br /><em>logistics.</em></h1><p>Share your cargo and timing requirement with Bhagwan Warehousing &amp; Dispatch.</p></section>
    <section className="contact-layout">
      <Reveal className="contact-direct"><p className="section-index">QUICK ENQUIRY</p><h2>Speak directly<br />with our team.</h2><p>For space availability, cargo handling or directions, call or WhatsApp us.</p><a className="direct-number" href="tel:7688866933"><span><Phone size={19} aria-hidden="true" /> +91 76888 66933</span><ArrowUpRight size={19} aria-hidden="true" /></a><a className="button button-green" href="https://wa.me/917688866933" target="_blank" rel="noreferrer"><MessageCircle size={17} aria-hidden="true" /> WhatsApp us <ArrowUpRight size={16} aria-hidden="true" /></a><div className="address-block"><span className="section-index"><MapPin size={15} aria-hidden="true" /> ADDRESS</span><p>Near Tata RC Motors, NH 48<br />Neemrana, Rajasthan</p></div></Reveal>
      <Reveal className="form-card" delay={100}><h2>Send an enquiry</h2><p>We will open WhatsApp with your details ready to send.</p><WhatsAppForm /></Reveal>
    </section>
  </>;
}
