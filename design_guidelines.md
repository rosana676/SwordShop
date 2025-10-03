# Sword Shop - Design Guidelines

## Design Approach

**Reference-Based Approach**: Drawing inspiration from modern gaming marketplaces (Steam, Epic Games Store) and secure transaction platforms (PlayerAuctions, G2A), combined with clean admin interfaces like Linear and Notion.

**Core Principle**: Create a trustworthy, gaming-focused marketplace that balances visual appeal with functional clarity for complex escrow transactions.

---

## Color Palette

### Dark Mode (Primary)
- **Background**: 15 8% 12% (deep charcoal, gaming-standard dark)
- **Surface**: 15 8% 18% (elevated cards/panels)
- **Surface Elevated**: 15 8% 24% (modals, dropdowns)

### Brand Colors
- **Primary (Sword Red)**: 0 72% 51% (bold, gaming-inspired red for CTAs and branding)
- **Primary Hover**: 0 72% 45%
- **Secondary (Steel Blue)**: 220 15% 65% (muted blue for secondary actions, trust indicators)

### Semantic Colors
- **Success (Transaction Complete)**: 142 71% 45%
- **Warning (Pending Approval)**: 38 92% 50%
- **Danger (Dispute/Delete)**: 0 84% 60%
- **Info (Escrow Status)**: 217 91% 60%

### Text
- **Primary Text**: 0 0% 98%
- **Secondary Text**: 0 0% 70%
- **Muted Text**: 0 0% 50%

---

## Typography

**Primary Font**: Inter (via Google Fonts CDN)
- Clean, modern sans-serif excellent for UI and data displays
- Weights: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

**Accent Font**: Rajdhani (via Google Fonts CDN)
- Gaming-inspired, geometric sans-serif for headings and brand elements
- Weights: 600 (semibold), 700 (bold)

**Hierarchy**:
- Hero/Page Titles: Rajdhani Bold, 3xl-4xl
- Section Headings: Rajdhani Semibold, 2xl-3xl
- Card Titles: Inter Semibold, lg-xl
- Body Text: Inter Regular, base
- Captions/Meta: Inter Regular, sm, muted color

---

## Layout System

**Spacing Primitives**: Tailwind units of 2, 4, 6, 8, 12, 16, 20 (e.g., p-4, gap-6, mt-8)

**Grid System**:
- Max container width: max-w-7xl (admin dashboard, marketplace)
- Content areas: max-w-6xl
- Forms: max-w-2xl
- Cards grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4

**Vertical Rhythm**:
- Section padding: py-12 (mobile), py-20 (desktop)
- Card padding: p-6
- Component spacing: space-y-6 or gap-6

---

## Component Library

### Navigation
- **Main Header**: Dark surface (18% lightness), sticky top-0, Sword Shop logo (left), search bar (center), user menu + cart (right)
- **Admin Sidebar**: Fixed left panel, icon + label navigation, active state with primary color accent
- **Breadcrumbs**: For deep navigation in admin panel

### Product/Item Cards
- **Structure**: Image (16:9 ratio), game title badge, item name, seller info, price, escrow badge
- **Visual**: Rounded corners (rounded-lg), subtle border, hover lift effect (hover:shadow-xl, hover:-translate-y-1)
- **Status Indicators**: Small badges for "In Escrow", "Available", "Pending Approval"

### Transaction Flow Components
- **Escrow Timeline**: Horizontal stepper showing: Payment → Seller Ships → Buyer Confirms → Complete
- **Proof Upload**: Drag-drop area with preview thumbnails, file type indicators
- **Confirmation Panel**: Split view with buyer/seller actions side-by-side, clear CTAs

### Admin Dashboard
- **Stats Cards**: 4-column grid (desktop), key metrics with icons, trend indicators (up/down arrows)
- **User Management Table**: Sortable columns, action dropdowns, status badges, quick search
- **Activity Log**: Timeline view with user avatars, action descriptions, timestamps

### Forms
- **Input Fields**: Dark surface backgrounds, lighter borders, focus state with primary color ring
- **File Upload**: Drag-drop zones with dashed borders, preview capabilities
- **Action Buttons**: Primary (red), Secondary (outlined steel blue), Danger (outlined red)

### Modals & Overlays
- **Approval/Rejection**: Centered modal, clear actions, reason textarea for rejections
- **User Details**: Side panel slide-in, full user info, action buttons at bottom
- **Transaction Details**: Full escrow status, proof images, message history

### Notifications
- **Toast Style**: Bottom-right, auto-dismiss, color-coded by type (success/warning/error)
- **In-App Alerts**: Banner at top for critical admin actions

---

## Images

### Hero Section (Public Marketplace)
**Large Hero Image**: Yes - dynamic gaming-themed banner showing diverse game items (weapons, skins, characters)
- Placement: Full-width, 60vh height
- Overlay: Dark gradient from bottom (rgba(0,0,0,0.7) to transparent)
- Content: Centered - "Sword Shop" logo, tagline "Compre e Venda Itens de Jogos com Segurança", search bar, featured categories

### Product Listings
- **Item Images**: Required for all products, 16:9 ratio, game screenshots or item renders
- **Seller Avatars**: Small circular images in cards and transaction views
- **Proof Images**: Transaction confirmation screenshots, uploaded by both parties

### Admin Panel
- **User Avatars**: Throughout activity logs and user management
- **No hero images**: Admin is utility-focused, dashboard immediately visible

---

## Page-Specific Layouts

### Public Marketplace Home
1. Hero section with search
2. Featured categories (4-column grid with gaming icons)
3. Recent listings (responsive grid of product cards)
4. Trust indicators (escrow protection badge, user count, transaction stats)
5. Footer with copyright "Todos os direitos reservados © Sword Shop"

### Product Detail Page
- Large image gallery (left 60%), product info + buy button (right 40%)
- Seller verification badge, ratings
- Escrow protection explanation
- Similar items below

### Admin Dashboard
- Sidebar navigation (fixed left)
- Main content area with:
  - Stats overview (top)
  - Pending approvals section
  - Recent activity log
  - Quick actions panel

### User/Seller Dashboard
- Top navigation tabs: My Products, Purchases, Sales, Settings
- Content area matching tab context
- Seller verification status banner (if not approved)

---

## Interaction Patterns

- **Hover States**: Subtle lift + shadow on cards, color transitions on buttons (200ms ease)
- **Loading States**: Skeleton screens for data tables, spinner for actions
- **Empty States**: Friendly illustrations + helpful text (e.g., "Nenhum produto encontrado")
- **Confirmations**: Always for destructive actions (delete account, reject seller)

---

## Accessibility & Quality

- Maintain WCAG AA contrast ratios throughout
- Focus indicators on all interactive elements (ring-2 ring-primary)
- Keyboard navigation support in admin tables and forms
- Screen reader labels for icon-only buttons
- Responsive breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)

---

## Key Design Principles

1. **Trust Through Transparency**: Escrow status always visible, clear transaction states
2. **Gaming Aesthetic**: Dark theme, bold colors, modern typography, but professional
3. **Information Density**: Admin needs rich data displays; public marketplace needs visual appeal
4. **Security Indicators**: Badges, verification marks, escrow protection messaging throughout
5. **Dual Perspective**: Design accommodates buyers, sellers, AND admins seamlessly