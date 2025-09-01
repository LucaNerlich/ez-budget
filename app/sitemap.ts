import type { MetadataRoute } from 'next';
import {
  ROUTE_HOME,
  ROUTE_MONTHLY,
  ROUTE_YEARLY,
  ROUTE_STATISTICS,
  ROUTE_DATAINSPECTOR,
  ROUTE_JSON_GENERATOR,
  ROUTE_TESTDATA_GENERATOR
} from '../routes';

const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://ez-budget.lucanerlich.com').replace(/\/$/, '');

function toUrl(path: string): string {
  if (path === '/') return BASE_URL;
  return `${BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = [
    { path: ROUTE_HOME, priority: 1 },
    { path: ROUTE_MONTHLY, priority: 0.8 },
    { path: ROUTE_YEARLY, priority: 0.7 },
    { path: ROUTE_STATISTICS, priority: 0.7 },
    { path: ROUTE_DATAINSPECTOR, priority: 0.5 },
    { path: ROUTE_JSON_GENERATOR, priority: 0.5 },
    { path: ROUTE_TESTDATA_GENERATOR, priority: 0.5 }
  ];

  return routes.map((r) => ({
    url: toUrl(r.path),
    lastModified: now,
    changeFrequency: 'weekly',
    priority: r.priority
  }));
}


