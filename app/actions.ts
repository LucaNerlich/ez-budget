"use server";

import axios from 'axios';
import YAML from 'yaml';
import { z } from 'zod';
import dns from 'node:dns/promises';
import https from 'node:https';
import type {LookupFunction} from 'node:net';
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

function isPrivateIPv4(ip: string): boolean {
    if (ip === '0.0.0.0') return true; // unspecified
    const parts = ip.split('.').map(Number);
    if (parts.length !== 4 || parts.some((p) => Number.isNaN(p))) return true;
    const [a, b] = parts;
    if (a === 10) return true; // RFC1918
    if (a === 127) return true; // loopback
    if (a === 192 && b === 168) return true; // RFC1918
    if (a === 172 && b >= 16 && b <= 31) return true; // RFC1918
    if (a === 169 && b === 254) return true; // link-local
    if (a === 100 && b >= 64 && b <= 127) return true; // CGNAT 100.64.0.0/10
    return false;
}

function isPrivateAddress(ip: string): boolean {
    if (!ip) return true;
    if (ip.startsWith('::ffff:')) {
        const v4 = ip.slice(7);
        return v4.includes(':') || isPrivateIPv4(v4); // IPv4-mapped IPv6
    }
    if (!ip.includes(':')) return isPrivateIPv4(ip);
    if (ip === '::' || ip === '::1') return true; // unspecified / loopback
    const first = ip.split(':')[0];
    if (/^fc/i.test(first) || /^fd/i.test(first)) return true; // ULA fc00::/7
    if (/^fe[89ab]/i.test(first)) return true; // link-local fe80::/10
    return false;
}

async function assertRemoteSafe(url: string): Promise<Array<{address: string, family: number}>> {
    const u = new URL(url);
    const hostname = u.hostname;
    const addrs = await Promise.race([
        dns.lookup(hostname, {all: true}),
        new Promise<never>((_, reject) => setTimeout(() => reject(new Error('DNS lookup timed out')), 10000)),
    ]);
    if (!addrs || addrs.length === 0) throw new Error('Could not resolve host');
    if (addrs.some((a) => isPrivateAddress(a.address))) throw new Error('Refusing to fetch private network addresses');
    // Restrict ports to standard HTTP/HTTPS
    const port = u.port ? parseInt(u.port, 10) : (u.protocol === 'https:' ? 443 : 80);
    if (![80, 443].includes(port)) throw new Error('Refusing to fetch non-standard ports');
    return addrs.map((a) => ({address: a.address, family: a.family}));
}

export type RemoteFetchState = { ok: boolean; data?: any; error?: string };

export async function fetchRemoteJsonAction(_prevState: RemoteFetchState, formData: FormData): Promise<RemoteFetchState> {
  try {
    const url = String(formData.get('remoteUrl') || '').trim();
    if (!url || !isHttpsUrl(url)) {
      return { ok: false, error: 'Invalid URL. Only HTTPS is allowed.' };
    }

    const validAddrs = await assertRemoteSafe(url);
    // Pin the validated addresses so a second (attacker-controlled) DNS lookup cannot resolve elsewhere.
    const pinnedLookup: LookupFunction = (hostname, options, callback) => {
        const family = typeof options === 'number' ? options : (options?.family ?? 0);
        const match = validAddrs.find((a) => family === 0 || a.family === family) ?? validAddrs[0];
        if (!match) {
            callback(new Error('Hostname did not resolve to a validated address'), '', 0);
            return;
        }
        callback(null, match.address, match.family);
    };
    const httpsAgent = new https.Agent({lookup: pinnedLookup});

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const response = await axios.get(url, {
      responseType: 'text',
      signal: controller.signal as any,
      maxContentLength: 2 * 1024 * 1024,
      maxRedirects: 0,
      httpsAgent,
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


