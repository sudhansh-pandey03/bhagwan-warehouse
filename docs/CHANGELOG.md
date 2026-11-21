# Changelog

## Mobile hero image · 2026-11-21

- `app/components.tsx`: removed the `<source media="(max-width: 760px)">` in `HeroBackground` that swapped the old `truck-at-warehouse.jpeg` in on phones. Mobile now uses the same optimized `neemrana-warehouse-dusk.png` as desktop (verified at 440×956).

## Published to GitHub for Vercel deploy · 2026-11-21

- Code pushed to the public repo `sudhansh-pandey03/bhagwan-warehouse`. Scanned for secrets first; none found.
- `.gitignore` now excludes `/.agents/`, `/.claude/`, `/.hallmark/` (local design tooling and screenshots).
- Production build passes (`next build`, Next 16.4.6). Required env on the host: `NEXT_PUBLIC_SITE_URL=https://www.bhagwantransport.com` (enables `sitemap.xml` entries and the robots sitemap line). Optional: `NEXT_PUBLIC_PARTNER_API_URL` (without it, partner requests go to WhatsApp).

## Intro loader stuck fix · 2026-11-21

- `app/logistics-loader.tsx`: the loader could stay on screen forever on first visit. The effect wrote the `bhagwan-intro-seen` sessionStorage flag before scheduling the close. Under React Strict Mode (dev), cleanup cancelled the timers and the second effect run saw the flag and returned early, so the loader never closed. The flag is now written only when the loader closes, and all timers (including the reduced-motion and fade-out ones) are tracked and cleared on cleanup.

## Facilities Handling pages + partner chat · 2026-11-18

- New route folder `app/facilities-handling/` with two pages: `/facilities-handling` (partner hub: greeting, facility facts, six handling topics) and `/facilities-handling/chat?topic=…` (chat UI: topic list, dispatch-desk conversation, typing indicator, starter prompts, Enter to send). All code and styles live in the private `_components/` folder; styles are `fh-` prefixed in `facilities.css` (dark navy, ice-blue glow, brand gold).
- After a successful Service Partner submission, the partner is saved to localStorage (`bw-partner`, `partner-session.ts`) and redirected to `/facilities-handling` after 2.2s (or immediately via the success button). While signed in, the navbar trigger becomes a "Hi, {first name}" link to the hub. The pages show a sign-in gate otherwise; the gate opens the existing dialog via a `bw:open-partner` window event. The hub has Sign out.
- Not real authentication: no server account; state is per-browser.
- Chat replies come from keyword rules in `desk-replies.ts` that repeat only facts already on the site; rates and timings defer to the phone number. "Send to team" opens WhatsApp with the partner's messages prefilled. Conversations persist per topic in localStorage (`bw-chat:{topic}`, last 200 messages).
- With `cacheComponents` on, the chat page reads `searchParams` inside `<Suspense>` to avoid the blocking-route prerender error.
- Both pages are `noindex`.

## Responsive fixes · 2026-11-17

- Audited all five pages at 375, 390, 430, 768, 1024 and 1440px: no horizontal scrolling at any width; navbar is a full horizontal bar at 961px and above and a compact logo + hamburger below.
- Root cause of "phone preview shows the old design": the running dev server had stopped picking up CSS changes and kept serving a stale stylesheet. The viewport meta tag and caching are correct, and there is no service worker. Restarting `npm run dev` clears it.
- Tablet (761–1020px): the service strip intro gets its own row, and service cards use two columns instead of three. At 900px and below, section headings, the closing call to action and the Services page CTA band stack into one column.
- Services page: the "Have a specific requirement?" band (`.cta-band`) had no styles at all; it now has a dark gradient band layout.
- Contact page: the form heading was white on the white card; the "What do you need?" select was clipped by shadcn's fixed `h-8` height plus the site's padding, and its wrapper did not fill the width. Controls now size by padding with a 46px minimum.

## Service Partner sign-in card · 2026-11-17

- Added a "Service Partner" button beside "Call now" in the navbar that opens a glass sign-in card (`components/home/`): full name, Gmail address, optional Indian mobile number, inline validation, focus trap, Escape and outside-click to close, scroll lock, loading spinner and an animated success state.
- It does not create an account or sign anyone in. `submitPartnerRequest` in `components/home/partner-api.ts` POSTs to `NEXT_PUBLIC_PARTNER_API_URL` when set; otherwise it opens WhatsApp with the details prefilled.
- "Terms & Privacy Policy" is plain text because those pages do not exist yet.
- `html { scrollbar-gutter: stable }` keeps the navbar from shifting when the card locks page scrolling.

## Sharper hero truck · 2026-11-17

- Replaced the hand-cut white truck with a supplied transparent PNG of a white truck, trimmed and mirrored to face its direction of travel, saved as `public/warehouse-photos/white-truck-cutout.webp` (1609×843). Same animation, size and position; headlight glows moved onto the new headlights.

## Bold premium home + one photo frame · 2026-11-17

- Replaced the two separate warehouse photos with one shared gallery frame (`PhotoFrame` in `app/components.tsx`): six real facility photos with crossfade, slow zoom, glass arrows, a caption bar, progress dots, autoplay every 5.2s (paused on hover or focus, off with reduced motion), swipe and arrow keys. The 1500 sq. ft. badge floats on the frame as a glass card.
- Added three supplied WhatsApp photos that were not used anywhere: `trucks-in-yard.jpeg`, `pallet-jack-and-trolley.jpeg`, `cctv-camera.jpeg`.
- Bold premium styling on the home page: dark navy/burgundy warehouse section, glass fact tiles, glass service cards with a gold shine on hover, navy icon tiles, a dark "Not sure which service fits?" call card filling the sixth grid slot, a gold-ringed map, and a glass panel for the closing call to action. Gold buttons sitewide get a shine sweep on hover.
- Fixed the Services page gallery: "Handling equipment" showed the promotional poster (`handling-equipment.jpeg`); it now shows the real pallet jack and trolley photo.
- Removed the old `.showcase-gallery`, `.photo-frame` and `.photo-caption` styles.

