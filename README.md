# Spree Shopping

<div align="center">

  <img src="https://readme-typing-svg.demolab.com?font=Montserrat&size=28&duration=2500&pause=800&color=6366F1&center=true&vCenter=true&width=500&lines=Shop+Smarter.+Shop+Spree!;Gamified+Rewards;Modern+UI;Lightning+Fast" alt="Spree Shopping" />
  <br/><br/>
  <b>Modern, animated, and gamified e-commerce built with React 19, TypeScript, Vite, and Firebase.</b>
  <br/><br/>

  ![CI/CD](https://github.com/Dub5991/SpreeShopping/actions/workflows/main.yml/badge.svg)
  [![codecov](https://codecov.io/gh/Dub5991/SpreeShopping/branch/main/graph/badge.svg)](https://codecov.io/gh/Dub5991/SpreeShopping)
  ![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)

</div>

---

## Overview

**Spree Shopping** is a production-grade, animated e-commerce SPA. It features a full shopping flow — browse products, manage a cart, place orders, and track order history — backed by Firebase Auth and Firestore, secured with industry-standard HTTP headers, Firestore security rules, protected routes, and role-based admin access.

**Live site:** [https://spree-shopping.vercel.app](https://spree-shopping.vercel.app)

---

## Features

### Shopping Experience
- Animated product catalog with category filtering
- Product detail pages with full descriptions
- Persistent shopping cart (localStorage) with stock enforcement
- Checkout with server-side Firestore price validation — client-side price manipulation is rejected
- Order history with per-order detail views
- Gamified UI with XP, levels, and reward animations

### Authentication & Accounts
- Email/password registration and login via Firebase Auth
- Password reset by email
- Password strength indicator (weak / good / strong) on registration
- User profile with editable display name, phone, address, and avatar URL
- Account deletion with confirmation modal ("type DELETE to confirm")
- Generic error messages throughout — no user enumeration possible

### Security
- Firebase credentials loaded from environment variables — never hardcoded
- HTTP security headers on every Vercel response: CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- Protected routes — `/profile`, `/orders`, `/cart` redirect unauthenticated users to login
- Role-based admin access — `role: "admin"` is set in Firestore only; client has no way to self-elevate
- Input validation on all forms: `maxLength`, `min`/`max`, integer/decimal enforcement, and URL scheme validation (`http:`/`https:` only — `javascript:` and `data:` URLs rejected)
- Firestore security rules: users own their data, only admins write products, orders are immutable after creation
- No source maps emitted in production builds
- GitHub Actions pinned to immutable commit SHAs (supply chain protection)

### Admin
- Product management panel (add, edit, delete) — visible only to users with `role: "admin"` in Firestore
- Admin toggle accessible only after server-side role verification at login

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| [React](https://react.dev/) | 19 | UI library |
| [TypeScript](https://www.typescriptlang.org/) | 5.8 | Type safety |
| [Vite](https://vitejs.dev/) | 6 | Build tool and dev server |
| [Redux Toolkit](https://redux-toolkit.js.org/) | 2 | Global state management |
| [React Router DOM](https://reactrouter.com/) | 7 | Client-side routing |
| [Firebase](https://firebase.google.com/) | 11 | Auth and Firestore database |
| [React Bootstrap](https://react-bootstrap.github.io/) | 2 | UI component library |
| [Framer Motion](https://www.framer.com/motion/) | 12 | Animations and page transitions |
| [clsx](https://github.com/lukeed/clsx) | 2 | Conditional class names |
| [Jest](https://jestjs.io/) + [React Testing Library](https://testing-library.com/) | 29 / 16 | Unit and integration testing |
| [Codecov](https://codecov.io/) | — | Coverage reporting |

---

## Project Structure

```
src/
├── __tests__/             # Jest test suites
│   ├── Cart.test.tsx
│   ├── LogoRender.test.tsx
│   ├── ProductCategoryFilter.test.tsx
│   ├── ProductList.test.tsx
│   ├── Profile.test.tsx
│   ├── orderSlice.test.ts
│   ├── productSlice.test.ts
│   └── userSlice.test.ts
├── components/
│   ├── Auth/
│   │   ├── Login.tsx          # Email/password login, forgot password, friendly errors
│   │   ├── Logout.tsx         # Logout button, clears Redux + redirects
│   │   ├── ProtectedRoute.tsx # Redirects unauthenticated users to /login
│   │   └── Register.tsx       # Registration with password strength bar
│   ├── Orders/
│   │   ├── OrderDetail.tsx    # Single order view
│   │   └── OrderList.tsx      # All orders for the current user
│   ├── Products/
│   │   ├── ProductCategoryFilter.tsx  # Category pill filter
│   │   ├── ProductDetail.tsx          # Individual product page
│   │   ├── ProductList.tsx            # Shopper product grid with add-to-cart
│   │   └── ProductManager.tsx         # Admin CRUD panel
│   ├── User/
│   │   ├── DeleteAccount.tsx  # Account deletion with confirmation
│   │   ├── EditProfile.tsx    # Profile edit form
│   │   └── Profile.tsx        # Profile display and edit toggle
│   ├── AnimatedBackground.tsx # Floating orb background
│   ├── AnimatedCard.tsx       # Reusable motion card wrapper
│   ├── HeroWave.tsx           # SVG wave hero element
│   └── SpreeLogo.tsx          # Animated SVG brand logo
├── firebase/
│   ├── auth.ts               # Firebase Auth helpers (login, register, reset, delete)
│   ├── firebaseConfig.ts     # Config loaded from VITE_FIREBASE_* env vars
│   ├── firestore.ts          # Firestore CRUD helpers
│   └── seedProducts.ts       # One-time seed script for demo products
├── pages/
│   ├── Cart.tsx              # Cart page with server-side price validation at checkout
│   ├── HomePage.tsx          # Landing page with hero and featured sections
│   ├── Login.tsx             # Login page wrapper
│   ├── Orders.tsx            # Orders page wrapper
│   ├── Products.tsx          # Products page — shopper view + admin toggle (role-gated)
│   ├── Profile.tsx           # Profile page wrapper
│   └── Register.tsx          # Register page wrapper
├── redux/
│   ├── orderSlice.ts         # Order state
│   ├── productSlice.ts       # Product state
│   ├── store.ts              # Redux store configuration
│   └── userSlice.ts          # User state: uid, email, displayName, role, isAuthenticated
├── styles/
│   └── global.css            # Global CSS custom properties and utility styles
├── App.tsx                   # Router with protected and public routes
└── main.tsx                  # React root mount
```

---

## Routes

| Path | Access | Component |
|---|---|---|
| `/` | Public | HomePage |
| `/login` | Public | Login |
| `/register` | Public | Register |
| `/products` | Public | Products (shopper view) |
| `/products/:productId` | Public | ProductDetail |
| `/cart` | Protected | Cart |
| `/orders` | Protected | Orders |
| `/orders/:orderId` | Protected | OrderDetail |
| `/profile` | Protected | Profile |

Protected routes redirect to `/login` and return the user to their intended destination after authentication.

---

## Admin Access

Admin access is controlled server-side via a `role` field in each user's Firestore document.

1. Log in as any user
2. In the [Firebase Console](https://console.firebase.google.com/) → Firestore → `users` collection → find the user document → set `role: "admin"`
3. On next login the admin panel will appear on the Products page

There is no client-side way to elevate privileges. The `role` field is read from Firestore at login and stored in Redux; the admin UI renders only when `user.role === "admin"`.

---

## Quick Start

### Prerequisites

- Node.js 20+
- A Firebase project with Authentication (Email/Password) and Firestore enabled

### 1. Clone and install

```bash
git clone https://github.com/Dub5991/SpreeShopping.git
cd SpreeShopping
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in your Firebase project values:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Run the dev server

```bash
npm run dev
# http://localhost:5173
```

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint (includes security rules) |
| `npm test` | Run all Jest tests |
| `npm test -- --coverage` | Run tests with coverage report |

---

## Testing

Tests are written with [Jest](https://jestjs.io/) and [React Testing Library](https://testing-library.com/).

```bash
npm test
npm test -- --coverage
```

### Coverage

| Suite | What's tested |
|---|---|
| `userSlice.test.ts` | Redux reducer — setUser, clearUser, setStatus, setError |
| `productSlice.test.ts` | Redux reducer — product state |
| `orderSlice.test.ts` | Redux reducer — order state |
| `Cart.test.tsx` | Cart flow — add, remove, quantity, checkout redirect |
| `ProductList.test.tsx` | Product grid rendering and add-to-cart |
| `ProductCategoryFilter.test.tsx` | Category pill filter behavior |
| `Profile.test.tsx` | Profile component rendering with mocked Firestore |
| `LogoRender.test.tsx` | SpreeLogo SVG renders correctly |

Coverage is uploaded to [Codecov](https://codecov.io/gh/Dub5991/SpreeShopping) on every CI run.

---

## CI/CD

### GitHub Actions (`main.yml`)

Two jobs run in sequence on every push to `main`/`master` and on all pull requests:

**`build-and-test`**
1. Checkout (pinned SHA)
2. Setup Node.js 20 with npm cache
3. `npm ci`
4. `npm run lint`
5. `npm test -- --coverage`
6. Upload coverage to Codecov

**`deploy`** (push to `main`/`master` only, after `build-and-test` passes)
1. Checkout + Node.js setup
2. `npm ci`
3. Install Vercel CLI
4. `vercel pull` — fetch environment variables from Vercel dashboard
5. `vercel build --prod`
6. `vercel deploy --prebuilt --prod`

All third-party actions are pinned to immutable commit SHAs to protect against supply chain attacks.

### Required GitHub Secrets

| Secret | Description |
|---|---|
| `VERCEL_TOKEN` | Vercel personal access token |
| `VERCEL_ORG_ID` | Vercel organization ID |
| `VERCEL_PROJECT_ID` | Vercel project ID |
| `CODECOV_TOKEN` | Codecov upload token |

### Required Vercel Environment Variables

Add all `VITE_FIREBASE_*` variables from `.env.example` to your Vercel project dashboard so they are available during `vercel pull` and `vercel build`.

---

## Security

### HTTP Security Headers (Vercel)

All responses include:

| Header | Value |
|---|---|
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` |
| `X-Frame-Options` | `DENY` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `geolocation=(), microphone=(), camera=()` |
| `Content-Security-Policy` | Restricts scripts, styles, fonts, images, and connections to known-good origins |

### Firestore Security Rules

Deploy `firestore.rules` via the Firebase CLI:

```bash
firebase deploy --only firestore:rules
```

The rules enforce:
- Users can only read and write their own profile document
- Products are readable by anyone; writes require `role: "admin"` in Firestore
- Orders can be created and read only by the authenticated owner; updates and deletes are blocked

---

## Design

- **Animated Spree Logo** — custom SVG with motion
- **Floating orb background** — subtle radial gradients that animate on scroll
- **Hero wave** — SVG wave separator on the landing page
- **Framer Motion** — spring-based page transitions and card hover effects
- **Skip-to-content link** — keyboard accessibility
- **ARIA labels** — all interactive and decorative elements labelled
- **Responsive** — mobile-first Bootstrap grid

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/my-feature`
3. Make changes — all new code must be fully typed (no `any`)
4. Add or update tests for your change
5. Run `npm run lint && npm test` — both must pass
6. Commit using [Conventional Commits](https://www.conventionalcommits.org/): `git commit -m "feat: add my feature"`
7. Push and open a pull request against `main`

Bug reports and feature requests: [open an issue](https://github.com/Dub5991/SpreeShopping/issues)

---

## License

ISC — see [LICENSE](LICENSE) for details.

---

<div align="center">
  <img src="/SpreeLogo.svg" alt="Spree Logo" width="60" /><br/>
  <b>Happy Spree Shopping!</b>
</div>
