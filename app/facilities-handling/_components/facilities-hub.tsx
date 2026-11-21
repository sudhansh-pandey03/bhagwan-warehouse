"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Cctv, Forklift, LogOut, MapPin, MessageCircle, Ruler } from "lucide-react";
import { PartnerGate } from "./partner-gate";
import { firstName, signOutPartner } from "./partner-session";
import { TOPICS } from "./facility-topics";

const FACTS = [
  { icon: Ruler, label: "Space", value: "5000 sq. ft. RCC" },
  { icon: MapPin, label: "Location", value: "NH 48 · Neemrana" },
  { icon: Forklift, label: "Equipment", value: "Pallet jack · drum trolley" },
  { icon: Cctv, label: "Security", value: "CCTV on site" },
];

/** Facilities Handling home for a signed-in Service Partner. */
export function FacilitiesHub() {
  const router = useRouter();
  return <PartnerGate>{(partner) => <div className="fh-shell">
    <div className="fh-wrap">
      <header className="fh-hero">
        <div>
          <p className="fh-kicker"><span className="fh-live" aria-hidden="true" /> Partner workspace</p>
          <h1>Namaste, {firstName(partner)}.<br /><em>Facilities Handling.</em></h1>
          <p className="fh-lede">Pick what you need for your cargo and start a chat with the Bhagwan dispatch desk.</p>
        </div>
        <div className="fh-hero-actions">
          <Link className="fh-btn fh-btn-gold" href="/facilities-handling/chat"><MessageCircle size={17} aria-hidden="true" /> Open chat</Link>
          <button type="button" className="fh-btn fh-btn-glass" onClick={() => { signOutPartner(); router.push("/"); }}><LogOut size={16} aria-hidden="true" /> Sign out</button>
        </div>
      </header>

      <ul className="fh-facts" aria-label="Facility at a glance">
        {FACTS.map(({ icon: Icon, label, value }) => <li key={label}><Icon size={19} strokeWidth={1.7} aria-hidden="true" /><span>{label}</span><b>{value}</b></li>)}
      </ul>

      <section aria-labelledby="fh-services-title">
        <h2 id="fh-services-title" className="fh-section-title">What do you need handled?</h2>
        <div className="fh-grid">
          {TOPICS.map(({ id, name, short, detail, icon: Icon }, index) => <Link key={id} className="fh-card" href={`/facilities-handling/chat?topic=${id}`} style={{ animationDelay: `${index * 60}ms` }}>
            <span className="fh-card-icon" aria-hidden="true"><Icon size={22} strokeWidth={1.7} /></span>
            <span className="fh-card-tag">{short}</span>
            <h3>{name}</h3>
            <p>{detail}</p>
            <span className="fh-card-go">Start chat <ArrowUpRight size={16} aria-hidden="true" /></span>
          </Link>)}
        </div>
      </section>
    </div>
  </div>}</PartnerGate>;
}
