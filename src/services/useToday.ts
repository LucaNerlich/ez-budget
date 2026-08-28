"use client";

import {useState, useSyncExternalStore} from 'react';
import {now} from './date';

const noopSubscribe = () => () => {};

/**
 * True after hydration. Lets date-dependent UI render neutral markup on the
 * server (and during hydration) without a mismatch, then updates after paint.
 */
export function useMounted(): boolean {
    return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

const beforeHydration = {year: 0, month: 0};

/**
 * Today as {year, month (1-12)}: neutral {0, 0} on the server and during
 * hydration, the real date afterwards. Avoids hydration mismatches at
 * month/year boundaries without a mount effect.
 */
export function useToday(): {year: number, month: number} {
    // Lazy initializer: computed once, stable reference afterwards, so it can
    // double as the useSyncExternalStore snapshot without render-phase mutation.
    const [today] = useState(() => {
        const current = now();
        return {year: current.year(), month: current.month() + 1};
    });
    return useSyncExternalStore(noopSubscribe, () => today, () => beforeHydration);
}
