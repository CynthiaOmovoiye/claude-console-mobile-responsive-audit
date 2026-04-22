# Claude Console Mobile Responsive Layout Audit

This is a small frontend audit and responsive layout prototype based on a mobile web issue observed in Claude Console.

The goal is not to redesign Claude Console, but to demonstrate a possible layout direction for preventing content compression across the shared console shell on mobile screens.

## Problem framing

The sidebar is collapsible, but expanding it on mobile appears to affect the layout flow and squeeze the active screen. Even when collapsed, some console screens still preserve desktop-style split layouts that make the main content difficult to read on narrow viewports.

## What this prototype demonstrates

- Desktop sidebar layout (including collapse to an icon rail)
- Mobile drawer navigation (overlay, not flex-sibling)
- Full-width mobile main content
- **Quickstart** as a hero flow: desktop multi-panel layout vs mobile **Focused Mobile Workspace** (see below)
- Responsive cards, lists, and dashboard blocks on other pages

## Mobile UX: Focused Mobile Workspace

The desktop Quickstart experience shows several surfaces at once because there is enough horizontal space. On narrow viewports, mirroring that as one long vertical stack makes the flow hard to follow and pushes primary actions below excessive scrolling.

This prototype treats **mobile Quickstart** differently: it preserves the **same user journey** while changing the **layout model**. Navigation stays in an overlay drawer; the Quickstart flow becomes a **focused workspace**—one primary task surface at a time—with a compact step indicator, **Describe / Templates** segmentation instead of side-by-side columns, **full-screen template detail** with YAML/JSON tabs and **scroll confined to the code area**, **Summary / Config** tabs after agent creation, and **sticky bottom actions** so “Use this template”, “Next: Configure environment”, and similar controls stay reachable.

**Implementation reference:** `src/pages/Quickstart.tsx` (branching on `useMediaQuery('(min-width: 768px)')` for mobile vs desktop).

## Scripts

```bash
npm install
npm run dev
npm run build
```

## Screenshots

Coming up
