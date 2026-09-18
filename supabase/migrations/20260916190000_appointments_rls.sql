-- =====================================================
-- RLS DE APPOINTMENTS
-- =====================================================

alter table public.appointments
enable row level security;

drop policy if exists
  "authenticated_users_can_read_appointments"
on public.appointments;

drop policy if exists
  "authenticated_users_can_create_appointments"
on public.appointments;

drop policy if exists
  "authenticated_users_can_update_appointments"
on public.appointments;

drop policy if exists
  "authenticated_users_can_delete_appointments"
on public.appointments;

create policy
  "authenticated_users_can_read_appointments"
on public.appointments
for select
to authenticated
using (true);

create policy
  "authenticated_users_can_create_appointments"
on public.appointments
for insert
to authenticated
with check (true);

create policy
  "authenticated_users_can_update_appointments"
on public.appointments
for update
to authenticated
using (true)
with check (true);

create policy
  "authenticated_users_can_delete_appointments"
on public.appointments
for delete
to authenticated
using (true);