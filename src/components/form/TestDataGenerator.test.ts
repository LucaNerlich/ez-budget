import {readFileSync} from 'node:fs';
import {describe, expect, it, vi} from 'vitest';
import YAML from 'yaml';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';

vi.mock('../../testdata.yaml', async () => ({
    default: YAML.parse(readFileSync('src/testdata.yaml', 'utf8')),
}));

import TestDataGenerator from './TestDataGenerator';

describe('TestDataGenerator SSR output', () => {
    it('renders only the button pre-mount — no dataset, no download link', () => {
        const html = renderToStaticMarkup(createElement(TestDataGenerator));
        expect(html).toContain('Testdaten generieren');
        expect(html).not.toContain('Testdaten herunterladen');
        expect(html).not.toMatch(/2019-\d{2}-\d{2}/);
    });
});
