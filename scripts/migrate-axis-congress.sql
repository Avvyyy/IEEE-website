-- Migration: Update axis_congress table
-- Run this in the Supabase SQL Editor before deploying the new admin form.
-- Adds end_date, flier_url, and a days JSONB column for the 3-day timeline.
-- Drops the meet_link column.

ALTER TABLE axis_congress
  ADD COLUMN IF NOT EXISTS end_date date,
  ADD COLUMN IF NOT EXISTS flier_url text,
  ADD COLUMN IF NOT EXISTS days jsonb DEFAULT '[]'::jsonb;

-- Optional: drop meet_link column (uncomment if you want to remove it)
-- ALTER TABLE axis_congress DROP COLUMN IF EXISTS meet_link;
