# ⚡ ARCHITECT CODEBASE DIGEST & FAST-BOOT MEMORY
> Auto-generated & maintained by **Rawan MCP (Architect-Mentor)**.
> **Project:** `packages` | **Root:** `e:\boost engine mobile apps\04_Client_Projects\Ecom-app\packages`
> **Last Synced:** `2026-09-16T05:35:56.824Z`

---

## 🚀 1. Tech Stack & Platform Matrix
- **Primary Type:** TypeScript + JavaScript + HTML/CSS Project
- **Languages:** TypeScript, JavaScript, HTML/CSS
- **Frameworks:** Standard / Vanilla
- **Databases / ORM:** None explicitly configured
- **State Management:** Local Component State
- **Networking & Realtime:** Standard HTTP
- **Testing:** None detected

---

## 🔑 2. Primary Entry Points
- No standard entrypoint found

---

## 🗺️ 3. Architecture Blueprint & Layer Map
| Layer / Domain | Files | Purpose & Responsibilities |
| :--- | :---: | :--- |
| **API & Routing** | `37` | Routes, Controllers, Endpoints, API Handlers |
| **Data Models & Persistence** | `26` | Database Models, Schemas, Entities, Migrations |
| **Business Logic & Domain Services** | `6` | Core Services, Domain Managers, Business Rules |
| **UI Presentation Layer** | `76` | Screens, Views, Components, Pages, Widgets |
| **Utilities & Shared Helpers** | `11` | Utility functions, Helpers, Client Wrappers |
| **Config & Environment** | `57` | Configuration files, Environment loaders, Constants |

---

## 🛡️ 4. Established Architectural Rules & Conventions
- 💡 Strict TypeScript: Prefer explicit types/interfaces over `any`; use zod/valibot for runtime payload validation.
- 💡 Network Resilience: Never use bare fetch() without AbortController timeout and exponential backoff retry.
- 💡 Zero-Downtime Migration: Never alter database column names in-place; follow expand-and-contract deployment.

---

## 📌 5. Session Decisions & Continuous Context Log
### 📝 Initial Codebase Memory Baseline Established *(2026-09-16T05:35:56.824Z)*
- **Rationale:** Workspace indexed to enable zero-token fast boot across sessions.


---

