import YAML from 'yaml';
import testData from '../../src/testdata.yaml';

// Single source of truth for the downloadable sample data: the same file the
// upload form imports. Served at /testdata.yaml (see #31).
const body = YAML.stringify(testData);

export function GET() {
    return new Response(body, {
        headers: {'content-type': 'application/yaml; charset=utf-8'},
    });
}
