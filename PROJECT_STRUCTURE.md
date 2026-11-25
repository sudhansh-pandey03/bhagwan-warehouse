# Project Structure

This document describes the Bhagwan Warehousing & Dispatch website and where to make common updates.

```text
my-app/
|-- app/
|   |-- contact/page.tsx        # Contact details and WhatsApp enquiry form
|   |-- location/page.tsx       # Neemrana address and Google Maps embed
|   |-- services/page.tsx       # Services list and supplied facility photo gallery
|   |-- warehouse/page.tsx      # Warehouse details
|   |-- components.tsx          # Shared animated navbar, hero parallax, reveals, footer, enquiry form
|   |-- globals.css             # Premium palette, responsive layouts, motion and interactions
|   |-- tokens.css              # Beige, cream, maroon, navy and gold design tokens
|   |-- base.css                # Shared baseline, focus and reduced-motion rules
|   |-- layout.tsx              # Root layout, metadata and mobile call/WhatsApp bar
|   |-- page.tsx                # Home page
|   |-- robots.ts               # Generated robots.txt
|   `-- sitemap.ts              # Generated sitemap.xml (needs site URL env var)
|-- docs/
|   `-- CHANGELOG.md            # Project update notes
|-- .agents/skills/hallmark/    # Project-local Hallmark design guidance and tools
|-- .hallmark/                  # Design decisions, baseline and review captures
|-- hooks/
|   |-- use-highlighted-code.ts # Highlighted-code helper hook
|   `-- use-mobile.ts           # Responsive viewport hook
|-- components/
|   |-- home/                   # Service Partner sign-in: navbar button, glass dialog, form, validation, submit adapter
|   `-- ui/
|       `-- button.tsx          # shadcn/ui Button (Base UI primitive)
|-- lib/
|   |-- highlighter.tsx         # Code highlighting helper
|   `-- utils.ts                # Shared class utility export
|-- public/
|   |-- assets/                 # Hero background and campaign images
|   `-- warehouse-photos/       # Supplied photos, the hero truck cutout, and the loader truck cutout
|-- components.json             # shadcn/ui generator configuration
|-- package.json                # Scripts and dependencies
`-- PROJECT_STRUCTURE.md        # This document
```

## Common updates

- **Business phone and WhatsApp:** `app/components.tsx`; update the phone constants and WhatsApp links together.
- **Page content and SEO metadata:** each route's `page.tsx` file. Global title defaults are in `app/layout.tsx`.
- **Photos:** use the descriptive JPEG copies under `public/warehouse-photos/`. The services gallery data is in `app/services/page.tsx`.
- **Reusable UI:** shadcn/ui components are generated under `components/ui/`; shared class utilities are under `lib/`.
- **Colors and responsive styling:** `app/tokens.css`, `app/base.css`, and `app/globals.css`.
- **Home page photo frame:** the `facilityPhotos` list in `app/page.tsx` sets which photos appear in the shared frame, with their alt text and captions. The frame itself is `PhotoFrame` in `app/components.tsx`.
- **Service Partner accounts (email + password):** API routes under `app/api/auth/*` re-export handlers from `lib/server/module/auth/` (`auth.routes.ts` lists them). Business logic is in `auth.service.ts`, the user schema in `auth.model.ts`, Joi rules in `dto/`, roles in `auth.roles.ts`. Shared server code (env check, MongoDB, email, errors, rate limit, JWT) is in `lib/server/common/`. Browser side: `lib/auth-client/api.ts` (in-memory access token, refresh-and-retry), `components/auth/` (provider, `ProtectedRoute`, the five auth pages' forms). Pages: `/login`, `/register`, `/verify-email/[token]`, `/forgot-password`, `/reset-password/[token]`. Facilities Handling and its chat are wrapped in `ProtectedRoute`. Required env vars are listed in `.env.example`.
- **Homepage hero:** `HeroBackground` in `app/components.tsx`. The background is `assets/neemrana-warehouse-dusk.png` (desktop) and `warehouse-photos/truck-at-warehouse.jpeg` (mobile). The animated truck is `warehouse-photos/white-truck-cutout.webp`; its size, position and headlight-glow positions (percentages of the cutout) are under `.truck-arrival` and `.headlight-glow` in `app/globals.css`.
- **Warehouse imagery:** `public/warehouse-photos/`; the services page gallery entries are in `app/services/page.tsx`.
- **Mobile menu and scroll state:** `SiteHeader` in `app/components.tsx`.
- **Reveal animations and hero parallax:** `Reveal` and `HeroBackground` in `app/components.tsx`; both respect reduced-motion settings.
- **Sitemap host:** set `NEXT_PUBLIC_SITE_URL` to the deployed site's canonical origin (for example, `https://your-owned-domain.example`) before deployment. The example is illustrative; replace it with the domain you own.

## Local development

From this directory, run `npm run dev` and open `http://localhost:3000`.

The enquiry form opens WhatsApp with a prefilled message; it does not store submissions in a website database.