## 📂 6. Core File Quick-Catalog (Top 120 Files)
| File Path | Layer | Size | Export Signatures & Purpose |
| :--- | :--- | :---: | :--- |
| `create-boost-app/templates/backend-express/src/models/index.ts` | Data Models & Persistence | 0.1KB | index module |
| `create-boost-app/templates/backend-express/src/models/Order.ts` | Data Models & Persistence | 2.2KB | Order module |
| `create-boost-app/templates/backend-express/src/models/Product.ts` | Data Models & Persistence | 1.3KB | Product module |
| `create-boost-app/templates/nextjs/src/models/AbandonedCheckout.ts` | Data Models & Persistence | 3.7KB | AbandonedCheckout module |
| `create-boost-app/templates/nextjs/src/models/AdBanner.ts` | Data Models & Persistence | 0.9KB | AdBanner module |
| `create-boost-app/templates/nextjs/src/models/Banner.ts` | Data Models & Persistence | 1.7KB | Banner module |
| `create-boost-app/templates/nextjs/src/models/Category.ts` | Data Models & Persistence | 1.5KB | Category module |
| `create-boost-app/templates/nextjs/src/models/ContactQuery.ts` | Data Models & Persistence | 0.9KB | ContactQuery module |
| `create-boost-app/templates/nextjs/src/models/Counter.ts` | Data Models & Persistence | 0.4KB | Counter module |
| `create-boost-app/templates/nextjs/src/models/Coupon.ts` | Data Models & Persistence | 1.7KB | Coupon module |
| `create-boost-app/templates/nextjs/src/models/DelhiveryPincode.ts` | Data Models & Persistence | 0.6KB | DelhiveryPincode module |
| `create-boost-app/templates/nextjs/src/models/DiscountPopupConfig.ts` | Data Models & Persistence | 1.1KB | DiscountPopupConfig module |
| `create-boost-app/templates/nextjs/src/models/index.ts` | Data Models & Persistence | 1.7KB | index module |
| `create-boost-app/templates/nextjs/src/models/Order.ts` | Data Models & Persistence | 8.4KB | Order module |
| `create-boost-app/templates/nextjs/src/models/Product.ts` | Data Models & Persistence | 6.3KB | Product module |
| `create-boost-app/templates/nextjs/src/models/PuzzleAttempt.ts` | Data Models & Persistence | 0.6KB | PuzzleAttempt module |
| `create-boost-app/templates/nextjs/src/models/Review.ts` | Data Models & Persistence | 1.0KB | Review module |
| `create-boost-app/templates/nextjs/src/models/Role.ts` | Data Models & Persistence | 0.6KB | Role module |
| `create-boost-app/templates/nextjs/src/models/Setting.ts` | Data Models & Persistence | 11.5KB | Setting module |
| `create-boost-app/templates/nextjs/src/models/SpinAttempt.ts` | Data Models & Persistence | 0.7KB | SpinAttempt module |
| `create-boost-app/templates/nextjs/src/models/Subscriber.ts` | Data Models & Persistence | 0.6KB | Subscriber module |
| `create-boost-app/templates/nextjs/src/models/Tag.ts` | Data Models & Persistence | 0.5KB | Tag module |
| `create-boost-app/templates/nextjs/src/models/UrlPath.ts` | Data Models & Persistence | 0.6KB | UrlPath module |
| `create-boost-app/templates/nextjs/src/models/User.ts` | Data Models & Persistence | 3.8KB | User module |
| `create-boost-app/templates/nextjs/src/models/WarrantyClaim.ts` | Data Models & Persistence | 2.3KB | WarrantyClaim module |
| `create-boost-app/templates/nextjs/src/models/WarrantyRegistration.ts` | Data Models & Persistence | 1.6KB | WarrantyRegistration module |
| `create-boost-app/templates/backend-express/src/routes/auth.ts` | API & Routing | 1.8KB | export authRouter |
| `create-boost-app/templates/backend-express/src/routes/coupons.ts` | API & Routing | 1.5KB | export couponsRouter |
| `create-boost-app/templates/backend-express/src/routes/orders.ts` | API & Routing | 3.6KB | fn computeIndianGst | export ordersRouter |
| `create-boost-app/templates/backend-express/src/routes/payments.ts` | API & Routing | 1.7KB | export paymentsRouter |
| `create-boost-app/templates/backend-express/src/routes/products.ts` | API & Routing | 4.3KB | export productsRouter | export DEMO_CATALOG |
| `create-boost-app/templates/backend-express/src/routes/shipping.ts` | API & Routing | 1.8KB | export shippingRouter |
| `create-boost-app/templates/backend-express/src/routes/support.ts` | API & Routing | 3.0KB | export supportRouter |
| `create-boost-app/templates/nextjs/src/app/api/ad-banner/route.ts` | API & Routing | 0.6KB | fn GET |
| `create-boost-app/templates/nextjs/src/app/api/admin/ad-banner/route.ts` | API & Routing | 2.1KB | fn GET | fn PUT |
| `create-boost-app/templates/nextjs/src/app/api/admin/banners/route.ts` | API & Routing | 3.6KB | fn GET | fn POST | fn PATCH |
| `create-boost-app/templates/nextjs/src/app/api/admin/categories/route.ts` | API & Routing | 3.9KB | fn GET | fn POST | fn PATCH |
| `create-boost-app/templates/nextjs/src/app/api/admin/orders/[id]/invoice/route.ts` | API & Routing | 3.6KB | fn GET |
| `create-boost-app/templates/nextjs/src/app/api/admin/orders/[id]/route.ts` | API & Routing | 2.2KB | fn GET | fn PATCH |
| `create-boost-app/templates/nextjs/src/app/api/admin/orders/route.ts` | API & Routing | 4.2KB | fn GET | fn POST |
| `create-boost-app/templates/nextjs/src/app/api/admin/plugins/route.ts` | API & Routing | 2.6KB | fn GET | fn PATCH |
| `create-boost-app/templates/nextjs/src/app/api/admin/products/[id]/route.ts` | API & Routing | 2.5KB | fn GET | fn PUT | fn DELETE |
| `create-boost-app/templates/nextjs/src/app/api/admin/products/route.ts` | API & Routing | 7.2KB | fn GET | fn POST |
| `create-boost-app/templates/nextjs/src/app/api/admin/settings/route.ts` | API & Routing | 1.7KB | fn GET | fn PUT |
| `create-boost-app/templates/nextjs/src/app/api/admin/stats/route.ts` | API & Routing | 1.5KB | fn GET |
| `create-boost-app/templates/nextjs/src/app/api/admin/upload/route.ts` | API & Routing | 1.2KB | fn POST |
| `create-boost-app/templates/nextjs/src/app/api/ai/assistant/route.ts` | API & Routing | 3.5KB | fn POST |
| `create-boost-app/templates/nextjs/src/app/api/auth/otp/route.ts` | API & Routing | 2.8KB | fn POST |
| `create-boost-app/templates/nextjs/src/app/api/banners/route.ts` | API & Routing | 1.4KB | fn GET |
| `create-boost-app/templates/nextjs/src/app/api/categories/route.ts` | API & Routing | 1.3KB | fn GET |
| `create-boost-app/templates/nextjs/src/app/api/contact/route.ts` | API & Routing | 1.0KB | fn POST |
| `create-boost-app/templates/nextjs/src/app/api/coupons/validate/route.ts` | API & Routing | 3.0KB | fn POST |
| `create-boost-app/templates/nextjs/src/app/api/notifications/whatsapp/route.ts` | API & Routing | 2.9KB | fn POST |
| `create-boost-app/templates/nextjs/src/app/api/orders/[id]/invoice/route.ts` | API & Routing | 3.6KB | fn GET |
| `create-boost-app/templates/nextjs/src/app/api/orders/[id]/return/route.ts` | API & Routing | 2.5KB | Class: frictionless | fn POST |
| `create-boost-app/templates/nextjs/src/app/api/payments/create-order/route.ts` | API & Routing | 2.0KB | fn POST |
| `create-boost-app/templates/nextjs/src/app/api/payments/verify/route.ts` | API & Routing | 3.1KB | fn POST |
| `create-boost-app/templates/nextjs/src/app/api/products/route.ts` | API & Routing | 5.7KB | fn GET |
| `create-boost-app/templates/nextjs/src/app/api/reviews/route.ts` | API & Routing | 2.7KB | fn GET | fn POST |
| `create-boost-app/templates/nextjs/src/app/api/settings/route.ts` | API & Routing | 2.0KB | fn GET |
| `create-boost-app/templates/nextjs/src/app/api/shipping/calculate/route.ts` | API & Routing | 2.4KB | fn POST |
| `create-boost-app/templates/nextjs/src/app/api/warranty/claim/route.ts` | API & Routing | 1.5KB | fn POST |
| `create-boost-app/templates/nextjs/src/app/api/warranty/register/route.ts` | API & Routing | 1.4KB | fn POST |
| `boost-analytics/src/components/AnalyticsDebugger.tsx` | UI Presentation Layer | 11.4KB | fn AnalyticsDebugger |
| `boost-analytics/src/components/BoostAnalytics.tsx` | UI Presentation Layer | 4.0KB | fn BoostAnalytics |
| `boost-analytics/src/components/InAppShield.tsx` | UI Presentation Layer | 1.3KB | fn InAppShield |
| `boost-analytics/src/components/index.ts` | UI Presentation Layer | 0.1KB | index module |
| `boost-ui/src/components/AnnouncementBar.tsx` | UI Presentation Layer | 4.7KB | export AnnouncementBar |
| `boost-ui/src/components/AssuredBadge.tsx` | UI Presentation Layer | 3.0KB | export AssuredBadge |
| `boost-ui/src/components/BankOffersAccordion.tsx` | UI Presentation Layer | 5.3KB | Component: <DEFAULT_OFFERS /> | export BankOffersAccordion |
| `boost-ui/src/components/CartDrawer.tsx` | UI Presentation Layer | 9.3KB | export CartDrawer |
| `boost-ui/src/components/DualMobileActionBar.tsx` | UI Presentation Layer | 4.1KB | export DualMobileActionBar |
| `boost-ui/src/components/Footer.tsx` | UI Presentation Layer | 7.9KB | export Footer |
| `boost-ui/src/components/FrequentlyBoughtTogether.tsx` | UI Presentation Layer | 7.5KB | export FrequentlyBoughtTogether |
| `boost-ui/src/components/LightningDealsBar.tsx` | UI Presentation Layer | 5.2KB | export LightningDealsBar |
| `boost-ui/src/components/MobileBottomBar.tsx` | UI Presentation Layer | 5.8KB | export MobileBottomBar |
| `boost-ui/src/components/Navbar.tsx` | UI Presentation Layer | 13.2KB | export Navbar |
| `boost-ui/src/components/OrderTimeline.tsx` | UI Presentation Layer | 2.7KB | Component: <STAGES /> | export OrderTimeline |
| `boost-ui/src/components/PincodeChecker.tsx` | UI Presentation Layer | 4.8KB | export PincodeChecker |
| `boost-ui/src/components/ProductCard.tsx` | UI Presentation Layer | 6.8KB | export ProductCard |
