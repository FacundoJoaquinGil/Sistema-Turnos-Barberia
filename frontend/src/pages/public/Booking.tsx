import {
  useEffect,
  useState,
} from "react";
import Swal from "sweetalert2";

import BookingDateStep from "../../components/public/booking/BookingDateStep";
import BookingDetailsStep from "../../components/public/booking/BookingDetailsStep";
import BookingProgress from "../../components/public/booking/BookingProgress";
import BookingReviewStep from "../../components/public/booking/BookingReviewStep";
import BookingServiceStep from "../../components/public/booking/BookingServiceStep";
import BookingTimeStep from "../../components/public/booking/BookingTimeStep";

import {
  createMockAppointment,
  getAvailableBookingDates,
  getAvailableTimeSlots,
  getBookableServices,
} from "../../services/booking.service";

import type {
  AvailableBookingDate,
  BookingClientData,
  BookingStep,
  TimeSlot,
} from "../../types/booking.types";

import type { BarberService } from "../../types/public.types";

import { formatDateLong } from "../../utils/formatDate";

const initialClientData: BookingClientData = {
  name: "",
  phone: "",
  comment: "",
};

const Booking = () => {
  const [step, setStep] =
    useState<BookingStep>("service");

  const [services, setServices] =
    useState<BarberService[]>([]);

  const [dates, setDates] =
    useState<
      AvailableBookingDate[]
    >([]);

  const [timeSlots, setTimeSlots] =
    useState<TimeSlot[]>([]);

  const [
    selectedService,
    setSelectedService,
  ] = useState<BarberService | null>(
    null,
  );

  const [
    selectedDate,
    setSelectedDate,
  ] = useState<string | null>(null);

  const [
    selectedTime,
    setSelectedTime,
  ] = useState<string | null>(null);

  const [clientData, setClientData] =
    useState<BookingClientData>(
      initialClientData,
    );

  const [
    loadingServices,
    setLoadingServices,
  ] = useState(true);

  const [
    loadingDates,
    setLoadingDates,
  ] = useState(false);

  const [
    loadingTimeSlots,
    setLoadingTimeSlots,
  ] = useState(false);

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  useEffect(() => {
    const loadInitialData =
      async () => {
        try {
          const result =
            await getBookableServices();

          setServices(result);
        } catch {
          await Swal.fire({
            icon: "error",
            title:
              "No pudimos cargar los servicios",
            text: "Intentá nuevamente.",
            confirmButtonText:
              "Aceptar",
          });
        } finally {
          setLoadingServices(false);
        }
      };

    void loadInitialData();
  }, []);

  const handleSelectService =
    async (
      service: BarberService,
    ) => {
      setSelectedService(service);
      setSelectedDate(null);
      setSelectedTime(null);
      setTimeSlots([]);

      setStep("date");
      setLoadingDates(true);

      try {
        const result =
          await getAvailableBookingDates();

        setDates(result);
      } catch {
        await Swal.fire({
          icon: "error",
          title:
            "No pudimos consultar las fechas",
          text: "Intentá nuevamente.",
        });
      } finally {
        setLoadingDates(false);
      }
    };

  const handleSelectDate =
    async (date: string) => {
      if (!selectedService) {
        return;
      }

      setSelectedDate(date);
      setSelectedTime(null);

      setStep("time");
      setLoadingTimeSlots(true);

      try {
        const result =
          await getAvailableTimeSlots(
            date,
            selectedService.durationMinutes,
          );

        setTimeSlots(result);
      } catch {
        await Swal.fire({
          icon: "error",
          title:
            "No pudimos consultar los horarios",
          text: "Intentá nuevamente.",
        });
      } finally {
        setLoadingTimeSlots(false);
      }
    };

  const handleSelectTime = (
    time: string,
  ) => {
    setSelectedTime(time);
    setStep("details");
  };

  const resetBooking = () => {
    setStep("service");

    setSelectedService(null);
    setSelectedDate(null);
    setSelectedTime(null);

    setClientData(
      initialClientData,
    );

    setTimeSlots([]);
  };

  const handleConfirmBooking =
    async () => {
      if (
        !selectedService ||
        !selectedDate ||
        !selectedTime
      ) {
        return;
      }

      setSubmitting(true);

      try {
        await createMockAppointment({
          service: selectedService,
          date: selectedDate,
          time: selectedTime,
          client: clientData,
        });

        await Swal.fire({
          icon: "success",
          title:
            "¡Turno reservado correctamente!",
          text: `${selectedService.name} · ${formatDateLong(
            selectedDate,
          )} · ${selectedTime}`,
          confirmButtonText:
            "Perfecto",
        });

        resetBooking();
      } catch {
        await Swal.fire({
          icon: "error",
          title:
            "No pudimos reservar el turno",
          text: "Intentá nuevamente.",
          confirmButtonText:
            "Aceptar",
        });
      } finally {
        setSubmitting(false);
      }
    };

  return (
    <section className="min-h-[calc(100svh-72px)] bg-[var(--color-background)] py-10 sm:py-14 lg:py-16">
      <div className="mx-auto max-w-5xl px-5 lg:px-8">
        <div className="mb-8 text-center">
          <span className="inline-flex rounded-full border border-[var(--color-border)] bg-white px-4 py-2 text-xs font-semibold tracking-[0.14em] text-[var(--color-text-secondary)] uppercase shadow-sm">
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

        <div className="rounded-[1.75rem] border border-[var(--color-border)] bg-white p-5 shadow-xl shadow-zinc-900/5 sm:p-7 lg:p-9">
          <BookingProgress
            currentStep={step}
          />

          <div className="my-7 h-px bg-zinc-200 sm:my-9" />

          {step === "service" && (
            <BookingServiceStep
              services={services}
              selectedService={
                selectedService
              }
              loading={
                loadingServices
              }
              onSelect={
                handleSelectService
              }
            />
          )}

          {step === "date" && (
            <BookingDateStep
              dates={dates}
              selectedDate={
                selectedDate
              }
              loading={loadingDates}
              onSelect={
                handleSelectDate
              }
              onBack={() =>
                setStep("service")
              }
            />
          )}

          {step === "time" && (
            <BookingTimeStep
              slots={timeSlots}
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
                setStep("date")
              }
            />
          )}

          {step === "details" && (
            <BookingDetailsStep
              data={clientData}
              onChange={
                setClientData
              }
              onContinue={() =>
                setStep("review")
              }
              onBack={() =>
                setStep("time")
              }
            />
          )}

          {step === "review" &&
            selectedService &&
            selectedDate &&
            selectedTime && (
              <BookingReviewStep
                service={
                  selectedService
                }
                date={selectedDate}
                time={selectedTime}
                client={clientData}
                submitting={
                  submitting
                }
                onBack={() =>
                  setStep("details")
                }
                onConfirm={
                  handleConfirmBooking
                }
              />
            )}
        </div>

        <p className="mt-6 text-center text-xs leading-5 text-zinc-500">
          Actualmente estamos utilizando
          información simulada para
          desarrollar la interfaz.
        </p>
      </div>
    </section>
  );
};

export default Booking;