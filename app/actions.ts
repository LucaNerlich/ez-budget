"use server";

import axios from 'axios';

function isHttpsUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === 'https:';
  } catch {
    return false;
  }
}

export type RemoteFetchState = { ok: boolean; data?: any; error?: string };

export async function fetchRemoteJsonAction(_prevState: RemoteFetchState, formData: FormData): Promise<RemoteFetchState> {
  try {
    const url = String(formData.get('remoteUrl') || '').trim();
    if (!url || !isHttpsUrl(url)) {
      return { ok: false, error: 'Invalid URL. Only HTTPS is allowed.' };
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const response = await axios.get(url, { responseType: 'json', signal: controller.signal as any });
    clearTimeout(timeout);

    return { ok: true, data: response.data };
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
    if (file.type && file.type !== 'application/json') {
      return { ok: false, error: 'Invalid file type' };
    }
    const text = await file.text();
    const data = JSON.parse(text);
    return { ok: true, data };
  } catch (e: any) {
    return { ok: false, error: e?.message || 'Parse failed' };
  }
}


