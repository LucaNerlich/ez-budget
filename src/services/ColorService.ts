import * as chroma from "chroma-js";
import * as _ from "lodash";
import {RGBA_GREEN, RGBA_RED, RGBA_WHITE} from "../../constants";

/**
 * https://gka.github.io/chroma.js/
 * @returns {{test: test}}
 */
export const useColorService = () => {

    /**
     * Returns an array of colors in hex. Size equals given amount number.
     * Start/End colors are predefined.
     * @param amount
     * @returns {*|[]}
     *
     */
    function getScaleByAmount(amount) {
        return chroma
            .scale(['#f5c013', '#226ebd'])
            .mode('lch')
            .colors(amount);
    }

    /**
     * Generate a custom scale of colors between the given start and end colors.
     *
     * @param {string} start - The starting color in hexadecimal format (#RRGGBB).
     * @param {string} end - The ending color in hexadecimal format (#RRGGBB).
     * @param {number} amount - The number of colors to generate in the scale.
     *
     * @return {string[]} - An array of colors in the calculated scale.
     */
    function getCustomScaleByAmount(start, end, amount) {
        return chroma
            .scale([start, end])
            .mode('lch')
            .colors(amount);
    }

    /**
     * Returns the color based on the positive or negative value of the given amount.
     *
     * @param {number} amount - The amount to determine the color for.
     * @return {string} - The color represented as a RGBA value (e.g., rgba(0, 255, 0, 1)).
     */
    function getPositiveNegativeColor(amount: number) {
        if (amount > 0) {
            return RGBA_GREEN;
        } else if (amount < 0) {
            return RGBA_RED;
        } else {
            return RGBA_WHITE;
        }
    }

    /**
     * Returns an array of colors.
     * Size equals sums size.
     * Green if value > 0
     * Red if value < 0
     * @param sums -> array of numbers
     */
    function getRedGreenForSum(sums) {
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


    return {
        getScaleByAmount,
        getCustomScaleByAmount,
        getRedGreenForSum,
        getPositiveNegativeColor
    };
};
