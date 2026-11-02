# News18 Header Test Plan

**Target:** https://www.news18.com/  
**Area:** Site header only: brand/edition row, primary navigation, trending strip, and visible header actions  
**Reference:** User-provided desktop screenshot (approximately 1365 × 201 px) and a live-page inspection on 2 November 2026  
**Plan type:** Manual and Playwright-ready functional, visual, responsive, accessibility, and resilience coverage

## 1. Objective

Verify that the News18 header is visible, understandable, operable, and consistent across supported viewports and input methods. Confirm that header controls lead to the intended destinations or expose their intended menus, and that dynamic content (such as date/time and trending links) remains usable.

The screenshot depicts an English edition selector, date/time, app and live-TV calls to action, “NEWS for you”, a category navigation row, notification and Ask News18 controls, Sign in, a trending strip, and social links. The live page may render a different header due to responsive rules, experiments, edition, personalization, or time-sensitive changes. Treat the current approved design/configuration as the source of truth; do not fail a run solely because an item in the screenshot is intentionally hidden or replaced in the live variant.

## 2. Scope

### In scope

- News18 logo and home navigation
- Edition/language selector and displayed date/time
- Download app, Watch Live TV, and News for you actions
- Primary category navigation: Home, India, World, Explainers, DataPop, Cricket, Cities, Movies, Lifestyle, Business, Tech2, Latest, and More
- Any dropdown/overflow navigation, including chevron-marked categories
- Notification bell, Ask News18, and Sign in
- Trending label, ticker/list, and topic links
- Follow Us and social-network links/icons
- Header layout, visibility, keyboard interaction, accessibility, and behavior under loading/network conditions

### Out of scope

- Article/body content, footer, search results, video playback, account creation/authentication internals, notification delivery, app installation, and destination-site functionality beyond confirming navigation behavior
- Full-site performance or SEO testing (header-specific loading and layout stability remain in scope)

## 3. Preconditions and test data

1. Use a fresh browser context for each independent scenario unless a step explicitly tests persistence or browser history.
2. Start at `https://www.news18.com/` over HTTPS. Record the browser, viewport, timestamp, locale, and any consent/personalization prompt shown.
3. Use a clean storage state for first-visit checks; separately repeat relevant checks with consent accepted and with edition/preferences already selected.
4. Record the header variant, visible items, menu contents, and link destinations before asserting against them. Do not hard-code trending headlines, social URLs, date, or time.
5. Test at least Chromium, Firefox, and WebKit where supported. Use a desktop viewport around 1365 × 768 and representative tablet/mobile viewports (e.g. 768 × 1024 and 390 × 844); include 320 px width as a narrow-screen stress case.
6. If a third-party destination, sign-in flow, prompt, or menu is blocked by environment restrictions, assert the stable first-party behavior up to the boundary and record the limitation.

## 4. Priority and execution guidance

- **P0:** Header visibility, logo/home route, primary navigation, critical action reachability, no blocking overlap, and keyboard operability.
- **P1:** Dropdowns, edition selection, trending links, account/notification/Ask actions, social links, responsive behavior, and assistive-technology semantics.
- **P2:** Slow/offline conditions, long labels, browser history, zoom, and fine-grained visual consistency.

Run P0 on each supported browser and major viewport before release. Run P1 in the main browser/viewport matrix and after navigation/header changes. Run P2 for release qualification and when the relevant integration or styling changes.

## 5. Test scenarios

### H01 — Initial header renders in the approved configuration (P0)

1. Open the home page in a fresh context and wait for the page to settle.
2. Inspect the header at the top of the page and compare it with the approved design for the selected edition and viewport.
3. Check the brand, applicable utility actions, primary navigation, and trending region.

**Expected:** The header is present, complete for the active variant, and visually coherent. No broken images, placeholder labels, duplicate rows, horizontal page overflow, or content obscuring a control. Conditional items are not treated as missing if the active design intentionally omits them.

### H02 — News18 logo returns to the home page (P0)

