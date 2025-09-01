"use server";

import axios from 'axios';
import YAML from 'yaml';
import { z } from 'zod';
import dns from 'node:dns/promises';
// net.isPrivate is not available; implement our own private IP detection

function isHttpsUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === 'https:';
  } catch {
    return false;
  }
}

const RecurringSchema = z.object({
  category: z.string().min(1),
  value: z.number(),
  comment: z.string().optional(),
  from: z.string().regex(/^\d{4}-\d{2}$/),
  until: z.string().regex(/^\d{4}-\d{2}$/).optional(),
});

const EntrySchema = z.object({
  category: z.string().min(1),
  value: z.number(),
  comment: z.string().optional(),
  date: z.string().optional(),
});

const MonthSchema = z.object({
  month: z.number().int().min(1).max(12),
  entries: z.array(EntrySchema).default([]),
});

const YearSchema = z.object({
  year: z.number().int().min(1900),
  months: z.array(MonthSchema).default([]),
});

const DataSchema = z.union([
  z.array(YearSchema),
  z.object({
    years: z.array(YearSchema),
    recurring: z.array(RecurringSchema).default([]),
  }),
]);

async function assertRemoteSafe(url: string) {
  const u = new URL(url);
  const hostname = u.hostname;
  const addrs = await dns.lookup(hostname, { all: true });
  const isPrivateAddress = (ip: string): boolean => {
    if (ip === '::1' || ip === '127.0.0.1') return true;
    // IPv4 private ranges
    if (/^10\./.test(ip)) return true;
    if (/^192\.168\./.test(ip)) return true;
    if (/^172\.(1[6-9]|2\d|3[0-1])\./.test(ip)) return true;
    if (/^169\.254\./.test(ip)) return true; // link-local
    // IPv6 ULA/link-local
    if (/^fc/i.test(ip) || /^fd/i.test(ip)) return true; // fc00::/7
    if (/^fe80/i.test(ip)) return true; // link-local
    if (/^::ffff:127\./.test(ip)) return true; // IPv4-mapped loopback
    return false;
  };
  const isPrivate = addrs.some((a) => isPrivateAddress(a.address));
  if (isPrivate) throw new Error('Refusing to fetch private network addresses');
  // Restrict ports to standard HTTP/HTTPS
  const port = u.port ? parseInt(u.port, 10) : (u.protocol === 'https:' ? 443 : 80);
  if (![80, 443].includes(port)) throw new Error('Refusing to fetch non-standard ports');
}

export type RemoteFetchState = { ok: boolean; data?: any; error?: string };

export async function fetchRemoteJsonAction(_prevState: RemoteFetchState, formData: FormData): Promise<RemoteFetchState> {
  try {
    const url = String(formData.get('remoteUrl') || '').trim();
    if (!url || !isHttpsUrl(url)) {
      return { ok: false, error: 'Invalid URL. Only HTTPS is allowed.' };
    }

    await assertRemoteSafe(url);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const response = await axios.get(url, {
      responseType: 'text',
      signal: controller.signal as any,
      maxContentLength: 2 * 1024 * 1024,
      transformResponse: (d, h) => d,
      validateStatus: (s) => s >= 200 && s < 400
    });
    clearTimeout(timeout);

    const text: string = response.data;
    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      data = YAML.parse(text);
    }
    const parsed = DataSchema.safeParse(data);
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      return { ok: false, error: `Invalid data at ${first.path.join('.')}: ${first.message}` };
    }
    return { ok: true, data: parsed.data };
  } catch (e: any) {
    const message = e?.message || 'Fetch failed';
    return { ok: false, error: message };
  }
}

export type LocalParseState = { ok: boolean; data?: any; error?: string };

export async function parseLocalJsonAction(_prev: LocalParseState, formData: FormData): Promise<LocalParseState> {
  try {
    const file = formData.get('localJson') as File | null;
    if (!file) return { ok: false, error: 'No file provided' };
    const text = await file.text();
    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      data = YAML.parse(text);
    }
    const parsed = DataSchema.safeParse(data);
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      return { ok: false, error: `Invalid data at ${first.path.join('.')}: ${first.message}` };
    }
    return { ok: true, data: parsed.data };
  } catch (e: any) {
    return { ok: false, error: e?.message || 'Parse failed' };
  }
}


