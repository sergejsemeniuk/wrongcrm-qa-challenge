// Credentials and known seed IDs, read from .env (see .env.example).

function env(name: string, fallback?: string): string {
  const v = process.env[name] ?? fallback;
  if (v === undefined) throw new Error(`Missing env var ${name} (see .env.example)`);
  return v;
}

export const BASE_URL = env('BASE_URL', 'https://wrongcrm.kodinta.lt');

export const ROLES = {
  manager: { email: env('MANAGER_EMAIL'), password: env('MANAGER_PASSWORD') },
  sales:   { email: env('SALES_EMAIL'),   password: env('SALES_PASSWORD') },
  sales2:  { email: env('SALES2_EMAIL'),  password: env('SALES2_PASSWORD') },
};

// Known user UUIDs from the Inertia payloads (override via .env if reseeded).
export const MANAGER_ID = env('MANAGER_ID', '01a10c8e-513d-704e-97cb-6d3233e6ef4b');
export const ERWIN_ID   = env('ERWIN_ID',   '01a10c8e-5231-72d9-b15b-7ef92a7a00f5');
export const MEGHAN_ID  = env('MEGHAN_ID',  '01a10c8e-5230-722b-853d-4f9acd2b44db');

// The salesperson whose session the `sales` fixture uses.
export const SALES_ID = ERWIN_ID;
// Target for destructive user-update tests (password reset afterwards).
export const TEST_USER_ID = MEGHAN_ID;
