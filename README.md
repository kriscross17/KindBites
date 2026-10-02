# KindBites

KindBites is a Next.js platform for sharing surplus food and essential items with community organizations. Donors can register, submit item details and pickup information, and track approval or collection. Administrators can review item donations, verify accounts, and view food listings.

## Requirements

- Node.js 18 or newer
- MySQL database
- Environment variables listed in `.env.example`

## Getting started

1. Install dependencies with `npm install`.
2. Provision a **new, empty** MySQL database exclusively for KindBites.
3. Apply `db.sql` to that database. It creates empty tables only and inserts no records.
4. Copy `.env.example` to `.env.local` and set `DB_HOST`, `DB_USER`, `DB_PASSWORD`, and `DB_NAME` to the new KindBites database, plus authentication and mail credentials.
5. Start the development server with `npm run dev`.

KindBites reads and writes data only through the configured database connection. Accounts, item donations, food listings, and verification records are created by the new application after deployment. The setup route is disabled, and the schema contains no imported or sample rows.

## Validation

- `npm run type-check`
- `npm run build`
- `npm run lint`
