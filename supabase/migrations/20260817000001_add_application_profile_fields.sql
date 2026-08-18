-- Upgrade migration for databases where the initial applications table already exists.
-- New submissions are required by the API to include all of these fields. Existing rows
-- intentionally remain nullable until their historical data is backfilled.
alter table public.applications
  add column if not exists facebook_url text,
  add column if not exists student_year smallint check (student_year between 1 and 7),
  add column if not exists student_id text,
  add column if not exists date_of_birth date,
  add column if not exists university text,
  add column if not exists department text,
  add column if not exists gender text check (gender in ('male', 'female', 'other', 'prefer_not_to_say'));

create index if not exists applications_student_id_idx on public.applications (student_id);
create index if not exists applications_department_idx on public.applications (department);
