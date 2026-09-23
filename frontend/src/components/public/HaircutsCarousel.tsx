import { useEffect, useState } from "react";

import corte1 from "../../assets/images/corte-1.jpeg";
import corte2 from "../../assets/images/corte-2.jpeg";
import corte3 from "../../assets/images/corte-3.jpeg";
import corte4 from "../../assets/images/corte-4.jpeg";
import corte6 from "../../assets/images/corte-6.jpeg";

type HaircutsCarouselProps = {
  variant?: "section" | "hero";
};

const haircuts = [
  {
    id: 1,
    image: corte1,
    imageAlt: "Corte de cabello realizado en Distrito Barber",
  },
  {
    id: 2,
    image: corte2,
    imageAlt: "Corte de cabello realizado en Distrito Barber",
  },
  {
    id: 3,
    image: corte3,
    imageAlt: "Corte de cabello realizado en Distrito Barber",
  },
  {
    id: 4,
    image: corte4,
    imageAlt: "Corte de cabello realizado en Distrito Barber",
  },
  {
    id: 6,
    image: corte6,
    imageAlt: "Corte de cabello realizado en Distrito Barber",
  },
];

const HaircutsCarousel = ({
  variant = "section",
}: HaircutsCarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const totalSlides = haircuts.length;

  const showPrevious = () => {
    setActiveIndex((current) =>
      current === 0 ? totalSlides - 1 : current - 1,
    );
  };

  const showNext = () => {
    setActiveIndex((current) =>
      current === totalSlides - 1 ? 0 : current + 1,
    );
  };

  const showSlide = (index: number) => {
    setActiveIndex(index);
  };

  useEffect(() => {
    if (totalSlides <= 1) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    if (reducedMotion.matches) return;

    const intervalId = window.setInterval(() => {
      setActiveIndex((current) =>
        current === totalSlides - 1 ? 0 : current + 1,
      );
    }, 5000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [totalSlides]);

  /*
   * ======================================================
   * HERO
   * ======================================================
   */

  if (variant === "hero") {
    return (
      <div
        className="relative w-full overflow-hidden"
        role="region"
        aria-roledescription="carrusel"
        aria-label="Trabajos realizados"
      >
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(-${activeIndex * 100}%)`,
          }}
        >
          {haircuts.map((haircut, index) => (
            <div
              key={haircut.id}
              className="min-w-full"
              aria-hidden={activeIndex !== index}
            >
              <img
                src={haircut.image}
                alt={haircut.imageAlt}
                className="aspect-[4/4.7] w-full object-cover sm:aspect-[4/4.3] lg:aspect-[4/5]"
              />
            </div>
          ))}
        </div>

        {/* Flecha izquierda */}
        <button
          type="button"
          onClick={showPrevious}
          className="absolute top-1/2 left-4 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-md transition-all hover:bg-black/50"
          aria-label="Mostrar imagen anterior"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <path
              d="m15 6-6 6 6 6"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Flecha derecha */}
        <button
          type="button"
          onClick={showNext}
          className="absolute top-1/2 right-4 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-md transition-all hover:bg-black/50"
          aria-label="Mostrar siguiente imagen"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <path
              d="m9 6 6 6-6 6"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Indicadores */}
        <div
          className="absolute right-0 bottom-5 left-0 z-20 flex items-center justify-center gap-2"
          aria-label="Seleccionar imagen"
        >
          {haircuts.map((haircut, index) => (
            <button
              key={haircut.id}
              type="button"
              onClick={() => showSlide(index)}
              className={[
                "h-2 rounded-full transition-all duration-300",
                activeIndex === index
                  ? "w-7 bg-white"
                  : "w-2 bg-white/40 hover:bg-white/70",
              ].join(" ")}
              aria-label={`Mostrar imagen ${index + 1}`}
              aria-current={
                activeIndex === index ? "true" : undefined
              }
            />
          ))}
        </div>
      </div>
    );
  }

  /*
   * ======================================================
   * SECCIÓN TRABAJOS
   * ======================================================
   */

  return (
    <section
      id="trabajos"
      className="scroll-mt-24 overflow-hidden bg-[var(--color-primary)] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div
          className="overflow-hidden rounded-[1.75rem] shadow-2xl shadow-black/20"
          data-aos="fade-up"
          role="region"
          aria-roledescription="carrusel"
          aria-label="Trabajos realizados"
        >
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(-${activeIndex * 100}%)`,
            }}
          >
            {haircuts.map((haircut, index) => (
              <div
                key={haircut.id}
                className="min-w-full"
                aria-hidden={activeIndex !== index}
              >
                <img
                  src={haircut.image}
                  alt={haircut.imageAlt}
                  className="aspect-[4/5] w-full object-cover sm:aspect-[16/10] lg:max-h-[650px]"
                />
              </div>
            ))}
          </div>

          {/* Flecha izquierda */}
          <button
            type="button"
            onClick={showPrevious}
            className="absolute top-1/2 left-4 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-md transition-all hover:bg-black/50"
            aria-label="Mostrar imagen anterior"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path
                d="m15 6-6 6 6 6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Flecha derecha */}
          <button
            type="button"
            onClick={showNext}
            className="absolute top-1/2 right-4 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-md transition-all hover:bg-black/50"
            aria-label="Mostrar siguiente imagen"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path
                d="m9 6 6 6-6 6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Indicadores */}
        <div
          className="mt-7 flex items-center justify-center gap-2"
          aria-label="Seleccionar imagen"
        >
          {haircuts.map((haircut, index) => (
            <button
              key={haircut.id}
              type="button"
              onClick={() => showSlide(index)}
              className={[
                "h-2.5 rounded-full transition-all duration-300",
                activeIndex === index
                  ? "w-8 bg-white"
                  : "w-2.5 bg-white/30 hover:bg-white/50",
              ].join(" ")}
              aria-label={`Mostrar imagen ${index + 1}`}
              aria-current={
                activeIndex === index ? "true" : undefined
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HaircutsCarousel;