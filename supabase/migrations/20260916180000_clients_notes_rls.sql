-- =====================================================
-- CLIENTS
-- Agregar notas y configurar seguridad
-- =====================================================

alter table public.clients
add column if not exists notes text not null default '';

alter table public.clients
enable row level security;

-- El administrador autenticado puede consultar clientes
create policy "authenticated_users_can_read_clients"
on public.clients
for select
to authenticated
using (true);

-- El administrador autenticado puede crear clientes
create policy "authenticated_users_can_create_clients"
on public.clients
for insert
to authenticated
with check (true);

-- El administrador autenticado puede actualizar clientes
create policy "authenticated_users_can_update_clients"
on public.clients
for update
to authenticated
using (true)
with check (true);