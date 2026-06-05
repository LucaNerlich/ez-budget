import * as chroma from "chroma-js";
import * as _ from "lodash";
import {RGBA_GREEN, RGBA_RED, RGBA_WHITE} from "../../constants";

/**
 * Color helpers. Plain functions. https://gka.github.io/chroma.js/
 */

/**
 * An array of `amount` colors on a fixed scale.
 */
export function getScaleByAmount(amount: number) {
    return chroma
        .scale(['#f5c013', '#226ebd'])
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
 * Green for positive, red for negative, white for zero.
 */
export function getPositiveNegativeColor(amount: number) {
    if (amount > 0) {
        return RGBA_GREEN;
    } else if (amount < 0) {
        return RGBA_RED;
    } else {
        return RGBA_WHITE;
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