1. Open a first-party section page, then activate the News18 logo by mouse.
2. Repeat using keyboard focus and Enter.

**Expected:** Both activations navigate to the correct News18 home page. The logo has an accessible name; the link destination is valid and does not point to an unintended host.

### H03 — Edition/language selector opens and lists available editions (P1)

1. Activate the visible edition/language control.
2. Inspect the choices and move through them using keyboard navigation.
3. Dismiss the selector with Escape and by clicking outside it.

**Expected:** The control opens a usable, labelled menu/list of available editions. Focus and selection are apparent, Escape/outside dismissal behaves consistently, and the menu does not clip off-screen or cover unrelated controls without a usable dismissal path.

### H04 — Selecting an edition updates the site context (P1)

1. Open the edition selector and select another available edition/language.
2. Observe the page/header and reload.
3. Return to the original edition if the interface supports it.

**Expected:** The selected edition is applied according to product behavior (for example, edition label, language, content, or destination changes) and persists only as designed. No broken route, mixed-edition label/content state, or loss of the ability to return.

### H05 — Date and time display is valid and current (P1)

1. Record the displayed date/time and the browser/device timezone.
2. Check formatting, separators, locale, and update behavior over an appropriate interval or after refresh.

**Expected:** Date/time is legible, valid, and consistent with the site's documented timezone/locale behavior. It does not show invalid text, stale placeholder content, or an impossible date. Do not assert a fixed literal timestamp.

### H06 — Download News18 App action (P1)

1. Activate the app-download action.
2. Record whether it opens a store, an app landing page, or a QR/details panel; verify its destination in the current environment.
3. Return to the home page.

**Expected:** The action reaches the intended first-party app destination or official store listing. Any new tab/window is intentional, identifiable, and usable; the source page remains available.

### H07 — Watch Live TV action (P1)

1. Activate Watch Live TV.
2. Observe the destination and whether a new tab/window is opened.

**Expected:** The control reaches the intended News18 live-TV experience or official destination. No dead link, unrelated destination, or unexpected loss of the home page.

### H08 — “News for you” action (P1)

1. Activate the News for you control.
2. Inspect the resulting page, panel, or sign-in/personalization prompt.
3. Close or return using the provided control/browser back.

**Expected:** The action opens its intended personalization experience. Any authentication requirement is communicated clearly, and the user can return without a stuck overlay or broken header.

### H09 — Primary navigation links open their matching sections (P0)

1. Activate each visible direct-navigation item from the approved configuration: Home, India, World, Explainers, DataPop, Latest, and any other non-dropdown category.
2. For each destination, verify the URL and page/section identity; use browser back to return.

**Expected:** Each item reaches the corresponding News18 section and remains on the intended domain unless an explicitly documented external destination applies. No wrong-section routes or dead links.

### H10 — Dropdown navigation opens and exposes the correct options (P1)

1. For each chevron/dropdown item present (such as Cricket, Cities, Movies, Lifestyle, Business, and More), open it by pointer.
2. Repeat by keyboard; inspect all options and activate a representative option from each menu.
3. Close with Escape, outside click, and focus movement.

**Expected:** Each menu is attached to its trigger, exposes relevant links, and remains usable without accidental closure while moving into it. Keyboard focus can enter, traverse, activate, and leave the menu. The selected destination matches the menu item.

### H11 — More/overflow navigation remains discoverable (P1)

1. At desktop width, inspect whether all categories fit or are intentionally placed in More.
2. Open More and inspect entries not displayed in the main row.
3. Repeat at a narrower desktop/tablet width.

**Expected:** No category disappears without an approved alternative. Overflow items are reachable, labels are understandable, and the menu fits in the viewport.

### H12 — Notification control interaction (P1)

1. Activate the notification bell.
2. Inspect whether it opens a panel, requests permission, or prompts for sign-in.
3. Dismiss the result and reload.

**Expected:** The outcome is explicit and consistent with permission/authentication state. The browser permission request is triggered only by a user action; denying permission does not break the header or repeatedly prompt without explanation.

