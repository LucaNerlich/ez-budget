import React from 'react';
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

    function getCustomScaleByAmount(start, end, amount) {
        return chroma
            .scale([start, end])
            .mode('lch')
            .colors(amount);
    }

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
