# Claude Console Mobile Responsive Layout Audit

This is a small frontend audit and responsive layout prototype based on a mobile web issue observed in Claude Console.

The goal is not to redesign Claude Console, but to demonstrate a possible layout direction for preventing content compression across the shared console shell on mobile screens.

## Problem framing

The sidebar is collapsible, but expanding it on mobile appears to affect the layout flow and squeeze the active screen. Even when collapsed, some console screens still preserve desktop-style split layouts that make the main content difficult to read on narrow viewports.

## What this prototype demonstrates

- Desktop sidebar layout
- Mobile drawer navigation (overlay, not flex-sibling)
- Full-width mobile main content
- Stacked mobile page sections
- Responsive cards, lists, and dashboard blocks

## Scripts

```bash
npm install
npm run dev
npm run build
```

## Screenshots

Coming up
