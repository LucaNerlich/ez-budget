import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

function isHttpsUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === 'https:';
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const url = typeof body?.url === 'string' ? body.url.trim() : '';

    if (!url || !isHttpsUrl(url)) {
      return NextResponse.json({ error: 'Invalid URL. Only HTTPS is allowed.' }, { status: 400 });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const response = await axios.get(url, {
      responseType: 'json',
      signal: controller.signal as any
    });
    clearTimeout(timeout);

    return NextResponse.json(response.data, { status: 200 });
  } catch (error: any) {
    const status = error?.response?.status || 500;
    const message = error?.message || 'Internal Server Error';
    return NextResponse.json({ error: message }, { status });
  }
}


