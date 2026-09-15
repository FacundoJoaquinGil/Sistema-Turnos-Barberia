-- =========================================================
-- SERVICES - RLS POLICIES
-- =========================================================


-- Los servicios activos pueden ser consultados públicamente.
-- Esto será necesario para la landing y reserva de turnos.

create policy "Public can read active services"
on public.services
for select
to anon
using (active = true);


-- Los usuarios autenticados pueden consultar todos los servicios,
-- incluyendo los inactivos.

create policy "Authenticated users can read services"
on public.services
for select
to authenticated
using (true);


-- Solo usuarios autenticados pueden crear servicios.

create policy "Authenticated users can create services"
on public.services
for insert
to authenticated
with check (true);


-- Solo usuarios autenticados pueden modificar servicios.

create policy "Authenticated users can update services"
on public.services
for update
to authenticated
using (true)
with check (true);