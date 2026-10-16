import {describe, expect, it, vi} from 'vitest';

vi.mock('chart.js', () => {
    let failing = true;
    return {
        Chart: {
            register: () => {
                if (failing) {
                    failing = false;
                    throw new Error('chunk load failed');
                }
            },
        },
        ArcElement: {}, BarController: {}, BarElement: {}, CategoryScale: {}, DoughnutController: {},
        Legend: {}, LinearScale: {}, LineController: {}, LineElement: {}, PieController: {},
        PointElement: {}, TimeScale: {}, Title: {}, Tooltip: {},
    };
});

import {initChartJs} from './chart';

describe('initChartJs', () => {
    it('retries after a failed first initialization instead of caching the rejection', async () => {
        await expect(initChartJs()).rejects.toThrow('chunk load failed');
        await expect(initChartJs()).resolves.toBeUndefined();
    });
});
