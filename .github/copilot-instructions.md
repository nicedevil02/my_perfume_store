# Copilot Instructions — AQS Perfume Store

## Map
- Next.js 14 App Router, TypeScript, Tailwind, Prisma (MySQL), NextAuth (OTP), RTL UI.
- Key dirs:
  - src/app: routes (API at src/app/api/*/route.ts with named exports GET/POST)
  - src/components: layout, shop, products, ui
  - src/lib: auth.ts, prisma.ts, fonts.ts, utils.ts
  - prisma: schema.prisma (User, Product, Brand, Category, VerificationCode, Wishlist)

## Auth (OTP + JWT)
- Login path: /auth/login (NOT /unified)
- OTP flow:
  1) POST /api/auth/send-code → creates VerificationCode
  2) In /auth/login, auto-submit on 6 digits with useEffect(100ms)
  3) signIn("credentials", { identifier, code, redirect:false }) → router.replace("/profile"); router.refresh();
- src/lib/auth.ts:
  - session.strategy = "jwt", maxAge ~ 7d
  - callbacks.jwt/session must mirror id, email, name between token and session
- Client-only providers: wrap UI in a client Providers component using SessionProvider

## Data (Prisma)
- prisma/schema.prisma:
  - VerificationCode: @@index([identifier, used, expiresAt])
  - Wishlist: id, userId, productId, relations to User/Product, @@unique([userId, productId])
- Use singleton prisma client (src/lib/prisma.ts)
- After schema changes:
  - npx prisma format && npx prisma db push
  - npx prisma studio to inspect

## UI + Tailwind
- RTL: html has dir="rtl", Vazirmatn loaded in src/lib/fonts.ts
- Background: animated gradient via animate-gradient-bg; extra custom animations in tailwind.config.ts
- Glassmorphism card style: bg-white/80 + backdrop-blur-sm
- Modals: Zustand store + portal div with id="portal-root" in app/layout.tsx

## Patterns and Examples
- Server vs Client: put "use client" at file top when using hooks/state/events
- Search params pattern (shop):
  - Accept searchParams in page.tsx
  - Parse optional strings: split comma lists (e.g., scent)
  - Pass typed props down to FilterSidebar (selectedGender, selectedScents, min/maxPrice)
- Breadcrumb: pass items [{label, href?}] to components/ui/Breadcrumb
- utils: use cn(...) and formatPrice(...) from src/lib/utils.ts

## Header + Session UX
- components/layout/Header.tsx uses useSession() states:
  - loading: skeleton
  - unauthenticated: “ورود/ثبت‌نام” → /auth/login
  - authenticated: avatar + dropdown (Profile, Sign out)

## Common pitfalls
- Do NOT start .tsx files with Markdown fences (```tsx) — causes "" is not a function runtime error
- Only wrap SessionProvider once (via Providers component). Don’t nest multiple SessionProviders
- Keep login path synced with authOptions.pages.signIn
- When adding wishlist APIs, ensure productId exists and user is authenticated

## Dev workflow
```bash
npm run dev               # start
npx prisma db push        # sync schema
npx prisma studio         # inspect DB
```
- Env (.env): DATABASE_URL, NEXTAUTH_SECRET (openssl rand -base64 32), NEXTAUTH_URL
- Test session: open /api/auth/session, check browser cookies next-auth.session-token

When unsure: see src/lib/auth.ts (auth), prisma/schema.prisma (data), tailwind.config.ts (styles).
