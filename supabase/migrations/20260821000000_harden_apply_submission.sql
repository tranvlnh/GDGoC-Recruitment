alter table public.applications
  add column if not exists idempotency_key text,
  add column if not exists client_ip text,
  add column if not exists user_agent text;

create unique index if not exists applications_idempotency_key_uidx
  on public.applications (idempotency_key)
  where idempotency_key is not null;

create index if not exists applications_email_student_id_submitted_at_idx
  on public.applications (lower(email), student_id, submitted_at desc);
