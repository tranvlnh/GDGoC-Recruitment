-- Migration: Enforce 1 application per email (case-insensitive)
-- Created At: 2026-08-22

-- Create unique index on lower(email) if not exists
create unique index if not exists applications_unique_lower_email_idx on public.applications (lower(email));
