# KindBites

KindBites is a food and essential-item sharing platform that helps connect people and businesses with surplus resources to community organizations that can use them. The project is designed to support donation coordination, organization verification, and pickup workflows.

## What the platform does

- Lets food vendors create listings for surplus food, including quantity and pickup details.
- Lets NGOs and charities find available listings and request pickups.
- Supports individual donation drives for food and essential items.
- Provides account and document verification workflows for organizations.
- Gives administrators tools to review accounts and donation requests.
- Tracks pickup requests and donation progress through their statuses.

## User roles

- **Food vendors** share available food and respond to pickup requests.
- **NGOs and charities** browse listings, request pickups, and coordinate collection.
- **Individual donors** submit item donations through the donation-drive experience.
- **Administrators** review pending organization verifications and donation activity.

Vendor and NGO accounts may require approval before they can use all platform features. Administrator accounts are managed by the project owner and are not available through public signup.

## Main areas

- **Home:** introduces the platform and links to its main experiences.
- **Registration and verification:** collects account and organization details and supports document submission and review status.
- **Vendor dashboard:** manages food listings and pickup requests.
- **NGO dashboard:** explores food listings and manages pickup requests.
- **Donation drive:** supports individual donor registration and item donation submissions.
- **Admin dashboard:** reviews pending verifications and donation activity.

## Technology

- Next.js 14 and React 18
- TypeScript
- MySQL with `mysql2` connection pooling
- Tailwind CSS
- JWT-based authentication and role-based access controls
- `bcryptjs` for password hashing