### H13 — Ask News18 interaction (P1)

1. Activate Ask News18.
2. Inspect the resulting page, panel, or prompt; test its close/back behavior.

**Expected:** The control opens its intended Ask experience or gives a clear unavailable/authentication state. No inert control, blank destination, or trapped focus.

### H14 — Sign-in entry point (P1)

1. Activate Sign in while signed out.
2. Verify the sign-in entry point, URL/origin, and any new tab or dialog.
3. Close/back out without submitting credentials.

**Expected:** The user is taken to the official authentication flow with a clear way to return. The test does not submit real credentials. Focus is managed if a modal/dialog is used.

### H15 — Trending strip content and links (P1)

1. Inspect the trending label and current list/ticker.
2. Activate multiple topic links, including one near the start and one near the end of the visible strip.
3. Return to the home page.

**Expected:** The region is identifiable as trending content; each topic is an operable link to the matching story/topic. Link labels are not clipped to the point of ambiguity, and navigation does not accidentally select a neighboring item.

### H16 — Trending ticker movement and reduced motion (P2)

1. Observe the strip for at least one movement/rotation interval, if it animates.
2. Try interacting with a moving item.
3. Enable reduced-motion preference and repeat.

**Expected:** Motion does not make content impossible to read or activate. Reduced-motion settings are respected where applicable, and the ticker does not cause unexpected focus movement or keyboard traps.

### H17 — Follow Us/social links (P1)

1. Activate each visible social icon/link individually.
2. Check destination, tab behavior, and accessible name without relying on the icon alone.

**Expected:** Each icon opens the correct official account/platform; external links are identifiable and safe. New tabs are intentional and the original page remains available.

### H18 — Keyboard-only navigation and focus visibility (P0)

1. Reload and use Tab/Shift+Tab from the browser address bar through the header.
2. Open and operate each visible menu/control using keyboard only.
3. Press Escape where appropriate; continue into the page and Shift+Tab back.

**Expected:** Every interactive header element is reachable in a logical order, has a visible focus indicator, and can be activated without a pointer. Focus is not lost behind overlays or trapped in a closed menu.

### H19 — Accessible names, roles, and states (P1)

1. Inspect the header with an accessibility tree or screen reader.
2. Check landmark structure, logo name, control names, menu roles, expanded/collapsed state, and social-icon labels.

**Expected:** Header/navigation landmarks and interactive semantics are meaningful. Icon-only controls have accessible names; dropdown state is announced; decorative icons are not redundantly announced. No controls are exposed as unlabeled generic elements.

### H20 — Responsive header at desktop, tablet, and mobile widths (P0)

1. Load the page at desktop, tablet, and mobile widths specified in Preconditions.
2. At each width, inspect the header, navigation, trending region, and available menu/overflow controls.
3. Rotate the device/emulate portrait and landscape where supported.

**Expected:** The header adapts to the intended layout: no overlap, clipping, unreadable text, inaccessible off-screen controls, or page-level horizontal scroll. Mobile navigation remains operable and can be dismissed.

### H21 — Narrow viewport and long-content stress (P2)

1. Use the narrow 320 px viewport and a larger text/font scaling setting.
2. Check long edition labels, trending headlines, and category names.

**Expected:** Important controls remain available; text wraps, truncates with a usable accessible name, or moves into an overflow pattern by design. No control becomes impossible to activate.

### H22 — Header behavior while scrolling (P1)

1. Scroll down through the page, then return to the top.
2. Observe whether the header or any row is sticky/fixed; interact with a visible control if it remains pinned.

**Expected:** The header follows the approved sticky behavior without covering focused content, creating duplicate controls, or obscuring the article/page. If it is not sticky, it does not unexpectedly remain over content.

### H23 — Browser history and direct section entry (P1)

1. Open a section through header navigation, then use browser back and forward.
2. Direct-load the section URL and reload it.

**Expected:** URL, selected/active navigation state (if provided), and content stay synchronized. Back/forward does not leave a stale menu open or lose the header.

