# Context — ez-budget domain language

The ubiquitous language for this codebase. Name modules, types, and functions after
these terms so the code reads in the domain, not in incidental tech vocabulary.

## Core data

**Entry**
A single income or expense line: `{ category, value, date, comment? }`. `value` is
signed — positive is income, negative is expense.

**Month**
A calendar month within a Year: `{ month: 1–12, entries: Entry[] }`.

**Year**
A calendar year: `{ year, months: Month[] }`.

**Category**
A user-defined label on an Entry (e.g. "Miete", "Gehalt"). Stats roll up per category.

**Recurring rule**
A template that repeats an Entry across a date range:
`{ category, value, comment?, from: "YYYY-MM", until?: "YYYY-MM" }`. A month-specific
Entry of the same `(category, comment)` overrides the rule for that month.

**Budget**
The resolved model the app works against: `{ years: Year[] }` with all Recurring rules
already expanded into the months they apply to. Built once at load (parse → normalize
input shape → expand recurring). Everything downstream reads a Budget, never the raw
uploaded payload.

## Money

**Income**
Sum of positive Entry values.

**Expense**
Sum of negative Entry values. Kept **negative** through the pipeline; take the magnitude
only at presentation.

**Net**
`income + expense` for a span (expense is negative, so this is income minus spend).

## Derived

**Cashflow**
The month-by-month view of money moving through a Budget.

**CashflowRow**
One month of cashflow: `{ year, month, key: "YYYY-MM", income, expense, net }`. Rows are
sorted ascending by `key` and carry raw (unrounded) numbers. `monthlyCashflow(budget)`
produces them; rolling averages, year-over-year deltas, cumulative-by-year, forecasts,
and savings KPIs compose on top.

## Architecture notes

- Cashflow logic lives as **pure functions** (the test surface). A thin `useCashflow()`
  adapter reads the Budget from context and calls them — the hook carries ergonomics, not
  logic (an internal seam).
