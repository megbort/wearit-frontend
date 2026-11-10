# WearIt v2.0

Welcome to WearIt, an urban clothing retailer concept built with Next.js, TypeScript and GraphQL. Expect ongoing updates and improvements 😊.

### Core Features

- Browse products by category, with sorting
- Featured and on-sale collections
- Product pages with size and color selection
- Cart with live pricing and discounts
- Account sign-up and login
- Light and dark mode
- English and French support

Visit the live site at [wearit.megankrenbrink.com](https://wearit.megankrenbrink.com)

Hope you enjoy exploring!

Megan Krenbrink

---

## Getting Started

### Prerequisites

- Node.js (v24 or higher, see `.nvmrc`)
- npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production (static export)
npm run build

# Start storybook server
npm run storybook

# Run unit and Storybook tests
npm test
```

Open [http://localhost:3000](http://localhost:3000) to view the app.
Open [http://localhost:6006](http://localhost:6006) to view storybook.

### Environment

The app talks to the [WearIt Backend](https://github.com/megbort/wearit-backend) GraphQL API. Copy
`.env.example` to `.env` and set `NEXT_PUBLIC_GRAPHQL_URL` to the API endpoint.

> **Deployment note:** the app is built as a **static export** (`output: 'export'`)
> and pushes to `master` are deployed by GitHub Actions, which rsyncs the output
> to the host. There is no Next.js server running at
> runtime (no SSR, ISR, or middleware).

## Tech Stack

- **Next.js** (App Router) with **TypeScript**
- **Tailwind CSS v4** for styling (with light/dark mode), plus **MUI** for form controls and menus
- **Apollo Client** + **GraphQL** for data fetching and auth
- **Zustand** for global state (cart, auth, notifications)
- **next-intl** for internationalized UI strings (English and French)
- **Storybook** for UI development
- **Vitest** + **Testing Library** for unit and Storybook tests
- **Cloudinary** for cloud-based image storage and delivery

## Project Structure

```
src/
├── app/              # Next.js app directory (routing, pages)
├── components/       # Reusable UI components
│   └── ui/           # UI primitives (Button, Select, etc.)
├── hooks/            # Custom React hooks (useAuth, etc.)
├── i18n/             # next-intl configuration
├── services/         # Apollo client, GraphQL queries, models, and Zustand store
├── stories/          # Storybook stories
├── styles/           # Typography utilities (global styles live in app/globals.css)
├── theme/            # MUI theme configuration
└── utils/            # Utility functions

messages/             # Localized UI strings (en.json, fr.json)
```

## Backend

This frontend is powered by a Node.js / GraphQL backend built with Apollo Server
and MongoDB. See the [WearIt Backend](https://github.com/megbort/wearit-backend) repo. It handles the
product catalog and user authentication (login, registration, and session refresh
via httpOnly cookies). Point the app at a running backend with
`NEXT_PUBLIC_GRAPHQL_URL` as described above.
