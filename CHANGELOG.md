# Changelog

All notable changes to this project will be documented in this file.

## [3.5.4] - 2026-08-28

### Security
- Loading a budget file via URL is now hardened against SSRF: DNS results are pinned, redirects are blocked, and private/internal IP detection was expanded.
- pnpm now enforces a 7-day release age check and a trust policy to protect against supply-chain attacks.

### Fixed
- Trend lines, rolling averages, and year-over-year comparisons in the insights now calculate correct values, and recurring entries are attributed to the correct months.
- The monthly view now shows correct results for months that contain only expenses, and category tables no longer show stale data after switching months.
- Tables are now fully keyboard-accessible: sort buttons work with the keyboard, announce their sort state, and all tables have hidden captions for screen readers.
- The forecast no longer shifts months in timezones behind UTC.

### Changed
- Charts and the Bootstrap script bundle now load on demand, noticeably speeding up the initial page load.
- The site now uses the system font stack instead of remote Google Fonts — faster loading and better privacy.
- General code cleanup: React best practices applied (react-doctor score 47 → 100), dead code removed, and uploaded files validated through one shared schema.
- Dependencies updated (Next.js, React and others).

## [3.5.3] - 2026-07-25

### Fixed
- Example data download link no longer returns a 404 — testdata.yaml is now served as a static asset.
- Suppressed React hydration warnings on the root HTML element to avoid console noise.

## [3.5.2] - 2026-07-25

### Removed
- Removed the service worker and offline page — no longer needed.

## [3.5.1] - 2026-07-25

### Fixed
- Content Security Policy now allows analytics connections to umami.lucanerlich.com.

### Changed
- Updated project dependencies to their latest versions.

## [3.5.0] - 2026-06-05

### Added
- Light and dark theme with a toggle in the header — remembers your choice and follows your system preference.

### Changed
- Modernized the entire interface: new typography, color palette, refined cards, tables, navigation, and charts.

### Fixed
- "Prozentwerte anzeigen" now shows percentage labels directly on the income/expense charts.
- Insights KPI cards now have equal height with aligned values.

## [3.4.1] - 2026-06-05

### Fixed
- March now displays consistently as "März" across the monthly header, yearly table, and month dropdown.

### Changed
- Refactored budget statistics, date, color, month, and chart helpers into plain, directly testable modules.

### Removed
- Removed the unused and unvalidated `/api/getFile` server endpoint.

## [3.4.0] - 2026-06-05

### Added
- Automated test suite (Vitest) covering budget resolution and cashflow calculations.

### Changed
- Recurring transactions are now resolved once into a single budget model shared across all views, giving consistent results in the monthly, yearly, and insights pages.
- Insights (Trends & Forecasts, Savings KPIs, Cashflow Timeline) now share one cashflow computation instead of each recomputing it.
