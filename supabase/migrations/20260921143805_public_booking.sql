-- ============================================================
-- RESERVA PÚBLICA
-- ============================================================

-- ------------------------------------------------------------
-- 1. Comentario del turno
-- ------------------------------------------------------------

ALTER TABLE public.appointments
ADD COLUMN IF NOT EXISTS notes TEXT NOT NULL DEFAULT '';


-- ------------------------------------------------------------
-- 2. Disponibilidad visible públicamente
-- ------------------------------------------------------------

ALTER TABLE public.availability
ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.availability_settings
ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.blocked_dates
ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.blocked_periods
ENABLE ROW LEVEL SECURITY;


DROP POLICY IF EXISTS
  "Public can read availability"
ON public.availability;

CREATE POLICY
  "Public can read availability"
ON public.availability
FOR SELECT
TO anon
USING (true);


DROP POLICY IF EXISTS
  "Public can read availability settings"
ON public.availability_settings;

CREATE POLICY
  "Public can read availability settings"
ON public.availability_settings
FOR SELECT
TO anon
USING (true);


DROP POLICY IF EXISTS
  "Public can read blocked dates"
ON public.blocked_dates;

CREATE POLICY
  "Public can read blocked dates"
ON public.blocked_dates
FOR SELECT
TO anon
USING (true);


DROP POLICY IF EXISTS
  "Public can read blocked periods"
ON public.blocked_periods;

CREATE POLICY
  "Public can read blocked periods"
ON public.blocked_periods
FOR SELECT
TO anon
USING (true);


GRANT SELECT
ON public.availability
TO anon;

GRANT SELECT
ON public.availability_settings
TO anon;

GRANT SELECT
ON public.blocked_dates
TO anon;

GRANT SELECT
ON public.blocked_periods
TO anon;


-- ============================================================
-- 3. TURNOS OCUPADOS PARA LA RESERVA PÚBLICA
-- ============================================================
--
-- No exponemos client_id, nombre, teléfono,
-- precio ni ningún otro dato privado.
-- ============================================================

CREATE OR REPLACE FUNCTION
public.get_public_busy_appointments(
  p_start_date DATE,
  p_end_date DATE
)
RETURNS TABLE (
  appointment_date DATE,
  appointment_time TIME,
  appointment_duration INTEGER,
  appointment_status TEXT
)
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    a.date AS appointment_date,
    a.time AS appointment_time,
    a.duration_minutes AS appointment_duration,
    a.status::TEXT AS appointment_status
  FROM public.appointments AS a
  WHERE
    a.date BETWEEN p_start_date AND p_end_date
    AND a.status::TEXT <> 'CANCELADO'
  ORDER BY
    a.date,
    a.time;
$$;


REVOKE ALL
ON FUNCTION public.get_public_busy_appointments(
  DATE,
  DATE
)
FROM PUBLIC;


GRANT EXECUTE
ON FUNCTION public.get_public_busy_appointments(
  DATE,
  DATE
)
TO anon, authenticated;


-- ============================================================
-- 4. CREAR RESERVA PÚBLICA
-- ============================================================

CREATE OR REPLACE FUNCTION
public.create_public_booking(
  p_name TEXT,
  p_phone TEXT,
  p_service_id BIGINT,
  p_date DATE,
  p_time TIME,
  p_comment TEXT DEFAULT ''
)
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_service_duration INTEGER;
  v_service_price NUMERIC;

  v_weekday TEXT;

  v_enabled BOOLEAN;
  v_start_time TIME;
  v_end_time TIME;

  v_slot_interval INTEGER;
  v_offset_minutes INTEGER;

  v_local_now TIMESTAMP;

  v_phone_normalized TEXT;

  v_client_id BIGINT;
  v_appointment_id BIGINT;
