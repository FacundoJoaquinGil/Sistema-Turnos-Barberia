-- =========================================================
-- SEED - SISTEMA DE TURNOS BARBERÍA
-- Datos exclusivamente para desarrollo
-- =========================================================


-- =========================================================
-- LIMPIAR DATOS EXISTENTES
-- =========================================================

truncate table
  public.appointments,
  public.availability,
  public.clients,
  public.services
restart identity cascade;


-- =========================================================
-- SERVICES
-- =========================================================

insert into public.services (
  name,
  description,
  duration_minutes,
  price,
  active
)
values
  (
    'Corte clásico',
    'Corte tradicional adaptado al estilo del cliente.',
    45,
    9000,
    true
  ),
  (
    'Corte + Barba',
    'Servicio completo de corte de cabello y arreglo de barba.',
    60,
    13000,
    true
  ),
  (
    'Corte degradado',
    'Corte degradado con terminaciones y detalles.',
    45,
    10000,
    true
  ),
  (
    'Barba',
    'Perfilado, arreglo y terminación de barba.',
    30,
    6000,
    true
  );


-- =========================================================
-- CLIENTS
-- =========================================================

insert into public.clients (
  name,
  phone
)
values
  ('Martín Pérez', '381 555-1201'),
  ('Lautaro Gómez', '381 555-1202'),
  ('Nicolás Ruiz', '381 555-1203'),
  ('Franco Díaz', '381 555-1204'),
  ('Lucas Herrera', '381 555-1205'),
  ('Agustín López', '381 555-1206'),
  ('Tomás Medina', '381 555-1207'),
  ('Matías Romero', '381 555-1208'),
  ('Facundo Torres', '381 555-1209'),
  ('Bruno Sánchez', '381 555-1210'),
  ('Santiago Paz', '381 555-1211'),
  ('Ramiro Vega', '381 555-1212'),
  ('Emiliano Rojas', '381 555-1213'),
  ('Joaquín Molina', '381 555-1214'),
  ('Ignacio Cruz', '381 555-1215');


-- =========================================================
-- AVAILABILITY
-- 0 = domingo
-- 1 = lunes
-- ...
-- 6 = sábado
-- =========================================================

insert into public.availability (
  day_of_week,
  enabled,
  start_time,
  end_time
)
values
  (0, false, null, null),
  (1, true, '09:00', '19:00'),
  (2, true, '09:00', '19:00'),
  (3, true, '09:00', '19:00'),
  (4, true, '09:00', '19:00'),
  (5, true, '09:00', '20:00'),
  (6, true, '09:00', '18:00');


-- =========================================================
-- APPOINTMENTS - MES ANTERIOR
-- Sirven para comparación mensual de estadísticas
-- =========================================================

insert into public.appointments (
  client_id,
  service_id,
  date,
  time,
  status,
  price,
  duration_minutes
)
values
(
  (
    select id
    from public.clients
    where phone = '381 555-1201'
    limit 1
  ),
  (
    select id
    from public.services
    where name = 'Corte clásico'
    limit 1
  ),
  (
    date_trunc('month', current_date)
    - interval '1 month'
    + interval '4 days'
  )::date,
  '09:00',
  'COMPLETADO',
  9000,
  45
),
(
  (
    select id
    from public.clients
    where phone = '381 555-1202'
    limit 1
  ),
  (
    select id
    from public.services
    where name = 'Corte + Barba'
    limit 1
  ),
  (
    date_trunc('month', current_date)
    - interval '1 month'
    + interval '7 days'
  )::date,
  '10:00',
  'COMPLETADO',
  13000,
  60
),
(
  (
    select id
    from public.clients
    where phone = '381 555-1203'
    limit 1
  ),
  (
    select id
    from public.services
    where name = 'Corte degradado'
    limit 1
  ),
  (
    date_trunc('month', current_date)
    - interval '1 month'
    + interval '12 days'
  )::date,
  '11:00',
  'COMPLETADO',
  10000,
  45
),
(
  (
    select id
    from public.clients
    where phone = '381 555-1204'
    limit 1
  ),
  (
    select id
    from public.services
    where name = 'Barba'
    limit 1
  ),
  (
    date_trunc('month', current_date)
    - interval '1 month'
    + interval '17 days'
  )::date,
  '16:00',
  'COMPLETADO',
  6000,
  30
),
(
  (
    select id
    from public.clients
    where phone = '381 555-1205'
    limit 1
  ),
  (
    select id
    from public.services
    where name = 'Corte clásico'
    limit 1
  ),
  (
    date_trunc('month', current_date)
    - interval '1 month'
    + interval '22 days'
  )::date,
  '18:00',
  'COMPLETADO',
  9000,
  45
);


-- =========================================================
-- APPOINTMENTS - ÚLTIMOS DÍAS
-- Alimentan el gráfico de estadísticas
-- =========================================================

