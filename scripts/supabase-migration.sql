-- ============================================================
--  IEEE Babcock SB Website — Supabase Migration
--  Run this in your Supabase project → SQL Editor
-- ============================================================

-- ── Events ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS events (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT        NOT NULL,
  start_date  DATE        NOT NULL,
  end_date    DATE,
  event_time  TEXT,
  duration    TEXT,
  description TEXT,
  image_url   TEXT,
  location    TEXT,
  registration_url TEXT,
  vtools_url  TEXT,
  featured    BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Core Team Members ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS team_members (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT        NOT NULL,
  title       TEXT        NOT NULL,
  bio         TEXT,
  image_url   TEXT,
  linkedin    TEXT,
  sort_order  INT         NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Programs (e.g. AXIS Congress 2026) ──────────────────────
CREATE TABLE IF NOT EXISTS programs (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT        NOT NULL,
  description TEXT,
  sort_order  INT         NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Subcommittees (belongs to a program) ────────────────────
CREATE TABLE IF NOT EXISTS subcommittees (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id  UUID        NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  name        TEXT        NOT NULL,
  sort_order  INT         NOT NULL DEFAULT 0
);

-- ── Program / Committee Members ──────────────────────────────
CREATE TABLE IF NOT EXISTS committee_members (
  id               UUID  PRIMARY KEY DEFAULT gen_random_uuid(),
  subcommittee_id  UUID  NOT NULL REFERENCES subcommittees(id) ON DELETE CASCADE,
  name             TEXT  NOT NULL,
  title            TEXT,
  bio              TEXT,
  image_url        TEXT,
  sort_order       INT   NOT NULL DEFAULT 0
);

-- ── News / Highlights ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS news (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT        NOT NULL,
  description  TEXT,
  image_url    TEXT,
  is_featured  BOOLEAN     NOT NULL DEFAULT FALSE,
  published_at DATE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── AXIS Congress (one row per edition) ──────────────────────
CREATE TABLE IF NOT EXISTS axis_congress (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  edition     TEXT        NOT NULL,
  theme       TEXT,
  event_date  DATE,
  event_time  TEXT,
  location    TEXT,
  meet_link   TEXT,
  description TEXT,
  banner_url  TEXT,
  registration_url TEXT,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── AXIS Ignite Webinars ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS axis_ignite (
  id            UUID  PRIMARY KEY DEFAULT gen_random_uuid(),
  congress_id   UUID  NOT NULL REFERENCES axis_congress(id) ON DELETE CASCADE,
  week_number   INT,
  title         TEXT  NOT NULL,
  event_date    DATE,
  event_time    TEXT,
  speaker       TEXT,
  speaker_title TEXT,
  description   TEXT,
  meet_link     TEXT
);

-- ── Partners & Sponsors ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS partners (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT        NOT NULL,
  logo_url    TEXT,
  website_url TEXT,
  type        TEXT        NOT NULL DEFAULT 'partner',
  sort_order  INT         NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Opportunities ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS opportunities (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT        NOT NULL,
  description TEXT,
  type        TEXT,
  link        TEXT,
  deadline    DATE,
  is_active   BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── AXIS Congress Registrations ──────────────────────────────
CREATE TABLE IF NOT EXISTS axis_congress_registrations (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT        NOT NULL,
  email           TEXT        NOT NULL,
  school          TEXT        NOT NULL,
  course          TEXT        NOT NULL,
  level           TEXT        NOT NULL,
  attending_day3  BOOLEAN     NOT NULL DEFAULT FALSE,
  payment_status  TEXT        DEFAULT 'unpaid',
  paystack_reference TEXT,
  payment_amount  INT,
  payment_verified_at TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_congress_reg_email
  ON axis_congress_registrations (email);
CREATE INDEX IF NOT EXISTS idx_congress_reg_paystack_ref
  ON axis_congress_registrations (paystack_reference);

-- ── AXIS Ignite Registrations ───────────────────────────────
CREATE TABLE IF NOT EXISTS axis_ignite_registrations (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  webinar_id  UUID        NOT NULL REFERENCES axis_ignite(id) ON DELETE CASCADE,
  name        TEXT        NOT NULL,
  email       TEXT        NOT NULL,
  school      TEXT        NOT NULL,
  course      TEXT        NOT NULL,
  level       TEXT        NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ignite_reg_webinar
  ON axis_ignite_registrations (webinar_id);
CREATE INDEX IF NOT EXISTS idx_ignite_reg_email
  ON axis_ignite_registrations (email);

-- ── Add speaker bio & image to axis_ignite ──────────────────
ALTER TABLE axis_ignite ADD COLUMN IF NOT EXISTS speaker_bio TEXT;
ALTER TABLE axis_ignite ADD COLUMN IF NOT EXISTS speaker_image_url TEXT;

-- ── Add session column to team_members ──────────────────────
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS session TEXT NOT NULL DEFAULT '2025/2026';

-- ── Storage bucket (run separately or via Dashboard) ─────────
INSERT INTO storage.buckets (id, name, public)
VALUES ('admin-uploads', 'admin-uploads', true)
ON CONFLICT (id) DO NOTHING;