BEGIN

  -- ==========================================================
  -- DATOS BÁSICOS
  -- ==========================================================

  IF NULLIF(TRIM(p_name), '') IS NULL THEN
    RAISE EXCEPTION
      'El nombre es obligatorio.';
  END IF;


  IF NULLIF(TRIM(p_phone), '') IS NULL THEN
    RAISE EXCEPTION
      'El teléfono es obligatorio.';
  END IF;


  v_phone_normalized :=
    regexp_replace(
      p_phone,
      '[^0-9]',
      '',
      'g'
    );


  IF length(v_phone_normalized) < 6 THEN
    RAISE EXCEPTION
      'El teléfono ingresado no es válido.';
  END IF;


  -- ==========================================================
  -- SERVICIO
  -- ==========================================================

  SELECT
    s.duration_minutes,
    s.price
  INTO
    v_service_duration,
    v_service_price
  FROM public.services AS s
  WHERE
    s.id = p_service_id
    AND s.active = true;


  IF NOT FOUND THEN
    RAISE EXCEPTION
      'El servicio seleccionado no está disponible.';
  END IF;


  -- ==========================================================
  -- FECHA Y HORA ACTUAL DE TUCUMÁN
  -- ==========================================================

  v_local_now :=
    timezone(
      'America/Argentina/Tucuman',
      now()
    );


  IF p_date < v_local_now::DATE THEN
    RAISE EXCEPTION
      'No se pueden reservar fechas anteriores.';
  END IF;


  IF
    p_date = v_local_now::DATE
    AND p_time <= v_local_now::TIME
  THEN
    RAISE EXCEPTION
      'Ese horario ya pasó.';
  END IF;


  -- ==========================================================
  -- DÍA DE LA SEMANA
  -- ==========================================================

  v_weekday :=
    CASE EXTRACT(DOW FROM p_date)
      WHEN 0 THEN 'SUNDAY'
      WHEN 1 THEN 'MONDAY'
      WHEN 2 THEN 'TUESDAY'
      WHEN 3 THEN 'WEDNESDAY'
      WHEN 4 THEN 'THURSDAY'
      WHEN 5 THEN 'FRIDAY'
      WHEN 6 THEN 'SATURDAY'
    END;


  SELECT
    a.enabled,
    a.start_time,
    a.end_time
  INTO
    v_enabled,
    v_start_time,
    v_end_time
  FROM public.availability AS a
  WHERE
    a.day_of_week::TEXT =
    v_weekday
  LIMIT 1;


  IF
    NOT FOUND
    OR NOT COALESCE(
      v_enabled,
      false
    )
  THEN
    RAISE EXCEPTION
      'La barbería no atiende ese día.';
  END IF;


  -- ==========================================================
  -- DÍA COMPLETO BLOQUEADO
  -- ==========================================================

  IF EXISTS (
    SELECT 1
    FROM public.blocked_dates AS bd
    WHERE bd.date = p_date
  ) THEN
    RAISE EXCEPTION
      'La fecha seleccionada no está disponible.';
  END IF;


  -- ==========================================================
  -- DENTRO DEL HORARIO LABORAL
  -- ==========================================================

  IF
    p_time < v_start_time
    OR
    p_time
      + make_interval(
          mins =>
            v_service_duration
        )
      > v_end_time
  THEN
    RAISE EXCEPTION
      'El turno queda fuera del horario de atención.';
  END IF;


  -- ==========================================================
  -- INTERVALO CONFIGURADO
  -- ==========================================================

  SELECT
    slot_interval
  INTO
    v_slot_interval
  FROM public.availability_settings
  LIMIT 1;


  IF
    v_slot_interval IS NULL
    OR v_slot_interval <= 0
  THEN
    RAISE EXCEPTION
      'La configuración de intervalos no es válida.';
  END IF;


  v_offset_minutes :=
    (
      EXTRACT(
        EPOCH FROM (
          p_time -
          v_start_time
        )
      ) / 60
    )::INTEGER;


  IF
    mod(
      v_offset_minutes,
      v_slot_interval
    ) <> 0
  THEN
    RAISE EXCEPTION
      'El horario seleccionado no pertenece a un intervalo válido.';
  END IF;


  -- ==========================================================
  -- PERÍODOS BLOQUEADOS
  -- ==========================================================

  IF EXISTS (
    SELECT 1
    FROM public.blocked_periods AS bp
    WHERE
      bp.date = p_date

      AND bp.start_time <
        (
          p_time
          + make_interval(
              mins =>
                v_service_duration
            )
        )

      AND p_time <
        bp.end_time
  ) THEN
    RAISE EXCEPTION
      'El horario seleccionado está bloqueado.';
  END IF;


  -- ==========================================================
  -- EVITAR CONCURRENCIA
  -- ==========================================================
  --
  -- Serializamos las reservas del mismo día.
  -- Luego volvemos a verificar solapamientos.
  -- ==========================================================

  PERFORM
    pg_advisory_xact_lock(
      hashtextextended(
        'booking|' ||
        p_date::TEXT,
        0
      )
    );


  -- ==========================================================
  -- TURNOS YA EXISTENTES
  -- ==========================================================

  IF EXISTS (
    SELECT 1
    FROM public.appointments AS ap
    WHERE
      ap.date = p_date

      AND ap.status::TEXT <>
        'CANCELADO'

      AND ap.time <
        (
          p_time
          + make_interval(
              mins =>
                v_service_duration
            )
        )

      AND p_time <
        (
          ap.time
          + make_interval(
              mins =>
                ap.duration_minutes
            )
        )
  ) THEN
    RAISE EXCEPTION
      'El horario ya no está disponible.';
  END IF;


  -- ==========================================================
  -- CLIENTE
  -- ==========================================================

  PERFORM
    pg_advisory_xact_lock(
      hashtextextended(
        'client|' ||
        v_phone_normalized,
        0
      )
    );


  SELECT
    c.id
  INTO
    v_client_id
  FROM public.clients AS c
  WHERE
    regexp_replace(
      c.phone,
      '[^0-9]',
      '',
      'g'
    ) = v_phone_normalized
  ORDER BY c.id
  LIMIT 1;


  IF v_client_id IS NULL THEN

    INSERT INTO public.clients (
      name,
      phone,
      notes
    )
    VALUES (
      TRIM(p_name),
      TRIM(p_phone),
      ''
    )
    RETURNING id
    INTO v_client_id;

  END IF;


  -- ==========================================================
  -- CREAR TURNO
  -- ==========================================================

  INSERT INTO public.appointments (
    client_id,
    service_id,
    date,
    time,
    price,
    duration_minutes,
    status,
    notes
  )
  VALUES (
    v_client_id,
    p_service_id,
    p_date,
    p_time,
    v_service_price,
    v_service_duration,
    'PENDIENTE',
    COALESCE(
      TRIM(p_comment),
      ''
    )
  )
  RETURNING id
  INTO v_appointment_id;


  RETURN v_appointment_id;
END;
$$;


REVOKE ALL
ON FUNCTION public.create_public_booking(
  TEXT,
  TEXT,
  BIGINT,
  DATE,
  TIME,
  TEXT
)
FROM PUBLIC;


GRANT EXECUTE
ON FUNCTION public.create_public_booking(
  TEXT,
  TEXT,
  BIGINT,
  DATE,
  TIME,
  TEXT
)
TO anon, authenticated;