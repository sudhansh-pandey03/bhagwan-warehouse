/**
 * Instant replies from the dispatch desk assistant. They only repeat facts already on
 * the website; anything needing a person (rates, timings, bookings) points to the team.
 * Edit the text here to change what the assistant says.
 */
export type DeskReply = { text: string; action?: { label: string; href: string } };

const PHONE = "76888 66933";
const MAPS = "https://www.google.com/maps/search/?api=1&query=Tata+RC+Motors+Neemrana+Rajasthan";

const RULES: { match: RegExp; reply: DeskReply }[] = [
  { match: /\b(rate|rates|price|cost|charge|charges|kitna|kiraya|rent|quote)\b/i,
    reply: { text: `Rates depend on the cargo, the space it needs and the number of days. Share those here, then tap "Send to team" — or call ${PHONE} for a quote.`, action: { label: `Call ${PHONE}`, href: "tel:7688866933" } } },
  { match: /\b(where|location|address|map|maps|directions?|kahan|kaha)\b/i,
    reply: { text: "We are near Tata RC Motors on NH 48, Neemrana, Rajasthan.", action: { label: "Open Google Maps", href: MAPS } } },
  { match: /\b(time|timing|timings|hours|open|close|kab)\b/i,
    reply: { text: `For timings and availability on your date, please check with the team directly on ${PHONE}.`, action: { label: `Call ${PHONE}`, href: "tel:7688866933" } } },
  { match: /\b(cctv|camera|safe|safety|secure|security)\b/i,
    reply: { text: "The warehouse is an RCC building with a CCTV camera on site." } },
  { match: /\b(transfer|truck.to.truck|cross.?dock)\b/i,
    reply: { text: "We can coordinate a direct truck-to-truck transfer at the warehouse. Tell me the vehicle types and when they arrive." } },
  { match: /\b(load|loading|unload|unloading|equipment|pallet|trolley|drum|drums|labour|labor|handling)\b/i,
    reply: { text: "Cargo handling at the bay can be arranged. On site we have a hand pallet jack and a drum trolley. What are you moving, and how much of it?" } },
  { match: /\b(space|size|big|area|sq|sqft|capacity|available|availability)\b/i,
    reply: { text: "The godown is a 5000 sq. ft. RCC warehouse. Share your cargo size and dates so the team can confirm space." } },
  { match: /\b(day|days|week|duration|long|din)\b/i,
    reply: { text: "Short-term storage is for about 1–7 days, ideal between pickup, delivery and onward dispatch. Which dates do you need?" } },
  { match: /\b(team|person|human|call me|callback|talk)\b/i,
    reply: { text: `Sure. Tap "Send to team" at the top to share this chat on WhatsApp, or call ${PHONE}.`, action: { label: `Call ${PHONE}`, href: "tel:7688866933" } } },
  { match: /\b(hi|hello|hey|namaste|namaskar|hii+)\b/i,
    reply: { text: "Namaste! Tell me about your cargo — what it is, how much, and when it arrives." } },
];

const FALLBACK: DeskReply = { text: `Noted. When you're ready, tap "Send to team" to share this chat on WhatsApp, and the team will reply there. You can also call ${PHONE}.` };

export function deskReply(message: string): DeskReply {
  return RULES.find((rule) => rule.match.test(message))?.reply ?? FALLBACK;
}
