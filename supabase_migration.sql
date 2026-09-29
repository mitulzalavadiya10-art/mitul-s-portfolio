-- ============================================================
-- Klenzo Blog — Supabase Migration Script
-- Run this in: Supabase Dashboard → SQL Editor → Run
-- ============================================================

-- ── 1. blog_comments table ──────────────────────────────────
-- Stores all public blog comments (moved from localStorage to cloud)
CREATE TABLE IF NOT EXISTS blog_comments (
  id          TEXT        PRIMARY KEY,
  post_id     TEXT        NOT NULL,
  post_title  TEXT        DEFAULT '',
  author_name TEXT        NOT NULL,
  email       TEXT        NOT NULL,
  content     TEXT        NOT NULL,
  status      TEXT        NOT NULL DEFAULT 'pending'
                          CHECK (status IN ('pending', 'approved', 'spam')),
  admin_reply TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_blog_comments_post_id  ON blog_comments (post_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_status   ON blog_comments (status);
CREATE INDEX IF NOT EXISTS idx_blog_comments_created  ON blog_comments (created_at DESC);

ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;

-- Allow all operations via anon key (admin uses anon key in this app)
CREATE POLICY "Allow all on blog_comments"
  ON blog_comments FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);


-- ── 2. newsletter_leads table ───────────────────────────────
-- Stores newsletter subscribers (moved from localStorage to cloud)
CREATE TABLE IF NOT EXISTS newsletter_leads (
  id             TEXT        PRIMARY KEY,
  email          TEXT        UNIQUE NOT NULL,
  source_post_id TEXT        DEFAULT '',
  source_app_id  TEXT        DEFAULT 'none',
  subscribed_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_newsletter_leads_email      ON newsletter_leads (email);
CREATE INDEX IF NOT EXISTS idx_newsletter_leads_subscribed ON newsletter_leads (subscribed_at DESC);

ALTER TABLE newsletter_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all on newsletter_leads"
  ON newsletter_leads FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);


-- ── 3. user_logins table ───────────────────────────────────
-- Tracks all logged-in merchants, login frequency & profile info
CREATE TABLE IF NOT EXISTS user_logins (
  id           TEXT        PRIMARY KEY,
  email        TEXT        UNIQUE NOT NULL,
  name         TEXT        DEFAULT '',
  picture      TEXT        DEFAULT '',
  provider     TEXT        DEFAULT 'google',
  shop_url     TEXT        DEFAULT '',
  country      TEXT        DEFAULT '',
  timezone     TEXT        DEFAULT '',
  browser_os   TEXT        DEFAULT '',
  device_type  TEXT        DEFAULT '',
  referrer     TEXT        DEFAULT '',
  login_count  INT         DEFAULT 1,
  last_login   TIMESTAMPTZ DEFAULT now(),
  created_at   TIMESTAMPTZ DEFAULT now()
);

-- Ensure columns exist if table was already created
ALTER TABLE user_logins ADD COLUMN IF NOT EXISTS shop_url TEXT DEFAULT '';
ALTER TABLE user_logins ADD COLUMN IF NOT EXISTS country TEXT DEFAULT '';
ALTER TABLE user_logins ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT '';
ALTER TABLE user_logins ADD COLUMN IF NOT EXISTS browser_os TEXT DEFAULT '';
ALTER TABLE user_logins ADD COLUMN IF NOT EXISTS device_type TEXT DEFAULT '';
ALTER TABLE user_logins ADD COLUMN IF NOT EXISTS referrer TEXT DEFAULT '';

CREATE INDEX IF NOT EXISTS idx_user_logins_email      ON user_logins (email);
CREATE INDEX IF NOT EXISTS idx_user_logins_last_login ON user_logins (last_login DESC);

ALTER TABLE user_logins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all on user_logins"
  ON user_logins FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);


-- ── 4. user_activity_logs table ────────────────────────────
-- Tracks granular user behavior, pageviews, blog reads & app install clicks
CREATE TABLE IF NOT EXISTS user_activity_logs (
  id           TEXT        PRIMARY KEY,
  user_email   TEXT        NOT NULL,
  action_type  TEXT        NOT NULL,
  description  TEXT        NOT NULL,
  page_url     TEXT        DEFAULT '',
  created_at   TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_activity_email   ON user_activity_logs (user_email);
CREATE INDEX IF NOT EXISTS idx_user_activity_created ON user_activity_logs (created_at DESC);

ALTER TABLE user_activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all on user_activity_logs"
  ON user_activity_logs FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);


-- ── 5. blog_posts table RLS ────────────────────────────────
ALTER TABLE IF EXISTS blog_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all on blog_posts" ON blog_posts;
CREATE POLICY "Allow all on blog_posts"
  ON blog_posts FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);


-- ── Done! ───────────────────────────────────────────────────
-- After running this SQL:
-- 1. Comments from all devices sync via Supabase Cloud
-- 2. Newsletter leads persist across devices
-- 3. Logged in merchants track in real time with marketing info
-- 4. User activity timeline tracks full behavior history
-- 5. Admin panel shows real-time cloud data
