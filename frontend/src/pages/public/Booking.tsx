import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import Swal from "sweetalert2";

import BookingDateStep from "../../components/public/booking/BookingDateStep";
import BookingDetailsStep from "../../components/public/booking/BookingDetailsStep";
import BookingProgress from "../../components/public/booking/BookingProgress";
import BookingReviewStep from "../../components/public/booking/BookingReviewStep";
import BookingServiceStep from "../../components/public/booking/BookingServiceStep";
import BookingTimeStep from "../../components/public/booking/BookingTimeStep";

import { useAvailability } from "../../context/AvailabilityContext";
import { useServices } from "../../context/ServicesContext";

import {
  createPublicBooking,
  getPublicBusyAppointments,
  type PublicBusyAppointment,
} from "../../services/booking.service";

import type {
  AvailableBookingDate,
  BookingClientData,
  BookingStep,
  TimeSlot,
} from "../../types/booking.types";

import type { BarberService } from "../../types/public.types";

import { getAvailableSlots } from "../../utils/availability";
import { formatDateLong } from "../../utils/formatDate";

const initialClientData: BookingClientData = {
  name: "",
  phone: "",
  comment: "",
};

const BOOKING_DAYS_AHEAD = 14;

const weekDays = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
] as const;

const formatDateKey = (
  date: Date,
) => {
  const year =
    date.getFullYear();

  const month = String(
    date.getMonth() + 1,
  ).padStart(2, "0");

  const day = String(
    date.getDate(),
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const capitalize = (
  value: string,
) => {
  if (!value) {
    return value;
  }

  return (
    value
      .charAt(0)
      .toUpperCase() +
    value.slice(1)
  );
};

const getBookingRange = () => {
  const startDate =
    new Date();

  startDate.setHours(
    0,
    0,
    0,
    0,
  );

  const endDate =
    new Date(startDate);

  endDate.setDate(
    startDate.getDate() +
      BOOKING_DAYS_AHEAD -
      1,
  );

  return {
    startDate:
      formatDateKey(
        startDate,
      ),

    endDate:
      formatDateKey(
        endDate,
      ),
  };
};

const Booking = () => {
  /*
   * =====================================================
   * CONTEXTOS
   * =====================================================
   */

  const {
    services:
      supabaseServices,

    loading:
      servicesLoading,

    error:
      servicesError,
  } = useServices();

  const {
    weeklySchedule,
    slotInterval,
    blockedDates,
    blockedPeriods,

    loading:
      availabilityLoading,

    error:
      availabilityError,
  } = useAvailability();

  /*
   * =====================================================
   * ESTADOS
   * =====================================================
   */

  const [
    step,
    setStep,
  ] =
    useState<BookingStep>(
      "service",
    );

  const [
    selectedService,
    setSelectedService,
  ] =
    useState<
      BarberService | null
    >(null);

  const [
    selectedDate,
    setSelectedDate,
  ] =
    useState<
      string | null
    >(null);

  const [
    selectedTime,
    setSelectedTime,
  ] =
    useState<
      string | null
    >(null);

  const [
    clientData,
    setClientData,
  ] =
    useState<BookingClientData>(
      initialClientData,
    );

  const [
    busyAppointments,
    setBusyAppointments,
  ] =
    useState<
      PublicBusyAppointment[]
    >([]);

  const [
    loadingBusyAppointments,
    setLoadingBusyAppointments,
  ] =
    useState(true);

  const [
    busyAppointmentsError,
    setBusyAppointmentsError,
  ] =
    useState<
      string | null
    >(null);

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  /*
   * =====================================================
   * SERVICIOS
   * =====================================================
   */

  const services =
    useMemo<
      BarberService[]
    >(() => {
      return supabaseServices
        .filter(
          (service) =>
            service.isActive,
        )
        .map(
          (service) => ({
            id: String(
              service.id,
            ),

            name:
              service.name,

            description:
              service.description ??
              "",

            price:
              service.price,

            durationMinutes:
              service.duration,

            active:
              service.isActive,
          }),
        );
    }, [
      supabaseServices,
    ]);

  /*
   * =====================================================
   * CARGAR TURNOS OCUPADOS
   * =====================================================
   *
   * Esta RPC no devuelve datos privados.
   *
   * Solamente devuelve:
   *
   * - fecha
   * - hora
   * - duración
   * - estado
   */

  const loadBusyAppointments =
    useCallback(
      async () => {
        setLoadingBusyAppointments(
          true,
        );

        setBusyAppointmentsError(
          null,
        );

        try {
          const {
            startDate,
            endDate,
          } =
            getBookingRange();

          const result =
            await getPublicBusyAppointments(
              startDate,
              endDate,
            );

          setBusyAppointments(
            result,
          );
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : "No pudimos consultar los turnos ocupados.";

          setBusyAppointments(
            [],
          );

          setBusyAppointmentsError(
            message,
          );
        } finally {
          setLoadingBusyAppointments(
            false,
          );
        }
      },
      [],
    );

  /*
   * Cargar turnos ocupados
   * al abrir /reservar.
   */
  useEffect(() => {
    void loadBusyAppointments();
  }, [
    loadBusyAppointments,
  ]);

  /*
   * =====================================================
   * ESTADOS DE CARGA
   * =====================================================
   */

  const loadingDates =
    availabilityLoading ||
    loadingBusyAppointments;

  const loadingTimeSlots =
    availabilityLoading ||
    loadingBusyAppointments;

  /*
   * =====================================================
   * ERRORES DE SERVICIOS
   * =====================================================
   */

  useEffect(() => {
    if (!servicesError) {
      return;
    }

    void Swal.fire({
      icon: "error",

      title:
        "No pudimos cargar los servicios",

      text:
        "Intentá nuevamente.",

      confirmButtonText:
        "Aceptar",

      confirmButtonColor:
        "var(--color-primary)",
    });
  }, [
    servicesError,
  ]);

  /*
   * =====================================================
   * ERRORES DE DISPONIBILIDAD
   * =====================================================
   */

  useEffect(() => {
    const error =
      availabilityError ??
      busyAppointmentsError;

    if (!error) {
      return;
    }

    void Swal.fire({
      icon: "error",

      title:
        "No pudimos cargar la disponibilidad",

      text:
        error,

      confirmButtonText:
        "Aceptar",

      confirmButtonColor:
        "var(--color-primary)",
    });
  }, [
    availabilityError,
    busyAppointmentsError,
  ]);

  /*
   * =====================================================
   * FECHAS DISPONIBLES
   * =====================================================
   */

  const dates =
    useMemo<
      AvailableBookingDate[]
    >(() => {
      if (
        !selectedService ||
        loadingDates
      ) {
        return [];
      }

      const today =
        new Date();

      today.setHours(
        0,
        0,
        0,
        0,
      );

      return Array.from(
        {
          length:
            BOOKING_DAYS_AHEAD,
        },

        (_, index) => {
          const currentDate =
            new Date(today);

          currentDate.setDate(
            today.getDate() +
              index,
          );

          const date =
            formatDateKey(
              currentDate,
            );

          const weekDay =
            weekDays[
              currentDate.getDay()
            ];

          const daySchedule =
            weeklySchedule.find(
              (day) =>
                day.day ===
                weekDay,
            );

          const availableSlots =
            getAvailableSlots({
              date,

              serviceDuration:
                selectedService
                  .durationMinutes,

              weeklySchedule,

              slotInterval,

              blockedDates,

              blockedPeriods,

              appointments:
                busyAppointments,
            });

          const available =
            availableSlots.length >
            0;

          let reason:
            | string
            | undefined;

          if (
            blockedDates.includes(
              date,
            )
          ) {
            reason =
              "Fecha bloqueada";
          } else if (
            !daySchedule ||
            !daySchedule.isOpen
          ) {
            reason =
              "Cerrado";
          } else if (
            !available
          ) {
            reason =
              "Sin horarios disponibles";
          }

          const weekday =
            capitalize(
              currentDate
                .toLocaleDateString(
                  "es-AR",
                  {
                    weekday:
                      "short",
                  },
                )
                .replace(
                  ".",
                  "",
                ),
            );

          const month =
            capitalize(
              currentDate
                .toLocaleDateString(
                  "es-AR",
                  {
                    month:
                      "short",
                  },
                )
                .replace(
                  ".",
                  "",
                ),
            );

          return {
            date,

            weekday,

            dayNumber:
              String(
                currentDate.getDate(),
              ),

            month,

            available,

            reason,
          };
        },
      );
    }, [
      selectedService,
      weeklySchedule,
      slotInterval,
      blockedDates,
      blockedPeriods,
      busyAppointments,
      loadingDates,
    ]);

  /*
   * =====================================================
   * HORARIOS DISPONIBLES
   * =====================================================
   */

  const timeSlots =
    useMemo<
      TimeSlot[]
    >(() => {
      if (
        !selectedService ||
        !selectedDate ||
        loadingTimeSlots
      ) {
        return [];
      }

      const availableSlots =
        getAvailableSlots({
          date:
            selectedDate,

          serviceDuration:
            selectedService
              .durationMinutes,

          weeklySchedule,

          slotInterval,

          blockedDates,

          blockedPeriods,

          appointments:
            busyAppointments,
        });

      return availableSlots.map(
        (time) => ({
          time,
          available: true,
        }),
      );
    }, [
      selectedService,
      selectedDate,
      weeklySchedule,
      slotInterval,
      blockedDates,
      blockedPeriods,
      busyAppointments,
      loadingTimeSlots,
    ]);

  /*
   * =====================================================
   * VALIDAR FECHA SELECCIONADA
   * =====================================================
   */

  useEffect(() => {
    if (
      loadingDates ||
      !selectedService ||
      !selectedDate
    ) {
      return;
    }

    const currentDate =
      dates.find(
        (date) =>
          date.date ===
          selectedDate,
      );

    if (
      !currentDate ||
      !currentDate.available
    ) {
      setSelectedDate(
        null,
      );

      setSelectedTime(
        null,
      );

      if (
        step !==
        "service"
      ) {
        setStep(
          "date",
        );
      }
    }
  }, [
    dates,
    loadingDates,
    selectedService,
    selectedDate,
    step,
  ]);

  /*
   * =====================================================
   * VALIDAR HORARIO SELECCIONADO
   * =====================================================
   */

  useEffect(() => {
    if (
      loadingTimeSlots ||
      !selectedTime
    ) {
      return;
    }

    const stillAvailable =
      timeSlots.some(
        (slot) =>
          slot.time ===
            selectedTime &&
          slot.available,
      );

    if (!stillAvailable) {
      setSelectedTime(
        null,
      );

      if (
        step ===
          "details" ||
        step ===
          "review"
      ) {
        setStep(
          "time",
        );
      }
    }
  }, [
    timeSlots,
    selectedTime,
    loadingTimeSlots,
    step,
  ]);

  /*
   * =====================================================
   * SELECCIONAR SERVICIO
   * =====================================================
   */

  const handleSelectService = (
    service: BarberService,
  ) => {
    setSelectedService(
      service,
    );

    setSelectedDate(
      null,
    );

    setSelectedTime(
      null,
    );

    setStep(
      "date",
    );
  };

  /*
   * =====================================================
   * SELECCIONAR FECHA
   * =====================================================
   */

  const handleSelectDate = (
    date: string,
  ) => {
    if (!selectedService) {
      return;
    }

    const bookingDate =
      dates.find(
        (item) =>
          item.date ===
          date,
      );

    if (
      !bookingDate ||
      !bookingDate.available
    ) {
      return;
    }

    setSelectedDate(
      date,
    );

    setSelectedTime(
      null,
    );

    setStep(
      "time",
    );
  };

  /*
   * =====================================================
   * SELECCIONAR HORARIO
   * =====================================================
   */

  const handleSelectTime = (
    time: string,
  ) => {
    const slot =
      timeSlots.find(
        (item) =>
          item.time ===
          time,
      );

    if (
      !slot ||
      !slot.available
    ) {
      return;
    }

    setSelectedTime(
      time,
    );

    setStep(
      "details",
    );
  };

  /*
   * =====================================================
   * REINICIAR RESERVA
   * =====================================================
   */

  const resetBooking = () => {
    setStep(
      "service",
    );

    setSelectedService(
      null,
    );

    setSelectedDate(
      null,
    );

    setSelectedTime(
      null,
    );

    setClientData(
      initialClientData,
    );
  };

  /*
   * =====================================================
   * CONFIRMAR RESERVA
   * =====================================================
   */

  const handleConfirmBooking =
    async () => {
      if (
        !selectedService ||
        !selectedDate ||
        !selectedTime
      ) {
        return;
      }

      /*
       * Primera validación:
       * frontend.
       */
      const currentAvailableSlots =
        getAvailableSlots({
          date:
            selectedDate,

          serviceDuration:
            selectedService
              .durationMinutes,

          weeklySchedule,

          slotInterval,

          blockedDates,

          blockedPeriods,

          appointments:
            busyAppointments,
        });

      if (
        !currentAvailableSlots.includes(
          selectedTime,
        )
      ) {
        setSelectedTime(
          null,
        );

        setStep(
          "time",
        );

        await Swal.fire({
          icon: "warning",

          title:
            "El horario ya no está disponible",

          text:
            "Elegí otro horario para continuar.",

          confirmButtonText:
            "Ver horarios",

          confirmButtonColor:
            "var(--color-primary)",
        });

        return;
      }

      /*
       * Validar datos básicos.
       */
      const clientName =
        clientData.name.trim();

      const clientPhone =
        clientData.phone.trim();

      if (
        !clientName ||
        !clientPhone
      ) {
        await Swal.fire({
          icon: "warning",

          title:
            "Datos incompletos",

          text:
            "Ingresá tu nombre y teléfono para continuar.",

          confirmButtonText:
            "Aceptar",

          confirmButtonColor:
            "var(--color-primary)",
        });

        setStep(
          "details",
        );

        return;
      }

      /*
       * El id viene como string
       * en BarberService.
       */
      const serviceId =
        Number(
          selectedService.id,
        );

      if (
        !Number.isInteger(
          serviceId,
        ) ||
        serviceId <= 0
      ) {
        await Swal.fire({
          icon: "error",

          title:
            "Servicio inválido",

          text:
            "Volvé a seleccionar el servicio.",

          confirmButtonText:
            "Aceptar",

          confirmButtonColor:
            "var(--color-primary)",
        });

        setStep(
          "service",
        );

        return;
      }

      setSubmitting(
        true,
      );

      try {
        /*
         * La RPC de Supabase:
         *
         * - vuelve a validar disponibilidad;
         * - busca el cliente por teléfono;
         * - crea el cliente si no existe;
         * - crea el turno;
         * - lo deja como PENDIENTE.
         */
        await createPublicBooking({
          name:
            clientName,

          phone:
            clientPhone,

          comment:
            clientData.comment,

          serviceId,

          date:
            selectedDate,

          time:
            selectedTime,
        });

        /*
         * Actualizamos inmediatamente
         * los horarios ocupados.
         */
        await loadBusyAppointments();

        await Swal.fire({
          icon: "success",

          title:
            "¡Turno reservado correctamente!",

          text: `${
            selectedService.name
          } · ${formatDateLong(
            selectedDate,
          )} · ${selectedTime}`,

          confirmButtonText:
            "Perfecto",

          confirmButtonColor:
            "var(--color-primary)",
        });

        resetBooking();
      } catch (error) {
        /*
         * Volvemos a consultar porque
         * otro cliente podría haber
         * reservado el horario.
         */
        await loadBusyAppointments();

        const message =
          error instanceof Error
            ? error.message
            : "Intentá nuevamente.";

        /*
         * Si Supabase nos indica
         * que el horario dejó de
         * estar disponible, volvemos
         * al paso de horario.
         */
        if (
          message
            .toLowerCase()
            .includes(
              "horario",
            )
        ) {
          setSelectedTime(
            null,
          );

          setStep(
            "time",
          );
        }

        await Swal.fire({
          icon: "error",

          title:
            "No pudimos reservar el turno",

          text:
            message,

          confirmButtonText:
            "Aceptar",

          confirmButtonColor:
            "var(--color-primary)",
        });
      } finally {
        setSubmitting(
          false,
        );
      }
    };

  /*
   * =====================================================
   * RENDER
   * =====================================================
   */

  return (
    <section className="min-h-[calc(100svh-72px)] bg-[var(--color-background)] py-10 sm:py-14 lg:py-16">
      <div className="mx-auto max-w-5xl px-5 lg:px-8">
        <div className="mb-8 text-center">
          <span className="inline-flex rounded-full border border-[var(--color-border)] bg-[var(--color-background-light)] px-4 py-2 text-xs font-semibold tracking-[0.14em] text-[var(--color-text-secondary)] uppercase shadow-sm">
            Reserva online
          </span>

          <h1 className="mt-5 text-3xl font-black tracking-tight text-[var(--color-text)] sm:text-4xl lg:text-5xl">
            Reservá tu próximo turno
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[var(--color-text-secondary)] sm:text-base">
            Elegí tu servicio, fecha y
            horario. No necesitás crear
            una cuenta.
          </p>
        </div>

        <div className="rounded-[1.75rem] border border-[var(--color-border)] bg-[var(--color-background-light)] p-5 shadow-xl sm:p-7 lg:p-9">
          <BookingProgress
            currentStep={step}
          />

          <div className="my-7 h-px bg-[var(--color-border)] sm:my-9" />

          {step ===
            "service" && (
            <BookingServiceStep
              services={
                services
              }

              selectedService={
                selectedService
              }

              loading={
                servicesLoading
              }

              onSelect={
                handleSelectService
              }
            />
          )}

          {step ===
            "date" && (
            <BookingDateStep
              dates={
                dates
              }

              selectedDate={
                selectedDate
              }

              loading={
                loadingDates
              }

              onSelect={
                handleSelectDate
              }

              onBack={() =>
                setStep(
                  "service",
                )
              }
            />
          )}

          {step ===
            "time" && (
            <BookingTimeStep
              slots={
                timeSlots
              }

              selectedTime={
                selectedTime
              }

              loading={
                loadingTimeSlots
              }

              onSelect={
                handleSelectTime
              }

              onBack={() =>
                setStep(
                  "date",
                )
              }
            />
          )}

          {step ===
            "details" && (
            <BookingDetailsStep
              data={
                clientData
              }

              onChange={
                setClientData
              }

              onContinue={() =>
                setStep(
                  "review",
                )
              }

              onBack={() =>
                setStep(
                  "time",
                )
              }
            />
          )}

          {step ===
              "review" &&
            selectedService &&
            selectedDate &&
            selectedTime && (
              <BookingReviewStep
                service={
                  selectedService
                }

                date={
                  selectedDate
                }

                time={
                  selectedTime
                }

                client={
                  clientData
                }

                submitting={
                  submitting
                }

                onBack={() =>
                  setStep(
                    "details",
                  )
                }

                onConfirm={
                  handleConfirmBooking
                }
              />
            )}
        </div>

        <p className="mt-6 text-center text-xs leading-5 text-[var(--color-text-secondary)]">
          Los días y horarios
          disponibles se calculan
          según la configuración
          actual de la barbería.
        </p>
      </div>
    </section>
  );
};

export default Booking;