## Hero truck swap (correction) · 2026-11-17

- Reverted the full-scene hero from the previous entry. The original backgrounds, drive-in animation, suspension settle and parallax are back.
- Swapped only the animated truck: the decorated truck is replaced by a white truck cut out (and mirrored to face the direction of travel) from the supplied reference image, `public/warehouse-photos/white-truck-cutout.webp` (1190×708).
- Resized it to `min(45vw, 660px)` so it clears the headline and the vertical side label; headlight glows are repositioned onto the new truck.
- Removed `public/assets/hero-truck-dock.png`, which is no longer used.

## Home hero image swap · 2026-11-17

- Replaced the hero's decorated-truck cutout and both background photos with one supplied scene image (`public/assets/hero-truck-dock.png`): a truck at a warehouse loading dock.
- Kept the same arrival animation (2.65s, same easing and settle bounce), now applied to the whole scene. Headlight glows switch on at the same moment, placed over the new truck's headlights. Scroll parallax is unchanged.
- The scene keeps the image's 8:5 shape and covers the hero, so the glows line up at every screen size. On desktop it is shifted right so the truck sits beside the headline.
- The truck cutout is still used by the intro loader.

## Glass navigation · 2026-11-17

- Rebuilt the header as a floating frosted-glass pill on every page: dark glass over the hero, light cream glass after scrolling. The top info line remains on inner pages until scroll.
- Made the Bhagwan brand the bar's focal point: a gold BW badge with a pulsing ring, a periodic shine sweep, and a tilt on hover.
- Added an icon to each nav link with its own hover/focus animation (bounce, pop, wiggle, pin drop); the active page shows as a gold pill.
- The Call button's phone icon rings every few seconds and shakes on hover. The mobile menu is a frosted panel with staggered links and a menu/close icon morph; Escape closes it.
- Inner page heroes gained top padding because the header now floats over them. All motion respects reduced-motion settings.
- Note: write only the standard `backdrop-filter` property in CSS. The build's minifier keeps whichever of the prefixed/unprefixed pair comes last, so hand-writing `-webkit-backdrop-filter` after it removes the blur in Chrome.

## Premium visual redesign · 2026-11-15

- Reworked the homepage, shared navigation, warehouse showcase, service cards, route/location treatment, and contact surface using the requested beige, cream, dark maroon, burgundy, navy, gold, and white palette.
- Added a glass style homepage navbar that becomes cream on scroll, active-link underlines, an animated mobile menu, and a persistent mobile call/WhatsApp bar.
- Added performant CSS entrance/hover transitions, IntersectionObserver reveal sections, subtle hero-photo parallax, and reduced-motion fallbacks without adding Motion/Framer Motion dependencies.
- Reused the supplied warehouse and truck photographs throughout; removed the warehouse illustration from the facility route.
- Preserved the five routes, original business details, five listed services, phone/WhatsApp actions, Google Maps embed, and WhatsApp enquiry form behavior.
- Updated README design notes and `PROJECT_STRUCTURE.md` with the new tokens and reusable components.

## Hero refinement · 2026-11-15

- Expanded the hero to 110svh on desktop with full-bleed photography, a lighter directional navy/burgundy overlay, and a mobile-specific real warehouse/truck image.
- Added a transparent truck cutout derived from the supplied business photo. A one-time CSS entrance and suspension settle move it in from the right; subtle headlight glows and background parallax reinforce the scene.
- Used CSS for the one-time truck/light animation and a small scroll handler for parallax, with no animation dependency; reduced-motion disables movement and the foreground cutout stays off small screens.
- Saved laptop, tablet, and phone hero review captures under `.hallmark/hero-final/`.

## Hallmark homepage redesign · 2026-11-15

- Applied project-local Hallmark design guidance to the home page with a Console-inspired navy/white/yellow palette, responsive layout, accessible focus styles, and reduced-motion support.
- Used the supplied truck-at-warehouse photograph as the home hero background and added prominent direct call and WhatsApp enquiry actions.
- Added the five requested services, verified warehouse and location facts, and clear paths to warehouse, services, and map pages without changing the five routes.
- Removed the runtime Google Fonts request in favor of a local system font stack.
- Added `app/tokens.css` and `app/base.css`, documented the design in README, and updated this structure map.
- Added the project-local Hallmark files and captured the pre-redesign laptop and phone baselines under `.hallmark/before/`.

## 2026-11-15

- Added the complete shadcn/ui CLI `add --all` set: 65 new source files and 11 component dependencies.
- Integrated shadcn Button, Input, Label, Native Select, and Textarea into the WhatsApp enquiry form, and added the root TooltipProvider.
- Replaced the starter README with project setup, page map, complete UI component inventory, usage notes, and deployment SEO configuration.
- Initialized shadcn/ui in the existing Next.js app using the Nova preset and Base UI primitives, following the official existing-project guide.
- Added `components.json`, the shadcn Button component, class utility, and Tailwind v4 animation/theme imports.
- Mapped shadcn primary, secondary, and focus ring tokens to the site's navy and yellow brand colors.
- Added four supplied on-site photographs to the Our Services page gallery: warehouse exterior, truck at the warehouse, yard, and handling equipment.
- Kept the images supplied by the business and added descriptive alternate text and captions.
- Added `PROJECT_STRUCTURE.md` to document routes, assets, common update locations, and local development.
