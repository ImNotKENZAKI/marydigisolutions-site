# MDS website refresh — October 2026

The main website is static HTML. No build step is required for GitHub Pages.

- Home, Services, Portfolio, and Contact use `css/refresh.css` and `js/refresh.js` directly.
- Team, Process, legal pages, and Thank You retain their existing main content and legacy presentation dependencies, with the shared refreshed header, footer, and chat control.
- `funnel.html` remains independent. Its review-first form, private booking workflow, scripts, and approved team image are preserved.
- Original image assets remain available. Optimized founder portraits, project covers, and the logo are in `img/refresh/`.
- Bump the resource version in affected HTML files when editing the shared CSS or JavaScript.

## Lead flow

The standard website's primary action links directly to `contact.html#inquiry`. The Contact page retains the original website inquiry form and optional public strategy-call calendar. The campaign funnel retains its separate human-review process before a booking invitation.

## Measurement

`js/refresh.js` emits `mds:site-event` browser events for review clicks, project-link clicks, and successful chat-open calls. It also pushes these events to an existing `window.dataLayer` array when one is configured. Event details contain the event name, source label, and page pathname; form inputs are not collected by these hooks.

These are interaction hooks, not an installed analytics provider or confirmed lead conversions. Completed inquiry, qualification, and booking reporting should be connected to the chosen analytics/CRM setup separately. A click must not be counted as a submitted lead.

## Validation

The release was checked for local resource and anchor links across all 10 top-level pages, preserved project links and embed identifiers, JavaScript syntax, keyboard/menu behavior, FAQ interaction, compact chat opening/closing, desktop rendering, and narrow phone/tablet layouts. No test inquiries or appointments were submitted. Legal page body content was retained.
