# SEO PLUS website

The site now includes a bilingual multi-page website, software subscription store and persistent admin panel. See [STORE-ADMIN.md](STORE-ADMIN.md) for the current store, admin password setup, database hosting and order workflow. The owner confirmed 50+ projects, 30+ clients, 5+ years and 24/7 support; these are displayed with a reduced-motion-aware count-up animation. The older notes below describe the initial website and are superseded where they conflict with the store guide.

Next.js App Router + TypeScript + Tailwind CSS v4. CSS/SVG visuals, Lucide icons, local logo asset. No external fonts, animation framework or image service required.

The dev/build scripts use Next.js Webpack mode because Turbopack failed to launch its CSS worker in this Windows environment. This does not change the Next.js/TypeScript/Tailwind application stack.

## Run locally (Node.js 22 LTS)

```powershell
cd D:\seo-plus-e-solutions
npm ci
npm run dev
```

Open http://localhost:3000. For another port: `npm run dev -- --port 3001`.

## Validate and run production

```powershell
npm run lint
npm run typecheck
npm run build
npm start
```

## Confirm before launch

Copy `.env.example` to `.env.local` and fill confirmed values. Restart/rebuild after changes. `NEXT_PUBLIC_SITE_URL` must be a full HTTPS origin without a trailing path. It controls robots/sitemap/indexing; without it the site intentionally requests no indexing. `NEXT_PUBLIC_CONTACT_EMAIL` activates email links; `NEXT_PUBLIC_WHATSAPP_NUMBER` accepts international digits only (no plus or spaces). These values are public, not secrets.

The owner supplied WhatsApp number `0779713652`, configured as `94779713652` (Sri Lanka). The floating button and prepared-enquiry link open WhatsApp. No message is sent automatically.

The enquiry form **prepares a draft**. It does not send email, make API calls or store personal information. Copy works locally; configured email/WhatsApp actions hand the draft to the respective app. Add a verified delivery backend, server validation, abuse protection and a complete privacy notice if direct submission is wanted.

All three projects are explicitly labelled illustrative concepts. There are no invented stats, client logos, testimonials, team biographies, addresses or performance guarantees. Service wording and original editorial articles need owner review. The generated homepage reference was unavailable; the design uses the supplied original SEO PLUS logo and a custom black/gold visual direction.

Confirm service scope, actual portfolio, contact details, business privacy notice and production domain before launch. Do not turn concept designs into claimed client work. Replace `public/seo-plus-logo.png` only with an approved brand asset. The compact header uses CSS framing of the original square image without editing its pixels.

## Content locations

- Homepage sections: `src/app/page.tsx`
- Interactive hero, filters, enquiry draft and WhatsApp: `src/components/interactive.tsx`
- Brand/header/footer: `src/components/chrome.tsx`
- Articles and contact configuration: `src/lib/site.ts`
- Design and responsive/reduced-motion rules: `src/app/globals.css`
- SEO: `src/app/layout.tsx`, `robots.ts`, `sitemap.ts`

## Commit after review

```powershell
git status
git add package.json package-lock.json tsconfig.json next.config.ts postcss.config.mjs eslint.config.mjs .env.example next-env.d.ts SETUP.md src public
git diff --cached --stat
git commit -m "Build SEO PLUS responsive business website"
git push
```

Existing README, .gitignore, branch and Git history are preserved. No commit or push is made automatically. Keep `.env.local` out of Git.
