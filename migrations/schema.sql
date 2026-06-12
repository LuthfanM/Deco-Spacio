-- Deco-spacio AI Supabase schema
-- Run this file in Supabase SQL Editor when migrating from data/db.json.

create extension if not exists pgcrypto;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'generation_status') then
    create type public.generation_status as enum (
      'PENDING',
      'PROCESSING',
      'COMPLETED',
      'FAILED'
    );
  end if;
end $$;

create table if not exists public.users (
  user_id text primary key,
  recovery_key text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.images (
  id text primary key,
  user_id text not null references public.users(user_id) on delete cascade,
  prompt text not null,
  final_prompt text not null,
  image_url text not null default '',
  storage_path text not null default '',
  status public.generation_status not null default 'PENDING',
  error_message text,
  parent_image_id text references public.images(id) on delete set null,
  seed integer,
  room_type text,
  interior_style text,
  mood_lighting text,
  camera_view text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into storage.buckets (id, name, public)
values ('deco-spacio-images', 'deco-spacio-images', true)
on conflict (id) do update set public = excluded.public;

create index if not exists users_recovery_key_idx
  on public.users (upper(recovery_key));

create index if not exists images_user_created_at_idx
  on public.images (user_id, created_at desc);

create index if not exists images_parent_image_id_idx
  on public.images (parent_image_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists images_set_updated_at on public.images;
create trigger images_set_updated_at
before update on public.images
for each row
execute function public.set_updated_at();

alter table public.users enable row level security;
alter table public.images enable row level security;

-- This app currently uses anonymous local user ids, not Supabase Auth users.
-- Set request.headers.x-deco-spacio-user-id from your API layer before querying
-- Supabase. Restore also uses request.headers.x-deco-spacio-recovery-key.
create or replace function public.request_header(header_name text)
returns text
language sql
stable
as $$
  select coalesce(nullif(current_setting('request.headers', true), ''), '{}')::json->>header_name;
$$;

create or replace function public.deco_spacio_user_id_header_name()
returns text
language sql
immutable
as $$
  select 'x-deco-spacio-user-id';
$$;

create or replace function public.deco_spacio_recovery_key_header_name()
returns text
language sql
immutable
as $$
  select 'x-deco-spacio-recovery-key';
$$;

create or replace function public.current_deco_spacio_user_id()
returns text
language sql
stable
as $$
  select public.request_header(public.deco_spacio_user_id_header_name());
$$;

create or replace function public.current_deco_spacio_recovery_key()
returns text
language sql
stable
as $$
  select public.request_header(public.deco_spacio_recovery_key_header_name());
$$;

drop policy if exists "Users can read own user row" on public.users;
create policy "Users can read own user row"
on public.users
for select
using (user_id = public.current_deco_spacio_user_id());

drop policy if exists "Users can restore by recovery key" on public.users;
create policy "Users can restore by recovery key"
on public.users
for select
using (upper(recovery_key) = upper(public.current_deco_spacio_recovery_key()));

drop policy if exists "Users can insert own user row" on public.users;
create policy "Users can insert own user row"
on public.users
for insert
with check (user_id = public.current_deco_spacio_user_id());

drop policy if exists "Users can update own user row" on public.users;
create policy "Users can update own user row"
on public.users
for update
using (user_id = public.current_deco_spacio_user_id())
with check (user_id = public.current_deco_spacio_user_id());

drop policy if exists "Users can read own images" on public.images;
create policy "Users can read own images"
on public.images
for select
using (user_id = public.current_deco_spacio_user_id());

drop policy if exists "Users can insert own images" on public.images;
create policy "Users can insert own images"
on public.images
for insert
with check (user_id = public.current_deco_spacio_user_id());

drop policy if exists "Users can update own images" on public.images;
create policy "Users can update own images"
on public.images
for update
using (user_id = public.current_deco_spacio_user_id())
with check (user_id = public.current_deco_spacio_user_id());

drop policy if exists "Users can read own stored images" on storage.objects;
create policy "Users can read own stored images"
on storage.objects
for select
using (
  bucket_id = 'deco-spacio-images'
  and (storage.foldername(name))[1] = public.current_deco_spacio_user_id()
);

drop policy if exists "Users can upload own stored images" on storage.objects;
create policy "Users can upload own stored images"
on storage.objects
for insert
with check (
  bucket_id = 'deco-spacio-images'
  and (storage.foldername(name))[1] = public.current_deco_spacio_user_id()
);

drop policy if exists "Users can update own stored images" on storage.objects;
create policy "Users can update own stored images"
on storage.objects
for update
using (
  bucket_id = 'deco-spacio-images'
  and (storage.foldername(name))[1] = public.current_deco_spacio_user_id()
)
with check (
  bucket_id = 'deco-spacio-images'
  and (storage.foldername(name))[1] = public.current_deco_spacio_user_id()
);

create or replace view public.user_gallery as
select
  id,
  user_id,
  prompt,
  final_prompt,
  image_url,
  storage_path,
  status,
  error_message,
  parent_image_id,
  seed,
  room_type,
  interior_style,
  mood_lighting,
  camera_view,
  created_at,
  updated_at
from public.images;
