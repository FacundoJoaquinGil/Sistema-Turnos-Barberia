-- =========================================================
-- ENUMS
-- =========================================================

create type public.appointment_status as enum (
  'PENDIENTE',
  'CONFIRMADO',
  'COMPLETADO',
  'CANCELADO'
);


-- =========================================================
-- CLIENTS
-- =========================================================

create table public.clients (
  id bigint generated always as identity primary key,

  name text not null,

  phone text not null,

  created_at timestamptz not null default now(),

  updated_at timestamptz not null default now()
);


-- =========================================================
-- SERVICES
-- =========================================================

create table public.services (
  id bigint generated always as identity primary key,

  name text not null,

  description text,

  duration_minutes integer not null
    check (duration_minutes > 0),

  price numeric(10, 2) not null
    check (price >= 0),

  active boolean not null default true,

  created_at timestamptz not null default now(),

  updated_at timestamptz not null default now()
);


-- =========================================================
-- APPOINTMENTS
-- =========================================================

create table public.appointments (
  id bigint generated always as identity primary key,

  client_id bigint not null
    references public.clients(id),

  service_id bigint not null
    references public.services(id),

  date date not null,

  time time not null,

  status public.appointment_status
    not null
    default 'PENDIENTE',

  -- Snapshot del servicio al momento del turno.
  -- Evita que cambios futuros de precio/duración
  -- modifiquen estadísticas históricas.
  price numeric(10, 2) not null
    check (price >= 0),

  duration_minutes integer not null
    check (duration_minutes > 0),

  created_at timestamptz not null default now(),

  updated_at timestamptz not null default now()
);


-- =========================================================
-- AVAILABILITY
-- =========================================================

create table public.availability (
  id bigint generated always as identity primary key,

  -- 0 = domingo
  -- 1 = lunes
  -- ...
  -- 6 = sábado
  day_of_week integer not null
    check (day_of_week between 0 and 6),

  enabled boolean not null default true,

  start_time time,

  end_time time,

  created_at timestamptz not null default now(),

  updated_at timestamptz not null default now(),

  constraint availability_day_unique
    unique (day_of_week),

  constraint availability_valid_time
    check (
      enabled = false
      or (
        start_time is not null
        and end_time is not null
        and start_time < end_time
      )
    )
);


-- =========================================================
-- INDEXES
-- =========================================================

create index appointments_date_idx
  on public.appointments(date);

create index appointments_client_id_idx
  on public.appointments(client_id);

create index appointments_service_id_idx
  on public.appointments(service_id);

create index appointments_status_idx
  on public.appointments(status);


-- =========================================================
-- UPDATED_AT
-- =========================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;


create trigger clients_set_updated_at
before update on public.clients
for each row
execute function public.set_updated_at();


create trigger services_set_updated_at
before update on public.services
for each row
execute function public.set_updated_at();


create trigger appointments_set_updated_at
before update on public.appointments
for each row
execute function public.set_updated_at();


create trigger availability_set_updated_at
before update on public.availability
for each row
execute function public.set_updated_at();


-- =========================================================
-- ROW LEVEL SECURITY
-- =========================================================

alter table public.clients
enable row level security;

alter table public.services
enable row level security;

alter table public.appointments
enable row level security;

alter table public.availability
enable row level security;