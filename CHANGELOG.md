# Changelog

All notable changes to this project will be documented in this file.

## [3.4.0] - 2026-06-05

### Added
- Automated test suite (Vitest) covering budget resolution and cashflow calculations.

### Changed
- Recurring transactions are now resolved once into a single budget model shared across all views, giving consistent results in the monthly, yearly, and insights pages.
- Insights (Trends & Forecasts, Savings KPIs, Cashflow Timeline) now share one cashflow computation instead of each recomputing it.
