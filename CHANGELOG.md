# Changelog

All notable changes to this project will be documented in this file.

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
