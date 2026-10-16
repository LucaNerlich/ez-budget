import {readFileSync} from 'node:fs';
import {describe, expect, it, vi} from 'vitest';
import YAML from 'yaml';

vi.mock('../../src/testdata.yaml', async () => ({
    default: YAML.parse(readFileSync('src/testdata.yaml', 'utf8')),
}));

import testData from '../../src/testdata.yaml';
import {GET} from './route';

describe('testdata download route', () => {
    it('serves the sample dataset as YAML, deep-equal to the single source', async () => {
        const response = GET();
        expect(response.headers.get('content-type')).toContain('yaml');
        expect(YAML.parse(await response.text())).toEqual(testData);
    });
});
