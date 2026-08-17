create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  submitted_at timestamptz not null default now(),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  answers jsonb not null default '[]'::jsonb,
  major text not null,
  full_name text not null,
  email text not null,
  phone text not null,
  facebook_url text not null,
  student_year smallint not null check (student_year between 1 and 7),
  student_id text not null,
  date_of_birth date not null,
  university text not null,
  department text not null,
  gender text not null check (gender in ('male', 'female', 'other', 'prefer_not_to_say'))
);

create index if not exists applications_submitted_at_idx on public.applications (submitted_at desc);
create index if not exists applications_status_idx on public.applications (status);
create index if not exists applications_major_idx on public.applications (major);
create index if not exists applications_email_idx on public.applications (lower(email));
create index if not exists applications_full_name_idx on public.applications (lower(full_name));

alter table public.applications enable row level security;

-- No client-facing RLS policies are created intentionally. The anon/authenticated roles
-- cannot read or write rows; Next.js API routes use SUPABASE_SERVICE_ROLE_KEY server-side,
-- which bypasses RLS.
revoke all on table public.applications from anon, authenticated;
grant all on table public.applications to service_role;
