# Task 2-c — FAQ View Developer

## Task
Build the SEO-optimized FAQ view component (`src/components/faq/faq-view.tsx`) for IMPULSA Real Estate.

## Work Done

### Files Created/Modified
1. **`src/components/faq/faq-view.tsx`** (created) — comprehensive SEO-optimized FAQ section
2. **`src/app/page.tsx`** (rewritten) — wired all 5 views (home, agents, gallery, dashboard, faq) using Zustand store + URL deep-linking via `?v=faq`
3. **`next.config.ts`** (updated) — added `images.remotePatterns` for Unsplash hosts to fix home view 500 errors
4. **`/home/z/my-project/worklog.md`** (appended) — work record

### FAQView Component Highlights
- **Schema.org JSON-LD** with `FAQPage` schema, all 12 Q&As as `Question`/`Answer` entities, injected via `dangerouslySetInnerHTML`
- **12 SEO-optimized FAQs** in Spanish covering all required keywords: requisitos para extranjeros, comprar propiedades en República Dominicana, ROI inmobiliario, inversión bienes raíces, financiamiento hipotecario, calculadora hipotecaria, impuestos property, mejores zonas para invertir, metas de ahorro, asesoría inmobiliaria
- **Two-column layout**: LEFT sticky sidebar (1/3) with search input + category filters + emerald CTA card; RIGHT (2/3) accordion with FAQ items
- **Custom Plus/Minus icons** on accordion (default chevron hidden via `[&>svg:last-child]:hidden`); visibility toggled via `group-data-[state=open]` utilities
- **Real-time search filter** by question, answer, or keywords; category chips
- **Empty state**: shows "Sin resultados" when no matches
- **Bottom CTA strip**: "¿No encuentras tu respuesta?" with anchor to contact form
- **Contact form section**: glass effect + gold accents, split layout (emerald info panel + form), fields for name/email/question, submits to `/api/inquiry?XTransformPort=3000`, shows success toast via sonner
- **Framer Motion** entrance animations: staggered accordion items, motion sidebar, motion header
- **Responsive**: mobile-first, lg breakpoint switches to two-column layout
- **pt-28** top padding to clear fixed header

### Verification
All verifications done via `agent-browser` headless browser:
- ✅ Page title correct
- ✅ H1 "Resolvemos tus dudas" renders
- ✅ JSON-LD script present in DOM with FAQPage + Question + Answer structure
- ✅ 12 accordion items render correctly
- ✅ Search filter works (filter to 2 results, or 0 with empty state)
- ✅ Contact form submission shows success toast with user name + email
- ✅ Plus/Minus icon toggle verified (open=Minus visible, closed=Plus visible)
- ✅ Lint passes with 0 errors and 0 warnings

## For Next Agents
- The FAQ view is complete and verified
- Page.tsx is now wired to switch between all 5 views — if you're building other views, you don't need to modify page.tsx
- next.config.ts now allows Unsplash images — your image-based views will work
- Default view is still 'home' (FAQ is accessible via nav menu or `?v=faq`)
