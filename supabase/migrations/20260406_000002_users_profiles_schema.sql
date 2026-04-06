create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  display_name text,
  avatar_url text,
  headline text,
  bio text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete set null,
  supabase_auth_user_id uuid unique,
  firebase_uid text unique,
  email citext not null,
  username text,
  full_name text,
  image_url text,
  auth_provider text not null default 'unknown',
  role text not null default 'user',
  is_active boolean not null default true,
  legacy_project_id text,
  password_changed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint users_auth_provider_check
    check (auth_provider in ('password', 'google', 'magic_link', 'unknown')),
  constraint users_email_not_blank_check
    check (length(trim(email::text)) > 0),
  constraint users_identity_present_check
    check (supabase_auth_user_id is not null or firebase_uid is not null)
);

create unique index if not exists users_email_unique_idx
  on public.users (email);

create unique index if not exists users_username_unique_idx
  on public.users (lower(username))
  where username is not null;

create index if not exists users_profile_id_idx
  on public.users (profile_id);

create index if not exists users_role_is_active_idx
  on public.users (role, is_active);

create index if not exists users_legacy_project_id_idx
  on public.users (legacy_project_id)
  where legacy_project_id is not null;

create table if not exists public.user_preferences (
  user_id uuid primary key references public.users(id) on delete cascade,
  email_notifications boolean not null default true,
  newsletter boolean not null default false,
  dark_mode boolean not null default false,
  language text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.user_privacy_settings (
  user_id uuid primary key references public.users(id) on delete cascade,
  marketing_consent boolean not null default false,
  analytics_consent boolean not null default false,
  profile_email_visible boolean not null default true,
  profile_status_visible boolean not null default true,
  updated_by text not null default 'self',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint user_privacy_settings_updated_by_check
    check (updated_by in ('self', 'system', 'admin'))
);

drop trigger if exists trg_profiles_set_updated_at on public.profiles;
create trigger trg_profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_row_updated_at();

drop trigger if exists trg_users_set_updated_at on public.users;
create trigger trg_users_set_updated_at
before update on public.users
for each row
execute function public.set_row_updated_at();

drop trigger if exists trg_user_preferences_set_updated_at on public.user_preferences;
create trigger trg_user_preferences_set_updated_at
before update on public.user_preferences
for each row
execute function public.set_row_updated_at();

drop trigger if exists trg_user_privacy_settings_set_updated_at on public.user_privacy_settings;
create trigger trg_user_privacy_settings_set_updated_at
before update on public.user_privacy_settings
for each row
execute function public.set_row_updated_at();
