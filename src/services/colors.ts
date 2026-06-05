import * as chroma from "chroma-js";
import * as _ from "lodash";
import {RGBA_GREEN, RGBA_RED} from "../../constants";

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
 * An array of `amount` colors between custom start/end colors.
 */
export function getCustomScaleByAmount(start: string, end: string, amount: number) {
    return chroma
        .scale([start, end])
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

/**
 * Per-value green/red colors for an array of sums.
 */
export function getRedGreenForSum(sums: number[]) {
    const colors = [];
    _.forEach(sums, function (value) {
        if (value > 0) {
            colors.push(chroma(RGBA_GREEN).hex())
        } else {
            colors.push(chroma(RGBA_RED).hex())
        }
    });
    return colors;
}
