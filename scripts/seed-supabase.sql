-- ============================================================
-- IEEE Babcock SB — Seed Supabase from content/*.json data
-- Run this in the Supabase SQL Editor after creating tables.
-- ============================================================

-- ─── Add session column to team_members (run once) ──────────
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS session text NOT NULL DEFAULT '2025/2026';

-- ─── Events ──────────────────────────────────────────────────
INSERT INTO events (id, title, start_date, end_date, location, description, image_url, registration_url, vtools_url, featured, created_at) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'AXIS Congress 2026', '2026-09-18', '2026-09-20', 'Babcock University, Ilishan-Remo', 'The branch''s flagship annual technology congress bringing together students, industry leaders, and IEEE members for three days of talks, workshops, and networking.', '/images/placeholder-event-axis.svg', 'https://lu.ma/', 'https://events.vtools.ieee.org/', true, now()),
  ('a0000000-0000-0000-0000-000000000002', 'Tethered: Robotics Bootcamp', '2026-08-22', NULL, 'IEEE Babcock Lab', 'A hands-on weekend bootcamp introducing members to embedded systems and robotics fundamentals.', '/images/placeholder-event-1.svg', NULL, 'https://events.vtools.ieee.org/', false, now()),
  ('a0000000-0000-0000-0000-000000000003', 'Cybersecurity 101 Workshop', '2026-09-05', NULL, 'Babcock University, ICT Hall', 'An introductory workshop on ethical hacking and network security for new members.', '/images/placeholder-event-2.svg', NULL, 'https://events.vtools.ieee.org/', false, now()),
  ('a0000000-0000-0000-0000-000000000004', 'AXIS Congress 2025', '2025-11-10', NULL, 'Babcock University, Ilishan-Remo', 'The inaugural AXIS Congress, focused on emerging technologies in Africa.', '/images/placeholder-event-3.svg', NULL, NULL, false, now()),
  ('a0000000-0000-0000-0000-000000000005', 'GDG x IEEE DevFest', '2025-11-14', NULL, 'Babcock University', 'A joint developer festival with Google Developer Groups Babcock.', '/images/placeholder-event-4.svg', NULL, NULL, false, now());

-- ─── Team Members — 2025/2026 (current) ─────────────────────
INSERT INTO team_members (id, name, title, bio, image_url, linkedin, session, sort_order, created_at) VALUES
  ('b0000000-0000-0000-0000-000000000001', 'Kasie Umahi', 'Chair', 'Leads the branch''s strategic direction and represents IEEE Babcock SB to IEEE Region 8.', '/images/placeholder-avatar-1.svg', 'https://www.linkedin.com/', '2025/2026', 1, now()),
  ('b0000000-0000-0000-0000-000000000002', 'Member Name', 'Vice Chair', 'Supports branch operations and coordinates technical committees.', '/images/placeholder-avatar-2.svg', 'https://www.linkedin.com/', '2025/2026', 2, now()),
  ('b0000000-0000-0000-0000-000000000003', 'Member Name', 'Secretary', 'Manages branch records, correspondence, and vTools administration.', '/images/placeholder-avatar-3.svg', 'https://www.linkedin.com/', '2025/2026', 3, now()),
  ('b0000000-0000-0000-0000-000000000004', 'Member Name', 'Treasurer', 'Oversees branch finances, budgeting, and sponsorships.', '/images/placeholder-avatar-4.svg', 'https://www.linkedin.com/', '2025/2026', 4, now()),
  ('b0000000-0000-0000-0000-000000000005', 'Member Name', 'Technical Lead', 'Leads technical workshops, CTFs, and project mentorship.', '/images/placeholder-avatar-5.svg', 'https://www.linkedin.com/', '2025/2026', 5, now()),
  ('b0000000-0000-0000-0000-000000000006', 'Member Name', 'Creative Director', 'Owns branch visual identity, design, and media production.', '/images/placeholder-avatar-6.svg', 'https://www.linkedin.com/', '2025/2026', 6, now()),
  ('b0000000-0000-0000-0000-000000000007', 'Member Name', 'Outreach Coordinator', 'Builds partnerships with sponsors, alumni, and other student organizations.', '/images/placeholder-avatar-7.svg', 'https://www.linkedin.com/', '2025/2026', 7, now());

-- ─── Team Members — 2024/2025 (previous) ────────────────────
INSERT INTO team_members (id, name, title, bio, image_url, linkedin, session, sort_order, created_at) VALUES
  ('b0000000-0000-0000-0000-000000000011', 'Previous Chair', 'Chair', 'Led the branch during the 2024/2026 academic session.', '/images/placeholder-avatar-1.svg', 'https://www.linkedin.com/', '2024/2025', 1, now()),
  ('b0000000-0000-0000-0000-000000000012', 'Previous Vice Chair', 'Vice Chair', 'Supported branch operations during 2024/2025.', '/images/placeholder-avatar-2.svg', 'https://www.linkedin.com/', '2024/2025', 2, now()),
  ('b0000000-0000-0000-0000-000000000013', 'Previous Secretary', 'Secretary', 'Managed branch records during 2024/2025.', '/images/placeholder-avatar-3.svg', 'https://www.linkedin.com/', '2024/2025', 3, now());

-- ─── News ────────────────────────────────────────────────────
INSERT INTO news (id, title, description, image_url, is_featured, published_at, created_at) VALUES
  ('c0000000-0000-0000-0000-000000000001', 'IEEE Babcock SB Announces AXIS Congress 2026', 'Registration is now open for the branch''s flagship annual technology congress.', '/images/placeholder-news-1.svg', false, '2026-07-15', now()),
  ('c0000000-0000-0000-0000-000000000002', 'Branch Members Place Top 3 in Regional CTF', 'The cybersecurity team represented IEEE Babcock SB at a Region 8 capture-the-flag competition.', '/images/placeholder-news-2.svg', false, '2026-06-02', now()),
  ('c0000000-0000-0000-0000-000000000003', 'GhostCipher AI Featured in Student Innovation Showcase', 'Our flagship AI project was recognized at the university-wide innovation showcase.', '/images/placeholder-news-3.svg', false, '2026-05-10', now());

-- ─── Partners & Sponsors ─────────────────────────────────────
INSERT INTO partners (id, name, logo_url, website_url, type, sort_order, created_at) VALUES
  ('d0000000-0000-0000-0000-000000000001', 'IEEE', '/images/placeholder-logo-ieee.svg', 'https://www.ieee.org', 'partner', 1, now()),
  ('d0000000-0000-0000-0000-000000000002', 'Babcock University', '/images/placeholder-logo-babcock.svg', 'https://babcock.edu.ng', 'partner', 2, now()),
  ('d0000000-0000-0000-0000-000000000003', 'BUCC', '/images/placeholder-logo-bucc.svg', NULL, 'partner', 3, now()),
  ('d0000000-0000-0000-0000-000000000004', 'Google Developer Groups Babcock', '/images/placeholder-logo-gdg.svg', NULL, 'partner', 4, now());

-- ─── AXIS Congress ───────────────────────────────────────────
INSERT INTO axis_congress (id, edition, theme, event_date, location, meet_link, description, banner_url, registration_url, updated_at) VALUES
  ('e0000000-0000-0000-0000-000000000001', '2026', 'Engineering the Next Frontier', NULL, 'Babcock University, Ilishan-Remo, Ogun State', NULL, 'AXIS Congress is IEEE Babcock Student Branch''s flagship annual technology congress — three days of keynotes, workshops, and networking bringing together students, industry leaders, and IEEE members from across Region 8.', '/images/axis-banner.png', 'https://lu.ma/', now());

-- ─── AXIS Ignite Webinars ────────────────────────────────────
INSERT INTO axis_ignite (id, congress_id, week_number, title, event_date, event_time, speaker, speaker_title, description, meet_link) VALUES
  ('f0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 1, 'The Future of Artificial Intelligence', NULL, NULL, 'Speaker TBC', 'Title, Organisation', 'An exploration of emerging AI paradigms — from large language models to multimodal systems — and what they mean for engineers and technologists in Africa and beyond.', NULL),
  ('f0000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000001', 2, 'Cybersecurity in the Modern Era', NULL, NULL, 'Speaker TBC', 'Title, Organisation', 'Understanding modern threat landscapes, zero-trust architecture, and how to build security-first systems in an increasingly connected world.', NULL),
  ('f0000000-0000-0000-0000-000000000003', 'e0000000-0000-0000-0000-000000000001', 3, 'Embedded Systems & IoT Design', NULL, NULL, 'Speaker TBC', 'Title, Organisation', 'From microcontrollers to edge computing — practical foundations for building smart, connected devices and IoT ecosystems.', NULL),
  ('f0000000-0000-0000-0000-000000000004', 'e0000000-0000-0000-0000-000000000001', 4, 'Cloud Computing & DevOps', NULL, NULL, 'Speaker TBC', 'Title, Organisation', 'A hands-on look at cloud infrastructure, CI/CD pipelines, containerisation, and the DevOps culture transforming modern software delivery.', NULL),
  ('f0000000-0000-0000-0000-000000000005', 'e0000000-0000-0000-0000-000000000001', 5, 'Data Engineering & Analytics', NULL, NULL, 'Speaker TBC', 'Title, Organisation', 'Building data pipelines, working with large datasets, and turning raw data into actionable insights for business and engineering decisions.', NULL),
  ('f0000000-0000-0000-0000-000000000006', 'e0000000-0000-0000-0000-000000000001', 6, 'Renewable Energy & Power Systems', NULL, NULL, 'Speaker TBC', 'Title, Organisation', 'The engineering challenges and opportunities in Nigeria''s energy transition — solar, grid modernisation, and the future of power infrastructure.', NULL),
  ('f0000000-0000-0000-0000-000000000007', 'e0000000-0000-0000-0000-000000000001', 7, 'Entrepreneurship for Engineers', NULL, NULL, 'Speaker TBC', 'Title, Organisation', 'From idea to product — navigating the startup ecosystem, pitching to investors, and building tech ventures in the African context.', NULL),
  ('f0000000-0000-0000-0000-000000000008', 'e0000000-0000-0000-0000-000000000001', 8, 'Career Paths in Engineering & Tech', NULL, NULL, 'Speaker TBC', 'Title, Organisation', 'A final session covering industry career pathways, IEEE membership benefits, and everything you need to know heading into AXIS Congress.', NULL);
