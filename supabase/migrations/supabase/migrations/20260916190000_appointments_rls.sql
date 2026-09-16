-- =====================================================
-- APPOINTMENTS
-- Datos históricos, índices y RLS
-- =====================================================

-- El precio y la duración se guardan en el turno.
-- Así, un cambio futuro en un servicio no modifica
-- la facturación de turnos anteriores.

alter table public.appointments
add column if not exists price numeric(12, 2);

alter table public.appointments
add column if not exists duration_minutes integer;

-- Completar registros anteriores, si existieran.

update public.appointments as appointment
set
  price = coalesce(
    appointment.price,
    service.price
  ),
  duration_minutes = coalesce(
    appointment.duration_minutes,
    service.duration_minutes
  )
from public.services as service
where appointment.service_id = service.id
  and (
    appointment.price is null
    or appointment.duration_minutes is null
  );

alter table public.appointments
alter column price set not null;

alter table public.appointments
alter column duration_minutes set not null;

-- Índices para las consultas más frecuentes.

create index if not exists appointments_date_idx
on public.appointments (date);

create index if not exists appointments_client_id_idx
on public.appointments (client_id);

create index if not exists appointments_service_id_idx
on public.appointments (service_id);

-- Evita dos turnos activos exactamente en la misma fecha y hora.
-- Los turnos cancelados no bloquean el horario.

create unique index if not exists appointments_unique_active_slot
on public.appointments (date, time)
where status <> 'CANCELADO'::public.appointment_status;

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

alter table public.appointments
enable row level security;

create policy "authenticated_users_can_read_appointments"
on public.appointments
for select
to authenticated
using (true);

create policy "authenticated_users_can_create_appointments"
on public.appointments
for insert
to authenticated
with check (true);

create policy "authenticated_users_can_update_appointments"
on public.appointments
for update
to authenticated
using (true)
with check (true);

create policy "authenticated_users_can_delete_appointments"
on public.appointments
for delete
to authenticated
using (true);