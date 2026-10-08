import { BrowserContext, APIResponse } from '@playwright/test';

// Cache the Inertia asset version once discovered, so we don't 409 every call.
let inertiaVersion: string | null = null;

/** Read the HTML shell once to extract the current Inertia asset version. */
async function discoverVersion(ctx: BrowserContext): Promise<string> {
  const res = await ctx.request.get('/', { headers: { Accept: 'text/html' } });
  const html = await res.text();
  // data-page="{ ... &quot;version&quot;:&quot;abc&quot; ... }"
  const m = html.match(/&quot;version&quot;:&quot;([^&]*)&quot;/)
    ?? html.match(/"version":"([^"]*)"/);
  return m ? m[1] : '';
}

/**
 * Read an Inertia page's `props` as JSON (the official X-Inertia response),
 * which avoids fragile HTML parsing. Inertia answers 409 on a version mismatch
 * and returns the correct version in the `X-Inertia-Location`/response — we
 * refresh the cached version and retry once.
 */
export async function getProps(ctx: BrowserContext, url: string): Promise<any> {
  if (inertiaVersion === null) inertiaVersion = await discoverVersion(ctx);

  const request = () =>
    ctx.request.get(url, {
      headers: {
        Accept: 'text/html, application/xhtml+xml',
        'X-Inertia': 'true',
        'X-Inertia-Version': inertiaVersion ?? '',
        'X-Requested-With': 'XMLHttpRequest',
      },
    });

  let res = await request();

  // 409 => stale version. The fresh version is in the X-Inertia-Version header.
  if (res.status() === 409) {
    inertiaVersion = res.headers()['x-inertia-version'] ?? (await discoverVersion(ctx));
    res = await request();
  }

  if (res.status() === 403) throw new Error(`403 Forbidden for ${url}`);

  const body = await res.text();
  let parsed: any;
  try {
    parsed = JSON.parse(body);
  } catch {
    throw new Error(
      `Expected Inertia JSON at ${url} (status ${res.status()}). ` +
        `Body starts with: ${body.slice(0, 120).replace(/\s+/g, ' ')}`,
    );
  }
  return parsed.props;
}

/** Current (decoded) CSRF token from the XSRF-TOKEN cookie. */
export async function csrf(ctx: BrowserContext): Promise<string> {
  const cookies = await ctx.cookies();
  const c = cookies.find((c) => c.name === 'XSRF-TOKEN');
  return c ? decodeURIComponent(c.value) : '';
}

function writeHeaders(token: string) {
  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'X-XSRF-TOKEN': token,
  };
}

/** POST a create request as the given authenticated context. */
export async function apiCreate(ctx: BrowserContext, url: string, data: object): Promise<APIResponse> {
  return ctx.request.post(url, { headers: writeHeaders(await csrf(ctx)), data });
}

/** PUT via Laravel method spoofing (POST + _method). */
export async function apiUpdate(ctx: BrowserContext, url: string, data: object): Promise<APIResponse> {
  return ctx.request.post(url, {
    headers: writeHeaders(await csrf(ctx)),
    data: { _method: 'PUT', ...data },
  });
}

/** DELETE via method spoofing. */
export async function apiDelete(ctx: BrowserContext, url: string): Promise<APIResponse> {
  return ctx.request.post(url, {
    headers: writeHeaders(await csrf(ctx)),
    data: { _method: 'DELETE' },
  });
}

/**
 * Follow Laravel pagination and return all rows of a paginated prop.
 * `key` is the prop name (e.g. 'deals', 'leads', 'activities').
 */
export async function getAll(ctx: BrowserContext, path: string, key: string): Promise<any[]> {
  let page = 1;
  const rows: any[] = [];
  // Guard against runaway loops.
  for (let i = 0; i < 50; i++) {
    const props = await getProps(ctx, `${path}?page=${page}`);
    const paginator = props[key];
    rows.push(...paginator.data);
    if (!paginator.next_page_url) break;
    page++;
  }
  return rows;
}

/** True if an ISO date string falls in the current calendar month (local). */
export function isCurrentMonth(iso: string | null): boolean {
  if (!iso) return false;
  const d = new Date(iso);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
}
