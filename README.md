# Summarist — FES Advanced Virtual Internship

Module 10 ch.05 of Front End Simplified. **Module 11 stays locked until a live deployment link is
submitted here and a mentor approves it.** Submission is Bill's — mentor-reviewed credential work
is never submitted by Claude.

Brief captured from the intro video: `identity/fes-module10-advanced-internship.md`.

## Stack

| Piece | Choice | Why |
|---|---|---|
| Framework | Next.js 16, App Router | What FES used |
| Styling | Their `style.css` for the home page; Tailwind v4 + `@theme` tokens for the app pages | The home page is supplied as HTML/CSS — matching it beats re-inventing it |
| State | **Redux Toolkit** | The video allows Zustand instead. Redux was chosen deliberately: it was just taught in ch.04, FES flags action-vs-reducer as an interview question, and job codebases run Redux. |
| Auth | Firebase (email+password, guest, Google) | What FES used |
| Payments | Stripe via the Firebase extension | What FES used |
| Language | JavaScript | Every FES lesson ships JS. The PDF says "choose whatever technology you want", so TypeScript is allowed but not required — flipping later is mechanical. |

## Running it

```bash
npm install
cp .env.local.example .env.local   # then fill in Firebase + Stripe keys
npm run dev
```

Firebase console → Authentication → Sign-in method: enable **Email/Password** and **Google**, or
those modal paths throw `auth/operation-not-allowed`. Guest login rides on Email/Password.

## What is built

- **Home page** — Frontend Simplified's own HTML/CSS, ported to components
  (`src/components/home/`, their stylesheet as `src/app/home.css`), with the empty `img` tags
  filled from `public/assets/` and react-icons in the icon slots. Both Login CTAs open the modal.
- **Auth modal** — register, login, **documented guest login** (hardcoded dummy account), Google,
  forgot-password, and the three error messages the spec names (invalid email, short password,
  user not found). Escape closes, scroll locks, success redirects to `/for-you`.
- **Redux** — `modalSlice` (which panel is open), `userSlice` (Firebase user + selectors),
  `booksApi` (RTK Query, all four documented endpoints, with the middleware wired).
- **Auth listener** — one `onAuthStateChanged` in `providers.jsx`, inside `<Provider>`,
  unsubscribed on unmount.
- **App shell** — route group `src/app/(app)/` carrying the sidebar (7 items, Highlights/Search/
  Help & Support inert per spec) and the search bar (**300 ms debounce**, results dropdown → book
  page). Home and `/choose-plan` sit outside the group, which is exactly the spec's rule.
- **`/for-you`** — selected book, recommended and suggested rows, premium pills driven by
  `subscriptionRequired`, skeleton loading states.
- **`/book/:id`** — full content, and the documented gate on Read/Listen: signed out opens the
  modal, premium-and-unsubscribed goes to `/choose-plan`, otherwise the player. Add-to-library
  writes to Firestore.
- **`/player/:id`** — summary with `white-space: pre-line`, and a custom audio player
  (play/pause, ±10s, draggable seek, mm:ss times). Reaching the end marks the book finished.
  The paywall is re-checked here, so a guessed URL cannot bypass it.
- **`/settings`** — plan (Basic + upgrade button, or Premium/Premium-Plus), email, and the
  logged-out state with the supplied image.
- **`/library`** — saved and finished books from Firestore, with empty states.
- **Book durations** — read from each MP3's metadata (not in the API), cached per URL.
- **Mobile** — the sidebar becomes a drawer behind a hamburger, with an overlay to dismiss.

**API note worth keeping:** the docs say `getBooks?status=selected` returns a single object; the
live API returns an **array of one**. `booksApi` unwraps either shape.

`userSlice.status` is four-valued on purpose — `loading`, `signedOut`, `guest`, `authenticated`.
"Still asking Firebase" and "definitely nobody" look identical if you only store `user`.

## Payments

Stripe runs in **test mode** — no business details, no real charges. Two products, created via
the API (`Premium Plus Yearly` $99.99/yr with a **7-day trial**, `Premium Monthly` $9.99/mo).

Checkout goes through **Next API routes with the Stripe SDK**, not the Firebase Stripe
extension — the extension needs the Blaze plan and a card on file with Google, and the brief
only requires two working subscriptions.

- `POST /api/checkout` — creates a Checkout Session and returns its URL. `client_reference_id`
  carries the Firebase uid, which is the only link between a Firebase user and a Stripe
  subscription.
- `GET /api/subscription?uid=` — reads the plan back. Webhooks would need a public URL and a
  signing secret; asking Stripe on load is the right trade at this size. `trialing` counts as
  subscribed, which is the point of the trial.

Test card: **4242 4242 4242 4242**, any future expiry, any CVC.

## Still to build

- Optional polish: the home page's active-heading effect

## Before it runs

1. `.env.local` from the example, with Firebase + Stripe keys
2. Firebase → Authentication → Sign-in method: enable **Email/Password** and **Google**
3. Firebase → Authentication → Users: **create the guest account** (`guest@gmail.com` /
   `guest123`, or override via `NEXT_PUBLIC_GUEST_*`)
