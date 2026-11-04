import { neon } from '@neondatabase/serverless';

export interface NewsletterLead {
  id: string;
  email: string;
  createdAt: string;
  subscribedAt?: string;
  sourceAppId?: string;
}

export interface UserLoginRecord {
  id: string;
  email: string;
  name: string;
  picture?: string;
  lastLoginAt: string;
  lastLogin?: string;
  shopUrl?: string;
  timezone?: string;
  deviceType?: string;
  browserOs?: string;
  loginCount?: number;
  provider?: string;
}

export interface UserActivityLog {
  id: string;
  userId: string;
  action: string;
  actionType?: string;
  timestamp: string;
  createdAt?: string;
  details?: string;
  description?: string;
  pageUrl?: string;
}

const LEADS_KEY = "klenzo_newsletter_leads_v2";
const USERS_KEY = "klenzo_user_logins_v2";
const ACTIVITY_KEY = "klenzo_user_activities_v2";

const NEON_URL = import.meta.env.VITE_NEON_DATABASE_URL || "postgresql://neondb_owner:npg_4PmjYdezRuE3@ep-soft-surf-ayrevitr-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require";
export const sql = neon(NEON_URL);

let tableInitialized = false;
export async function initNeonTable(): Promise<void> {
  if (tableInitialized) return;
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS newsletter_leads (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        source_app_id TEXT
      );
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS user_logins (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE,
        name TEXT,
        picture TEXT,
        last_login_at TIMESTAMPTZ,
        shop_url TEXT,
        timezone TEXT,
        device_type TEXT,
        browser_os TEXT,
        login_count INT DEFAULT 1,
        provider TEXT
      );
    `;
    tableInitialized = true;
  } catch (err) {
    console.warn("Neon user table init warning:", err);
  }
}

export function getCachedLeadsSync(): NewsletterLead[] {
  try {
    const raw = localStorage.getItem(LEADS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function addLead(email: string, sourceAppId?: string, _extraDetails?: string): Promise<boolean> {
  const leads = getCachedLeadsSync();
  if (leads.some((l) => l.email.toLowerCase() === email.toLowerCase())) {
    return false;
  }
  const now = new Date().toISOString();
  const newLead: NewsletterLead = {
    id: `lead-${Date.now()}`,
    email,
    createdAt: now,
    subscribedAt: now,
    sourceAppId: sourceAppId || 'website',
  };
  try {
    localStorage.setItem(LEADS_KEY, JSON.stringify([newLead, ...leads]));
  } catch {}

  try {
    await initNeonTable();
    await sql`
      INSERT INTO newsletter_leads (id, email, created_at, source_app_id)
      VALUES (${newLead.id}, ${newLead.email}, ${newLead.createdAt}, ${newLead.sourceAppId})
      ON CONFLICT (email) DO NOTHING;
    `;
  } catch (err) {
    console.warn("Neon addLead warning:", err);
  }
  return true;
}

export function getCachedUserLoginsSync(): UserLoginRecord[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function getUserLogins(): Promise<UserLoginRecord[]> {
  return getCachedUserLoginsSync();
}

export async function recordUserLogin(
  email: string,
  name?: string,
  picture?: string,
  shopUrl?: string
): Promise<UserLoginRecord> {
  const users = getCachedUserLoginsSync();
  const now = new Date().toISOString();
  const existing = users.find((u) => u.email === email);
  const record: UserLoginRecord = {
    id: existing?.id || `user-${Date.now()}`,
    email,
    name: name || email.split('@')[0],
    picture,
    lastLoginAt: now,
    lastLogin: now,
    shopUrl: shopUrl || existing?.shopUrl,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    deviceType: 'Desktop',
    browserOs: 'Chrome / Windows',
    loginCount: (existing?.loginCount || 0) + 1,
    provider: picture ? 'google' : 'email',
  };
  const updated = [record, ...users.filter((u) => u.email !== email)];
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(updated));
  } catch {}

  try {
    await initNeonTable();
    await sql`
      INSERT INTO user_logins (id, email, name, picture, last_login_at, shop_url, timezone, device_type, browser_os, login_count, provider)
      VALUES (${record.id}, ${record.email}, ${record.name}, ${record.picture || null}, ${record.lastLoginAt}, ${record.shopUrl || null}, ${record.timezone}, ${record.deviceType}, ${record.browserOs}, ${record.loginCount}, ${record.provider})
      ON CONFLICT (email) DO UPDATE SET
        last_login_at = EXCLUDED.last_login_at,
        name = EXCLUDED.name,
        picture = EXCLUDED.picture,
        shop_url = EXCLUDED.shop_url,
        login_count = user_logins.login_count + 1;
    `;
  } catch (err) {
    console.warn("Neon recordUserLogin warning:", err);
  }

  return record;
}

export async function updateUserShopUrl(email: string, shopUrl: string): Promise<void> {
  const users = await getUserLogins();
  const updated = users.map((u) => (u.email === email ? { ...u, shopUrl } : u));
  localStorage.setItem(USERS_KEY, JSON.stringify(updated));
}

export async function getUserActivityHistory(): Promise<UserActivityLog[]> {
  try {
    const raw = localStorage.getItem(ACTIVITY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function logUserActivity(
  userId: string,
  action: string,
  details?: string,
  _extra?: unknown
): Promise<void> {
  const activities = await getUserActivityHistory();
  const now = new Date().toISOString();
  const log: UserActivityLog = {
    id: `act-${Date.now()}`,
    userId,
    action,
    actionType: action,
    timestamp: now,
    createdAt: now,
    details,
    description: details,
    pageUrl: typeof window !== 'undefined' ? window.location.href : '',
  };
  localStorage.setItem(ACTIVITY_KEY, JSON.stringify([log, ...activities].slice(0, 500)));
}
