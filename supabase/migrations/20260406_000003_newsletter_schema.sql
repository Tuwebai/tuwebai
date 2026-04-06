create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email citext not null,
  email_normalized citext not null,
  legacy_firestore_id text unique,
  status text not null,
  created_at timestamptz not null default timezone('utc', now()),
  confirmed_at timestamptz,
  unsubscribed_at timestamptz,
  bounced_at timestamptz,
  complained_at timestamptz,
  updated_at timestamptz not null default timezone('utc', now()),
  last_submitted_at timestamptz not null default timezone('utc', now()),
  first_source text not null,
  last_source text not null,
  sources text[] not null default '{}',
  submission_count integer not null default 1,
  consent_ip_address text,
  consent_user_agent text,
  consent_submitted_at timestamptz not null default timezone('utc', now()),
  brevo_sync_status text,
  brevo_last_operation text,
  brevo_last_attempt_at timestamptz,
  brevo_last_synced_at timestamptz,
  brevo_last_error text,
  brevo_retry_count integer not null default 0,
  constraint newsletter_subscribers_status_check
    check (status in ('pending_confirmation', 'subscribed', 'unsubscribed', 'bounced', 'complained')),
  constraint newsletter_subscribers_email_not_blank_check
    check (length(trim(email::text)) > 0),
  constraint newsletter_subscribers_email_normalized_not_blank_check
    check (length(trim(email_normalized::text)) > 0),
  constraint newsletter_subscribers_brevo_sync_status_check
    check (
      brevo_sync_status is null
      or brevo_sync_status in ('pending', 'synced', 'failed')
    ),
  constraint newsletter_subscribers_brevo_last_operation_check
    check (
      brevo_last_operation is null
      or brevo_last_operation in ('subscribe', 'unsubscribe')
    )
);

create unique index if not exists newsletter_subscribers_email_normalized_unique_idx
  on public.newsletter_subscribers (email_normalized);

create index if not exists newsletter_subscribers_status_updated_at_idx
  on public.newsletter_subscribers (status, updated_at desc);

create index if not exists newsletter_subscribers_last_submitted_at_idx
  on public.newsletter_subscribers (last_submitted_at desc);

create table if not exists public.newsletter_subscription_events (
  id uuid primary key default gen_random_uuid(),
  subscriber_id uuid not null references public.newsletter_subscribers(id) on delete cascade,
  event_type text not null,
  source text,
  event_at timestamptz not null default timezone('utc', now()),
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  constraint newsletter_subscription_events_type_check
    check (
      event_type in (
        'submitted',
        'confirmed',
        'unsubscribed',
        'bounced',
        'complained',
        'brevo_sync'
      )
    )
);

create index if not exists newsletter_subscription_events_subscriber_event_at_idx
  on public.newsletter_subscription_events (subscriber_id, event_at desc);

drop trigger if exists trg_newsletter_subscribers_set_updated_at on public.newsletter_subscribers;
create trigger trg_newsletter_subscribers_set_updated_at
before update on public.newsletter_subscribers
for each row
execute function public.set_row_updated_at();
