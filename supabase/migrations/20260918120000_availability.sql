-- =====================================================
-- DISPONIBILIDAD SEMANAL
-- La tabla availability ya existe en initial_schema.
-- day_of_week: 0 domingo, 1 lunes ... 6 sábado.
-- =====================================================

insert into public.availability (
  day_of_week,
  enabled,
  start_time,
  end_time
)
values
  (0, false, '09:00', '18:00'),
  (1, true,  '09:00', '18:00'),
  (2, true,  '09:00', '18:00'),
  (3, true,  '09:00', '18:00'),
  (4, true,  '09:00', '18:00'),
  (5, true,  '09:00', '18:00'),
  (6, true,  '09:00', '14:00')
on conflict (day_of_week) do nothing;

-- =====================================================
-- CONFIGURACIÓN GENERAL
-- =====================================================

create table if not exists public.availability_settings (
  id smallint primary key default 1
    check (id = 1),

  slot_interval integer not null default 30
    check (
      slot_interval in (15, 30, 45, 60)
    ),

  updated_at timestamptz not null default now()
);

insert into public.availability_settings (
  id,
  slot_interval
)
values (1, 30)
on conflict (id) do nothing;

-- =====================================================
-- DÍAS COMPLETAMENTE BLOQUEADOS
-- =====================================================

create table if not exists public.blocked_dates (
  id bigint generated always as identity
    primary key,

  date date not null unique,

  reason text not null default '',

  created_at timestamptz not null default now()
);

create index if not exists blocked_dates_date_idx
on public.blocked_dates (date);

-- =====================================================
-- PERÍODOS BLOQUEADOS DENTRO DE UN DÍA
-- =====================================================

create table if not exists public.blocked_periods (
  id bigint generated always as identity
    primary key,

  date date not null,

  start_time time not null,

  end_time time not null,

  reason text not null default '',

  created_at timestamptz not null default now(),

  constraint blocked_periods_valid_time
    check (start_time < end_time)
);

create index if not exists blocked_periods_date_idx
on public.blocked_periods (date);

-- =====================================================
-- RLS
-- =====================================================

alter table public.availability
enable row level security;

alter table public.availability_settings
enable row level security;

alter table public.blocked_dates
enable row level security;

alter table public.blocked_periods
enable row level security;

drop policy if exists
  "authenticated_read_availability"
on public.availability;

drop policy if exists
  "authenticated_update_availability"
on public.availability;

drop policy if exists
  "authenticated_read_availability_settings"
on public.availability_settings;

drop policy if exists
  "authenticated_update_availability_settings"
on public.availability_settings;

drop policy if exists
  "authenticated_insert_availability_settings"
on public.availability_settings;

drop policy if exists
  "authenticated_manage_blocked_dates"
on public.blocked_dates;

drop policy if exists
  "authenticated_manage_blocked_periods"
on public.blocked_periods;

-- Disponibilidad semanal

create policy "authenticated_read_availability"
on public.availability
for select
to authenticated
using (true);

create policy "authenticated_update_availability"
on public.availability
for update
to authenticated
using (true)
with check (true);

-- Configuración

create policy "authenticated_read_availability_settings"
on public.availability_settings
for select
to authenticated
using (true);

create policy "authenticated_update_availability_settings"
on public.availability_settings
for update
to authenticated
using (true)
with check (true);

create policy "authenticated_insert_availability_settings"
on public.availability_settings
for insert
to authenticated
with check (true);

-- Días bloqueados

create policy "authenticated_manage_blocked_dates"
on public.blocked_dates
for all
to authenticated
using (true)
with check (true);

-- Períodos bloqueados

create policy "authenticated_manage_blocked_periods"
on public.blocked_periods
for all
to authenticated
using (true)
with check (true);