create table if not exists job_queue (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  command text not null,
  status text not null default 'pending',
  result text,
  created_at timestamp default now()
);