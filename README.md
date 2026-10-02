# KindBites

KindBites is a Next.js platform for sharing surplus food and essential items with community organizations. Donors can register, submit item details and pickup information, and track approval or collection. Administrators can review item donations, verify accounts, and view food listings.

## Requirements

- Node.js 18 or newer
- MySQL database
- Environment variables listed in `.env.example`

## Getting started

1. Install dependencies with `npm install`.
2. Create a MySQL database and apply `db.sql` to a fresh database.
3. Copy `.env.example` to `.env.local` and set database, authentication, and mail credentials.
4. Start the development server with `npm run dev`.

The donation flow supports food and item contributions stored in `item_donations`. Existing installations can remove historical monetary data using `migrations/002_remove_monetary_donations.sql` after reviewing the target database.

## Validation

- `npm run type-check`
- `npm run build`
- `npm run lint`
