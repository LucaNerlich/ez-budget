import * as chroma from "chroma-js";

/**
 * Color helpers. Plain functions. https://gka.github.io/chroma.js/
 */

/**
 * An array of `amount` colors on a cohesive emerald→amber scale.
 */
export function getScaleByAmount(amount: number) {
    return chroma
        .scale(['#0e7c5a', '#5cc6a0', '#e0b341'])
        .mode('lch')
        .colors(amount);
}

/**
 * Theme-aware text color: green for positive, red for negative, muted for zero.
 * Returns CSS custom properties so it adapts to light/dark automatically.
 */
export function getPositiveNegativeColor(amount: number) {
    if (amount > 0) {
        return 'var(--pos)';
    } else if (amount < 0) {
        return 'var(--neg)';
    } else {
        return 'var(--text-muted)';
    }
}

