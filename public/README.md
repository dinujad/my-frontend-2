# PrintWorks Frontend

Next.js 15 + TypeScript + Tailwind + Radix/Headless UI + React Hook Form + Zod + Zustand + TanStack Query.

## Structure

```
src/
├── app/                 # App Router (pages, layout)
├── components/          # UI & form components
│   ├── providers/       # QueryClient, etc.
│   ├── ui/              # Radix / Headless UI primitives
│   └── forms/           # Form examples (RHF + Zod)
├── hooks/               # useAuth, etc.
├── lib/
│   ├── api/             # API client (REST/GraphQL)
│   └── validation/      # Zod schemas
├── stores/              # Zustand (cart, wishlist)
└── types/               # Shared TypeScript types
```

## Setup

```bash
pnpm install
# or: npm install
cp .env.example .env
pnpm dev
# or: npm run dev
```

## Stack

- **Next.js** – App Router, SSR
- **TypeScript** – `tsconfig.json`, path `@/*`
- **Tailwind** – `tailwind.config.ts`
- **Radix / Headless UI** – add components under `components/ui/`
- **React Hook Form + Zod** – see `lib/validation/schemas.ts`, `components/forms/`
- **Zustand** – `stores/cart-store.ts`, `stores/wishlist-store.ts`
- **TanStack Query** – `Providers.tsx`, `hooks/useAuth.ts`
