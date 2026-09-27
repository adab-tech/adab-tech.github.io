-- Blog comments for adamu.tech. Applied by the deploy workflow; safe to re-run.
CREATE TABLE IF NOT EXISTS comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post TEXT NOT NULL,              -- post slug, e.g. "qadr-on-destiny-..."
  name TEXT NOT NULL,
  body TEXT NOT NULL,              -- plain text; the site escapes it when showing
  created_at TEXT NOT NULL,        -- ISO 8601, UTC
  status TEXT NOT NULL DEFAULT 'pending',  -- pending | approved
  is_author INTEGER NOT NULL DEFAULT 0,    -- 1 = written by Adamu from the admin
  ip_hash TEXT                     -- salted hash, only for rate limiting; never shown
);
CREATE INDEX IF NOT EXISTS comments_post_status ON comments (post, status, created_at);
CREATE INDEX IF NOT EXISTS comments_ip_time ON comments (ip_hash, created_at);
