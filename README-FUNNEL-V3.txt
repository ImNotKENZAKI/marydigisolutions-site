MARY DIGI SOLUTIONS — FUNNEL V3
Phase 5 hierarchy and motion refinement
Prepared: 2026-08-31

SCOPE
- The existing Mary Digi Solutions website remains outside this funnel edit.
- Phase 5 remains limited to funnel.html, css/funnel-v3.css, js/funnel-v3.js,
  and this README.
- Main-site pages, shared styling, shared scripts, and generated image assets
  are preserved.

FUNNEL GOAL
Move a serious inquiry through one accountable journey:
campaign -> context-rich form -> CRM ownership -> human review -> approved
private booking or the appropriate next action -> follow-up.

LIVE INTEGRATIONS
- GoHighLevel review form ID: C1jXge5rKokviFFkTBml
- Demo video: https://www.youtube.com/watch?v=Lv1jWaATdIY&t=2s
- There is no public calendar or browser-side booking unlock in this funnel.
- Booking remains an MDS-controlled private invitation after human review.
- Live GoHighLevel submission behavior, CRM mapping, notifications, pipeline
  ownership, and approved follow-up must be verified in the connected account.

ATTRIBUTION AND MEASUREMENT
- The funnel preserves utm_source, utm_medium, utm_campaign, utm_content,
  utm_term, gclid, and fbclid during the browser session and appends available
  values to the GoHighLevel form URL.
- Privacy-safe CustomEvent hooks use the event name mds:funnel-event.
- If an existing dataLayer array is present, the same non-PII events are pushed
  to it. The funnel does not add a new analytics vendor.
- Tracked interactions cover CTA clicks, key-section views, form view, and
  demo open/close. No form answers or personal details are included.

CONTENT AND UX
- Primary CTA: Request a Free Funnel Review.
- The five-stage model clearly separates human qualification from approved
  private booking and follow-up.
- Delivery process and FAQ sections explain scope, implementation, and the
  post-submission review path without unverified claims.
- The form includes a visible email fallback and a static pending-review note.

GRAPHICS
- Existing approved CEO, service, demo, and five-person team assets are reused.
- Team order remains Mariane, Marvin, Mary, Bless, Jeff.
- The five-person source image is displayed without forced cover cropping or
  zoom animation, keeping Mariane and Jeff visible at the outer edges.
- No faces or source images were regenerated during Phase 3.

PHASE 3 VISUAL SYSTEM
- One final blue-gold presentation layer consolidates the previous visual
  overrides without removing Phase 2 content or functionality.
- Hero typography, overlays, proof chips, workflow rail, and ambient motion are
  reduced and aligned to a clearer hierarchy.
- Section spacing, cards, metrics, process, team, engagement, FAQ, form, and
  footer now share one radius, border, shadow, and motion language.
- Motion remains continuous only for ambient/system cues and respects the
  reduced-motion preference.
- Header navigation reflects the section currently in view, and FAQ panels
  behave as a focused accordion.

PHASE 4 ACCEPTANCE CORRECTION
- Removed the original cover-crop and zoom behavior from the team portrait.
- Locked the five-person artwork to its native 1672:941 composition so
  Mariane and Jeff remain visible at the outer edges.
- Added asset and stylesheet versioning to prevent an older cached crop from
  appearing during local review.
- Reduced the team stage to a controlled editorial width and moved its caption
  below the image so it no longer covers a team member.
- No image was regenerated and no funnel, form, CRM, or booking logic changed.

PHASE 5 HIERARCHY AND MOTION REFINEMENT
- Refined the existing final visual layer directly instead of adding another
  competing theme or override block.
- Reduced repeated oversized headings, section padding, and card heights to
  create a more editorial, premium rhythm across the full page.
- Simplified the hero by disabling redundant grid and overlay drift while
  retaining the gold title treatment and the meaningful live journey motion.
- Reduced the intensity of ambient image and icon motion and slowed the CTA
  sheen so continuous effects support the message instead of competing with it.
- Improved tablet and mobile hero proportions to reduce excessive first-screen
  height while keeping the CEO portrait, copy, and workflow rail readable.
- Structural counters still animate once on entry; inquiry and system states
  remain continuous and respect reduced-motion preferences.
- No content claims, source images, form integration, CRM flow, booking gate,
  or main-site file changed.

VALIDATION REQUIRED BEFORE RELEASE
- JavaScript syntax and CSS brace checks
- Local reference and anchor checks
- Desktop, tablet, and mobile visual review over an HTTP/deployed preview
- Keyboard review of skip link, FAQ controls, CTAs, form, and video modal
- Live GoHighLevel test submission from campaign URL through CRM and manual
  approval, using test contact data
- Confirm private booking is sent only by the approved MDS workflow

UPLOAD
Do not create or upload a release ZIP until the scoped validation above passes.
When approved, upload the package contents so index.html and funnel.html remain
at the repository root.
