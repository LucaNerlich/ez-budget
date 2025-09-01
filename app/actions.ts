"use server";

import axios from 'axios';
import YAML from 'yaml';

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

    const response = await axios.get(url, { responseType: 'text', signal: controller.signal as any });
    clearTimeout(timeout);

    const text: string = response.data;
    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      data = YAML.parse(text);
    }
    return { ok: true, data };
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
    return { ok: true, data };
  } catch (e: any) {
    return { ok: false, error: e?.message || 'Parse failed' };
  }
}


