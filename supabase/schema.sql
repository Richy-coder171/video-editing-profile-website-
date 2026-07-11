create extension if not exists pgcrypto;

create table if not exists public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  type text check (
    type in (
      'reel',
      'video',
      'photoshop',
      'illustrator',
      'thumbnail',
      'poster',
      'logo',
      'social'
    )
  ),
  category text,
  project_date date,
  role text,
  project_goal text,
  process text,
  result text,
  aspect_ratio text,
  external_url text,
  client_name text,
  tools text[] default '{}',
  media_url text,
  thumbnail_url text,
  cloudinary_public_id text unique,
  thumbnail_public_id text,
  resource_type text,
  featured boolean default false,
  sort_order integer,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table if exists public.portfolio_items
  add column if not exists project_date date;

alter table if exists public.portfolio_items
  add column if not exists role text,
  add column if not exists project_goal text,
  add column if not exists process text,
  add column if not exists result text,
  add column if not exists aspect_ratio text,
  add column if not exists external_url text,
  add column if not exists client_name text;

create index if not exists portfolio_items_type_idx on public.portfolio_items (type);
create index if not exists portfolio_items_featured_idx on public.portfolio_items (featured);
create index if not exists portfolio_items_project_date_idx on public.portfolio_items (project_date desc);
create index if not exists portfolio_items_sort_idx on public.portfolio_items (sort_order, created_at desc);
