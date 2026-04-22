# Claude Console Quickstart Mobile UX Audit

An unofficial frontend interaction prototype exploring how a dense, step-based console workflow can adapt to mobile viewports without squeezing the main workspace beside navigation or turning the page into one long stacked scroll.

This project focuses on the Quickstart flow inside a small console-style shell. It is not a pixel-perfect recreation of Claude Console. It uses a similar dark, console-inspired visual direction to keep the context recognizable, while the layout and interaction decisions are intentionally focused on responsive behavior and mobile information architecture.

## Project Goal

The goal of this prototype is to demonstrate a mobile-first approach to a multi-step setup flow.

On desktop, a console interface can support multiple visible surfaces at once: sidebar navigation, prompt area, template browser, code preview, and setup controls.

On mobile, preserving those panels side-by-side can compress the active screen and make the experience difficult to use. This prototype explores a different approach:

- navigation becomes an overlay drawer
- the active screen keeps full width
- Quickstart becomes a focused step flow
- template/code views use tabs instead of side-by-side panels
- primary actions stay reachable through sticky controls
- long code content scrolls inside a confined region instead of stretching the entire page

## Why Only Quickstart?

This case study intentionally focuses on the Quickstart workflow because it already contains many of the hardest responsive frontend challenges:

- shared console shell
- sidebar and mobile navigation behavior
- multi-step setup framing
- template discovery
- template detail view
- YAML / JSON code preview
- copy actions
- success state
- empty follow-on state
- sticky mobile actions
- mobile information architecture

The prototype does not include other pages available on the Official Claude Console platform or a real backend/API. The scope is intentionally narrow so the Quickstart interaction model can be explored in more depth.

## Problem Framing

On narrow screens, a persistent sidebar or expanded menu can reduce the usable width of the active workspace. Even when the sidebar is collapsed into a narrow rail, console pages that rely on desktop split layouts can still become difficult to read or interact with.

The core issue is not only navigation. It is also how dense desktop workflows adapt on mobile.

This prototype addresses that by separating the mobile experience into focused panels rather than stacking every desktop section vertically.

## Implemented Prototype

| Area | Behavior |
|---|---|
| **Shell** | Desktop uses a collapsible sidebar and full main column. Mobile uses a top bar, full-width main content, and an overlay drawer built with Radix Dialog. The drawer does not sit beside or squeeze the active screen. |
| **Breakpoint** | `useMediaQuery('(min-width: 768px)')` in `Quickstart.tsx` switches between desktop and mobile layout models. |
| **Stepper** | Four setup phases are represented: Create agent → Configure environment → Start session → Integrate. Start session and Integrate are shown as future steps but are not built as separate screens. |
| **Create agent — browse** | Includes template search, template cards, and empty-search feedback. Mobile uses a Describe/Templates segmented view instead of side-by-side columns. Desktop uses a split prompt + template browser layout. |
| **Create agent — template detail** | Includes title, description, YAML/JSON toggle, code preview, copy action, and Use this template action. Mobile presents this as a focused template workspace with sticky bottom action. |
| **Agent created** | Shows success state, agent description, API call snippet, config/code preview, and preview placeholder. Mobile uses Call / Config / Preview tabs with a sticky Next: Configure environment action. |
| **Configure environment** | Shows the empty environment state, Configure environment CTA, Back action, and disabled Continue state. The prototype stops here while the stepper highlights step 2. |

## Key files

| Path | Role |
|------|------|
| `src/pages/Quickstart.tsx` | Quickstart flow, breakpoint branching, stepper, template and agent states |
| `src/components/AppShell.tsx` | Page chrome: sidebar column, main column, mobile drawer |
| `src/components/Sidebar.tsx` | Desktop sidebar (collapse / expand) |
| `src/components/TopBar.tsx` | Mobile header and menu trigger |
| `src/components/MobileDrawer.tsx` | Overlay navigation (`@radix-ui/react-dialog`) |
| `src/data/navItems.ts` | Single nav entry (Quickstart) |

## Tech stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Radix UI (Dialog)
- lucide-react

## Running locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Screenshots

Coming soon.

## Demo

- **Live demo:** coming soon
- **Screen recording:** coming soon

## Disclaimer

This is an independent, unofficial case study. It is not affiliated with Anthropic and is not intended to reproduce Claude Console exactly. The focus is on frontend interaction design, responsive layout behavior, and mobile workflow adaptation.