insert into public.appointments (
  client_id,
  service_id,
  date,
  time,
  status,
  price,
  duration_minutes
)
values
(
  (select id from public.clients where phone = '381 555-1207' limit 1),
  (select id from public.services where name = 'Corte clásico' limit 1),
  current_date - 6,
  '09:00',
  'COMPLETADO',
  9000,
  45
),
(
  (select id from public.clients where phone = '381 555-1208' limit 1),
  (select id from public.services where name = 'Corte + Barba' limit 1),
  current_date - 5,
  '10:00',
  'COMPLETADO',
  13000,
  60
),
(
  (select id from public.clients where phone = '381 555-1209' limit 1),
  (select id from public.services where name = 'Corte clásico' limit 1),
  current_date - 5,
  '15:30',
  'COMPLETADO',
  9000,
  45
),
(
  (select id from public.clients where phone = '381 555-1210' limit 1),
  (select id from public.services where name = 'Corte degradado' limit 1),
  current_date - 4,
  '11:00',
  'COMPLETADO',
  10000,
  45
),
(
  (select id from public.clients where phone = '381 555-1211' limit 1),
  (select id from public.services where name = 'Barba' limit 1),
  current_date - 3,
  '16:00',
  'COMPLETADO',
  6000,
  30
),
(
  (select id from public.clients where phone = '381 555-1212' limit 1),
  (select id from public.services where name = 'Corte + Barba' limit 1),
  current_date - 3,
  '18:00',
  'COMPLETADO',
  13000,
  60
),
(
  (select id from public.clients where phone = '381 555-1213' limit 1),
  (select id from public.services where name = 'Corte clásico' limit 1),
  current_date - 2,
  '10:00',
  'COMPLETADO',
  9000,
  45
),
(
  (select id from public.clients where phone = '381 555-1214' limit 1),
  (select id from public.services where name = 'Corte degradado' limit 1),
  current_date - 1,
  '09:30',
  'COMPLETADO',
  10000,
  45
);


-- =========================================================
-- APPOINTMENTS - HOY
-- Mezclamos todos los estados
-- =========================================================

insert into public.appointments (
  client_id,
  service_id,
  date,
  time,
  status,
  price,
  duration_minutes
)
values
(
  (select id from public.clients where phone = '381 555-1201' limit 1),
  (select id from public.services where name = 'Corte clásico' limit 1),
  current_date,
  '09:00',
  'COMPLETADO',
  9000,
  45
),
(
  (select id from public.clients where phone = '381 555-1202' limit 1),
  (select id from public.services where name = 'Corte + Barba' limit 1),
  current_date,
  '10:00',
  'COMPLETADO',
  13000,
  60
),
(
  (select id from public.clients where phone = '381 555-1203' limit 1),
  (select id from public.services where name = 'Corte degradado' limit 1),
  current_date,
  '11:30',
  'CONFIRMADO',
  10000,
  45
),
(
  (select id from public.clients where phone = '381 555-1204' limit 1),
  (select id from public.services where name = 'Barba' limit 1),
  current_date,
  '13:00',
  'PENDIENTE',
  6000,
  30
),
(
  (select id from public.clients where phone = '381 555-1205' limit 1),
  (select id from public.services where name = 'Corte clásico' limit 1),
  current_date,
  '15:00',
  'CONFIRMADO',
  9000,
  45
),
(
  (select id from public.clients where phone = '381 555-1206' limit 1),
  (select id from public.services where name = 'Corte + Barba' limit 1),
  current_date,
  '17:00',
  'CANCELADO',
  13000,
  60
);


-- =========================================================
-- APPOINTMENTS - FUTUROS
-- Sirven para Agenda y Turnos
-- =========================================================

insert into public.appointments (
  client_id,
  service_id,
  date,
  time,
  status,
  price,
  duration_minutes
)
values
(
  (select id from public.clients where phone = '381 555-1207' limit 1),
  (select id from public.services where name = 'Corte + Barba' limit 1),
  current_date + 1,
  '10:00',
  'CONFIRMADO',
  13000,
  60
),
(
  (select id from public.clients where phone = '381 555-1208' limit 1),
  (select id from public.services where name = 'Corte clásico' limit 1),
  current_date + 1,
  '12:00',
  'PENDIENTE',
  9000,
  45
),
(
  (select id from public.clients where phone = '381 555-1209' limit 1),
  (select id from public.services where name = 'Corte degradado' limit 1),
  current_date + 2,
  '16:00',
  'CONFIRMADO',
  10000,
  45
),
(
  (select id from public.clients where phone = '381 555-1210' limit 1),
  (select id from public.services where name = 'Barba' limit 1),
  current_date + 3,
  '18:00',
  'PENDIENTE',
  6000,
  30
);