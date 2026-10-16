import {beforeEach, describe, expect, it, vi} from 'vitest';

const {axiosGet} = vi.hoisted(() => ({axiosGet: vi.fn()}));

vi.mock('axios', () => ({
    default: {get: axiosGet},
    isAxiosError: () => false,
}));

vi.mock('node:dns/promises', () => ({
    default: {
        lookup: async () => [{address: '93.184.216.34', family: 4}],
    },
}));

import {fetchRemoteJsonAction} from './actions';

function formWith(url: string): FormData {
    const formData = new FormData();
    formData.set('remoteUrl', url);
    return formData;
}

describe('fetchRemoteJsonAction request config', () => {
    beforeEach(() => {
        axiosGet.mockReset();
    });

    it('accepts 2xx only and keeps redirects blocked', async () => {
        axiosGet.mockResolvedValue({data: 'years: []'});
        const result = await fetchRemoteJsonAction({ok: false}, formWith('https://example.com/data.json'));
        expect(result.ok).toBe(true);

        const config = axiosGet.mock.calls[0][1];
        expect(config.validateStatus(200)).toBe(true);
        expect(config.validateStatus(299)).toBe(true);
        expect(config.validateStatus(302)).toBe(false);
        expect(config.validateStatus(399)).toBe(false);
        expect(config.validateStatus(400)).toBe(false);
        expect(config.maxRedirects).toBe(0);
    });
});
