# Summarist

A book-summary web app: browse and search book summaries, read or listen to them in a custom
audio player, save books to a personal library, and unlock premium titles with a subscription.

Built during the Frontend Simplified (FES) Advanced Virtual Internship from the program's design,
home-page HTML/CSS and API spec. Approved by the program.

**Live:** https://summarist-jet.vercel.app

## Features

- **Authentication (Firebase)**: register, log in, Google sign-in, guest login and forgot
  password in one modal, with clear messages for invalid email, short password and unknown user.
- **Browsing**: "For You" page with a selected book plus recommended and suggested rows, premium
  badges, and skeleton loading states.
- **Search** by title or author with a 300 ms debounce and a results dropdown.
- **Book page** with a gated Read/Listen: signed-out visitors get the login modal, premium books
  send non-subscribers to the plans page, everyone else goes to the player.
- **Player**: summary text plus a custom audio player (play/pause, skip ±10 s, draggable seek bar,
  elapsed/total time). Finishing a book marks it as finished. The paywall is checked again on
  the player page, so a typed-in URL can't skip it.
- **Library** of saved and finished books, stored per user in Firestore.
- **Subscriptions (Stripe, test mode)**: yearly and monthly plans via Stripe Checkout. Two
  Next.js API routes create the checkout session and read the user's plan back
  (`/api/checkout`, `/api/subscription`). Trialing subscriptions count as active.
- **Settings** page showing the current plan and email, with an upgrade button for basic users.
- **State management** with Redux Toolkit: slices for the auth modal and user, and RTK Query for
  all book API calls.
- **Responsive**: on small screens the sidebar becomes a drawer behind a hamburger menu.

## Tech stack

| Technology | Version |
|---|---|
| Next.js (App Router, API routes) | 16.2.10 |
| React / React DOM | 19.2.4 |
| Redux Toolkit / React Redux | 2.12.0 / 9.3.0 |
| Firebase (Auth + Firestore) | 11.10.0 |
| Stripe (Node SDK) | 22.6.2 |
| Tailwind CSS (`@tailwindcss/postcss`) | 4.3.3 |
| react-icons | 5.7.0 |
| ESLint (`eslint-config-next`) | 9.39.5 (16.2.10) |
| Language | JavaScript |
| Hosting | Vercel |

**Node.js:** 20.9.0 or newer (the minimum Next.js 16 requires). Built and tested on Node 24.14.1.

## Getting started

```bash
git clone https://github.com/OptimusDigitalSuite/summarist.git
cd summarist
npm install
cp .env.local.example .env.local   # then fill in your own values
npm run dev                        # http://localhost:3000
```

Environment variables (`.env.local`):

| Variable | Used for |
|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID`, `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`, `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`, `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase web app config |
| `STRIPE_SECRET_KEY` | Stripe API (server only) |
| `NEXT_PUBLIC_STRIPE_PRICE_YEARLY`, `NEXT_PUBLIC_STRIPE_PRICE_MONTHLY` | Stripe price IDs for the two plans |
| `NEXT_PUBLIC_GUEST_EMAIL`, `NEXT_PUBLIC_GUEST_PASSWORD` | the guest-login account |

Firebase setup:

1. Authentication > Sign-in method: enable **Email/Password** and **Google**.
2. Authentication > Users: create the guest account that matches the guest variables.

To test checkout, use Stripe's test card `4242 4242 4242 4242` with any future expiry and any CVC.

Other scripts: `npm run build` (production build), `npm run lint`. There are no automated tests in
this project.

## Notes

- The API docs say `getBooks?status=selected` returns one object, but the live API returns an
  array of one. `booksApi` handles both shapes.
- The user's auth status has four values (`loading`, `signedOut`, `guest`, `authenticated`) so
  "still checking with Firebase" never looks the same as "nobody is signed in".
- Checkout uses Next.js API routes with the Stripe SDK instead of the Firebase Stripe extension,
  which needs Firebase's paid Blaze plan.
