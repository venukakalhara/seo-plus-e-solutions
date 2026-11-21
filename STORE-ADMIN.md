# Software store and admin

The store accepts website order requests, with optional WhatsApp assistance. Products are empty initially: add actual subscription names, descriptions, durations and LKR prices in the admin. No unverified brands, prices or subscription offers are published.

## Start

Requires Node **22.18 or newer** with `node:sqlite`, and a persistent, writable disk.

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

Deploy on a Node server with persistent disk; do not deploy this database unchanged to an ephemeral/serverless filesystem or Cloudflare Workers. Multiple unrelated machines will not share this local database. Choose the production host before launch, or migrate persistence to a hosted database for serverless hosting.

Back up the database securely, including customer order data. Stop the application before taking a simple filesystem copy (SQLite WAL files can contain recent changes while the server is running). Restore only with the application stopped.

Set `NEXT_PUBLIC_SITE_URL` to the final HTTPS origin. Admin sessions use HTTP-only SameSite cookies, expire after 8 hours and are stored as token hashes. Login attempts are limited to 10 within 15 minutes for the single admin account. Customer contact details and internal notes are only returned by authenticated routes. The public tracking endpoint accepts a random private code and returns only order status, product, quantity, total and update time. Use HTTPS for production.

Public enquiry and order forms store the submitted contact details in the private database. Tracking codes are shown once after submission; only their hashes are stored. Customers should save their code. The code does not authorize payment or activation.

## Language and launch

English routes use `/services`, `/contact`, etc.; Sinhala uses `/si/services`, `/si/contact`, etc. Language selection is URL-based and rendered on the server, including metadata. Switching languages performs a full navigation so the document language and shared layout update together.

Run `npm run check:launch` before deployment. Until the real domain is configured, the site deliberately remains noindex. Set the production HTTPS origin, persistent storage directory, then rebuild. Payment processing remains unconfigured until a provider and merchant account are supplied.

SETUP.md records that the owner confirmed the homepage counts; those figures are preserved. Publish real project details and customer-approved results via the admin to substantiate them. No testimonials or delivery guarantees have been invented. Service scopes are proposals, with final costs and milestones agreed per project.

## Email later

Set `NEXT_PUBLIC_CONTACT_EMAIL` when the business email is ready; it enables the contact email link. Automatic email copies need a server-side delivery provider and verified sending domain; they are not enabled by merely setting an address.

## Verification

```powershell
npm run build
npm run test:integration
```

The integration test starts a production server on a free port using a separate temporary SQLite database. It checks login/session protection, draft privacy, product changes, sold-out behaviour, WhatsApp links, saved orders, historical prices and content publishing. It never sends a WhatsApp message.