### H24 — External-link safety and destination integrity (P1)

1. Inspect app, live-TV, social, and other external links before activating.
2. Check scheme, hostname, new-tab behavior, and opener isolation where a new tab is used.

**Expected:** HTTPS is used where supported; external destinations match the label and are official or documented destinations. No malformed URLs or unsafe new-window behavior.

### H25 — Header resilience to slow or failed resources (P2)

1. Throttle network and load the home page.
2. Repeat with representative image/script requests blocked or failed in a controlled test environment.
3. Attempt to use the header before and after the rest of the page finishes loading.

**Expected:** Header text and essential navigation remain usable; missing assets do not replace labels with blank controls or break layout. Failures are visible/diagnosable and do not leave a blocking loader over the header.

### H26 — Consent/personalization and returning-visitor state (P1)

1. Test first visit with no saved consent/preferences.
2. Accept or reject optional consent if prompted; reload and revisit.
3. Repeat with an existing edition or personalization preference.

**Expected:** Any prompt does not permanently obscure the header or make it inaccessible. Choices persist according to policy, and personalization does not create inconsistent edition/navigation state.

### H27 — Refresh and repeated use (P2)

1. Open and close several menus, navigate away/back, and reload.
2. Repeat activating a control once after reload.

**Expected:** No duplicate menus, stale overlays, broken controls, or duplicate navigation caused by repeated use. The header initializes cleanly each time.

### H28 — Zoom, contrast, and visual clarity (P1)

1. Test at 200% browser zoom and with supported contrast/accessibility settings.
2. Inspect text, icons, focus states, and separators against the page background.

**Expected:** Header content remains perceivable and operable without overlap or loss of essential actions. Text and interactive-state contrast meet the product’s applicable accessibility target.

### H29 — No blocking runtime errors during header use (P1)

1. Capture console/page errors on initial load.
2. Exercise dropdowns, edition selection, and key header actions.

**Expected:** Header interactions introduce no uncaught errors or failed first-party requests. Separate pre-existing or third-party warnings from regressions; record reproducible errors with the action, browser, and timestamp.

## 6. Cross-browser and viewport matrix

| Browser engine | Desktop ~1365 px | Tablet ~768 px | Mobile ~390 px | Narrow 320 px |
|---|---:|---:|---:|---:|
| Chromium | P0 + P1 | P0 + responsive P1 | P0 + responsive P1 | P2 |
| Firefox | P0 + P1 | P0 + responsive P1 | P0 + responsive P1 | P2 |
| WebKit | P0 + P1 | P0 + responsive P1 | P0 + responsive P1 | P2 |

Use the real approved desktop browser/device matrix if it differs. Run keyboard and screen-reader checks with at least one supported desktop screen reader and a mobile screen reader for the mobile navigation.

## 7. Entry and exit criteria

### Entry

- Target site is reachable and the test browser has network access.
- Approved expected header variant or reference screenshot is available for the test edition and viewport.
- Test run records consent state, locale/timezone, browser version, viewport, and date/time.

### Exit

- All P0 scenarios pass on the supported browser/viewport baseline.
- P1 scenarios are completed or have explicitly documented environment/product limitations.
- No open blocker prevents logo navigation, primary navigation, or use of essential header controls.
- Failures include reproducible steps, actual/expected behavior, browser/viewport, and screenshot or trace where useful.

## 8. Automation notes

- Prefer role/name-based locators and user-visible outcomes; avoid selectors tied to generated CSS classes or changing headlines.
- Assert stable navigation behavior and destinations rather than hard-coding daily trending text or the displayed time.
- Parameterize direct navigation items and dropdown triggers from the approved header configuration.
- Keep each scenario independent; isolate consent, edition, and permission state where those affect behavior.
- For new tabs, assert the intended destination and preserve the original page. Do not submit real sign-in credentials or grant browser permissions without a test-specific requirement.
- Capture a screenshot/trace on failure. Treat third-party outages separately from first-party header failures.
