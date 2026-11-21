# Bhagwan Warehousing & Dispatch

Five-page, mobile-friendly website for the Neemrana warehouse. The site focuses on short-term cargo storage enquiries from transporters, truck operators, and logistics businesses.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Other scripts: `npm run build`, `npm run start`, and `npm run lint`.

## Site pages

- `/` — Home
- `/warehouse` — Our Warehouse
- `/services` — Our Services and supplied warehouse photo gallery
- `/location` — Location and Google Maps embed
- `/contact` — Contact information and WhatsApp enquiry form

The contact form opens WhatsApp with a prefilled message. The website does not store enquiries in a database. Phone number, WhatsApp links, business details, and shared navigation are maintained in `app/components.tsx`.

## shadcn/ui

The project uses [shadcn/ui](https://ui.shadcn.com/docs/installation/next) with the Nova style, Base UI primitives, Tailwind CSS 4, and the `@/*` import alias. The full component set available to this project was added with the shadcn CLI `add --all` command. The generated components are editable source files in `components/ui/`.

### Components added

Accordion, Alert, Alert Dialog, Aspect Ratio, Attachment, Avatar, Badge, Breadcrumb, Bubble, Button, Button Group, Calendar, Card, Carousel, Chart, Checkbox, Code Block, Collapsible, Combobox, Command, Context Menu, Dialog, Direction, Drawer, Dropdown Menu, Empty, Field, Hover Card, Input, Input Group, Input OTP, Item, Kbd, Label, Marker, Menubar, Message, Message Scroller, Native Select, Navigation Menu, Pagination, Popover, Progress, Questionnaire, Radio Group, Resizable, Scroll Area, Select, Separator, Sheet, Sidebar, Skeleton, Slider, Spinner, Switch, Table, Tabs, Textarea, Toast, Toggle, Toggle Group, Tooltip, and Trace.

The CLI also added `use-highlighted-code`, `use-mobile`, and the `highlighter` helper used by code display components.

### Used in the website

The WhatsApp enquiry form uses the shadcn Button, Input, Label, Native Select, and Textarea components. `TooltipProvider` is installed at the root layout so tooltip components are ready to use. shadcn theme tokens map primary, secondary, and focus colors to the site's navy and yellow palette.

### Add or update components

From this directory:

```bash
npx shadcn@latest add <component-name>
npx shadcn@latest add --all
```

`components.json` controls the generator aliases and CSS location. Shared class utilities live in `lib/utils.ts`.

## Design system

The site uses the requested premium industrial palette: warm beige `#E8DCC8`, cream `#F5F0E6`, dark maroon `#521C2D`, deep burgundy `#3B1422`, navy `#102638`, muted gold `#D6A84F`, and white. Beige and cream anchor the light sections; maroon and navy define the brand and dark sections; gold marks key actions.

The home hero and warehouse pages use the supplied photographs under `public/warehouse-photos/`. The navigation is glass styled over the homepage hero and becomes a solid cream bar on scroll. It includes an animated mobile menu, active route indication, and direct call action. Scroll reveals, hover states, and the subtle hero photo parallax use CSS and lightweight browser APIs, with reduced-motion support. No additional motion dependency was added.

Design tokens live in `app/tokens.css`, shared accessibility and baseline rules in `app/base.css`, and page/component styles in `app/globals.css`. The reusable client helpers for navigation, hero parallax, and reveal-on-scroll are in `app/components.tsx`.

Current responsive hero captures are in `.hallmark/hero-final/`; the five-page desktop and phone captures are in `.hallmark/premium/`.

The home hero uses `public/assets/neemrana-warehouse-dusk.png` as its desktop background and the supplied `truck-at-warehouse.jpeg` on mobile. On desktop, a white truck (`public/warehouse-photos/white-truck-cutout.webp`, cut out and mirrored from a supplied reference image) drives in from the right with a one-time CSS entrance and suspension settle, and its headlight glows switch on as it stops. The background has a subtle scroll parallax. Motion respects `prefers-reduced-motion`. The intro loader still uses the older `truck-arrival-cutout.webp`.

The site retains the verified business details supplied for this business: a 1500 sq. ft. RCC warehouse, near Tata RC Motors on NH 48 in Neemrana, Rajasthan, phone 7688866933, and the existing five storage/handling services. It does not claim specific opening hours, rates, capacity, or availability.

## File structure

See [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) for the route and asset map, common update locations, and sitemap configuration. Project changes are recorded in [docs/CHANGELOG.md](./docs/CHANGELOG.md).

## SEO deployment setup

Set `NEXT_PUBLIC_SITE_URL` to the canonical origin for the domain you own before deployment. `app/sitemap.ts` and `app/robots.ts` use this value to publish the sitemap URL. Google Search Console verification and Google Business Profile linking must be completed using the business's own Google accounts after a domain is configured.
