# Software store and admin

The store accepts website order requests, with optional WhatsApp assistance. Products are empty initially: add actual subscription names, descriptions, durations and LKR prices in the admin. No unverified brands, prices or subscription offers are published.

## Start

Use Node **22.18 or newer**. Local SQLite needs `node:sqlite` and a persistent, writable disk. Vercel uses the hosted database setup below.

```powershell
npm run admin:setup
npm run build
npm start
```

The setup command asks for a password without displaying it. Use at least 12 characters. Visit `http://localhost:3000/admin` and sign in. Re-running setup resets the password and revokes all existing sessions.

- `/store`: searchable catalogue with categories, availability filter, prices and subscription durations.
- `/admin`: password-protected product, order, blog and project management.
- Products: edit both languages, price, availability and publication status. Unpublish to remove an offer from the public store without losing order history.
- Enquiries: submitted contact forms appear in the private Enquiries tab. Reply using the customer email; automatic email notifications are not configured.
- Orders: website requests appear automatically; you can also manually record agreed WhatsApp orders. Track pending, confirmed, completed and cancelled. Prices and duration are snapshotted; later product changes do not alter an existing order unless you select another product.
- Blog/projects: add English and Sinhala titles, summaries and plain-text body content. Drafts stay private. Published entries appear on the relevant page and have their own `/updates/<id>` page.
- Existing editorial articles remain in source. New admin-managed content appears above them. Portfolio concept placeholders disappear when an actual project is published.

Clicking a WhatsApp link opens a prepared enquiry. Customers still review and send it in WhatsApp. These messages do **not** automatically create admin orders, reserve stock, charge payments or activate subscriptions. Availability is controlled manually, as requested. There is no license-key vault, payment gateway or automatic renewal engine.

## Storage and hosting

SQLite data defaults to `data/seo-plus.sqlite`. The folder is excluded from Git and must never be moved into `public/`. Set `SEO_DATA_DIR` to an absolute directory on the hosting server's persistent disk to use a different location. Keep this same value for setup and the running application.

For Vercel, configure the hosted Turso libSQL connection described below. For local SQLite, use a Node server with persistent disk. Multiple unrelated machines do not share a local SQLite file.

### `/var/task/data` deployment error

`/var/task` is the deployed function bundle, not persistent writable storage. The app now detects Vercel/Lambda execution before creating a local database. Database-backed pages show a temporary-unavailability notice and APIs return HTTP 503 instead of exposing filesystem errors or reporting unsaved submissions as successful. Static marketing pages remain available. With cloud credentials configured, the application uses the hosted database instead of this fallback.

To restore catalogue/admin/enquiry/order functionality, configure the Turso connection below, or deploy on a persistent Node host with `SEO_DATA_DIR` pointing to its mounted disk. Setting this variable to `/tmp` on Vercel will not solve persistence and is deliberately not supported. Existing local records are not automatically uploaded to hosting. Redeploy the changed code for the error handling to take effect.

Back up the database securely, including customer order data. Stop the application before taking a simple filesystem copy (SQLite WAL files can contain recent changes while the server is running). Restore only with the application stopped.

Set `NEXT_PUBLIC_SITE_URL` to the final HTTPS origin. Admin sessions use HTTP-only SameSite cookies, expire after 8 hours and are stored as token hashes. Login attempts are limited to 10 within 15 minutes for the single admin account. Customer contact details and internal notes are only returned by authenticated routes. The public tracking endpoint accepts a random private code and returns only order status, product, quantity, total and update time. Use HTTPS for production.

Public enquiry and order forms store the submitted contact details in the private database. Tracking codes are shown once after submission; only their hashes are stored. Customers should save their code. The code does not authorize payment or activation.

## Language and launch

English routes use `/services`, `/contact`, etc.; Sinhala uses `/si/services`, `/si/contact`, etc. Language selection is URL-based and rendered on the server, including metadata. Switching languages performs a full navigation so the document language and shared layout update together.

Run `npm run check:launch` before deployment. Until the production URL is configured, the site deliberately remains noindex. Set the production HTTPS origin and either Turso credentials or a local persistent storage directory, then rebuild. Payment processing remains unconfigured until a provider and merchant account are supplied.

SETUP.md records that the owner confirmed the homepage counts; those figures are preserved. Publish real project details and customer-approved results via the admin to substantiate them. No testimonials or delivery guarantees have been invented. Service scopes are proposals, with final costs and milestones agreed per project.

## Email later

Set `NEXT_PUBLIC_CONTACT_EMAIL` when the business email is ready; it enables the contact email link. Automatic email copies need a server-side delivery provider and verified sending domain; they are not enabled by merely setting an address.

## Verification

```powershell
npm run build
npm run test:integration
```

The integration test starts a production server on a free port using a separate temporary SQLite database. It checks login/session protection, draft privacy, product changes, sold-out behaviour, WhatsApp links, saved orders, historical prices and content publishing. It never sends a WhatsApp message.

## Vercel + Turso libSQL setup

1. Create a Turso account and a **libSQL** database (not the newer Turso engine). Using the Turso CLI, `turso db create seo-plus` creates libSQL; do not add `--tursodb`. See https://docs.turso.tech/quickstart.
2. Obtain the database URL and a database read/write auth token through your Turso dashboard or CLI. Keep the token private.
3. In Vercel project Settings > Environment Variables, set `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` for the intended deployment environment. Never prefix them with `NEXT_PUBLIC_`. Set `NEXT_PUBLIC_SITE_URL` to your actual deployed HTTPS origin. A custom domain is not required; the actual Vercel production URL works.
4. Redeploy this updated code. Tables are initialized automatically. Cloud mode never creates `/var/task/data` or a `/tmp` database. Missing, partial or rejected cloud credentials never silently fall back to a local database.
5. Put the same two private variables in your ignored local `.env.local` and run `npm run admin:setup` locally. It prompts for the password and writes a salted password hash to the cloud database. This also revokes previous admin sessions. Do not set a plaintext admin password in public environment variables or commit `.env.local`.
6. Sign in at your deployed `/admin` and add products/content. Submit a test enquiry and check the Enquiries tab. Existing local SQLite records are not uploaded automatically; keep your local database backup until any separate migration is verified.

Use a separate database/token for Preview deployments so testing cannot alter production records. Runtime SQL uses bound parameters and the HTTP-only SDK import. Order creation and its private tracking token are written in one transaction. Cloud execution has been checked with a mocked SDK; a live database check still requires your account credentials.

Reference: https://docs.turso.tech/integrations/vercel
