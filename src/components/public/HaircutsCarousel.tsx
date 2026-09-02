import {
  useEffect,
  useState,
} from "react";
import { Link } from "react-router";
import { haircutsMock } from "../../mocks/haircuts.mock";

const HaircutsCarousel = () => {
  const [activeIndex, setActiveIndex] =
    useState(0);

  const totalSlides = haircutsMock.length;

  const showPrevious = () => {
    setActiveIndex((current) =>
      current === 0
        ? totalSlides - 1
        : current - 1,
    );
  };

  const showNext = () => {
    setActiveIndex((current) =>
      current === totalSlides - 1
        ? 0
        : current + 1,
    );
  };

  const showSlide = (index: number) => {
    setActiveIndex(index);
  };

  useEffect(() => {
    const reducedMotion =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      );

    if (reducedMotion.matches) {
      return;
    }

    const intervalId = window.setInterval(
      () => {
        setActiveIndex((current) =>
          current === totalSlides - 1
            ? 0
            : current + 1,
        );
      },
      5000,
    );

    return () => {
      window.clearInterval(intervalId);
    };
  }, [totalSlides]);

  return (
    <section
      id="trabajos"
      className="scroll-mt-24 overflow-hidden bg-zinc-950 py-20 text-white sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div
          className="max-w-2xl"
          data-aos="fade-up"
        >
          <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold tracking-[0.14em] text-zinc-300 uppercase">
            Nuestros trabajos
          </span>

          <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
            Cortes que hablan por sí solos
          </h2>

          <p className="mt-5 max-w-xl text-base leading-7 text-zinc-400 sm:text-lg">
            Algunos estilos que podés tomar como
            referencia para encontrar el próximo
            look que mejor vaya con vos.
          </p>
        </div>

        <div
          className="mt-12 overflow-hidden rounded-[1.75rem] border border-white/10 bg-zinc-900 shadow-2xl shadow-black/20"
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
            {haircutsMock.map(
              (haircut, index) => (
                <article
                  key={haircut.id}
                  className="grid min-w-full lg:grid-cols-[1.4fr_0.6fr]"
                  aria-hidden={
                    activeIndex !== index
                  }
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={haircut.image}
                      alt={haircut.imageAlt}
                      className="aspect-[4/5] h-full w-full object-cover sm:aspect-[16/10] lg:min-h-[560px] lg:aspect-auto"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent lg:hidden" />

                    <span className="absolute top-5 left-5 rounded-full border border-white/20 bg-black/30 px-3 py-1.5 text-xs font-semibold tracking-wide text-white backdrop-blur-md lg:hidden">
                      {haircut.tag}
                    </span>
                  </div>

                  <div className="flex min-h-[330px] flex-col justify-between p-6 sm:p-8 lg:min-h-[560px] lg:p-10">
                    <div>
                      <div className="hidden lg:block">
                        <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold tracking-[0.12em] text-zinc-300 uppercase">
                          {haircut.tag}
                        </span>
                      </div>

                      <p className="mt-0 text-xs font-semibold tracking-[0.18em] text-zinc-500 uppercase lg:mt-8">
                        Trabajo{" "}
                        {String(index + 1).padStart(
                          2,
                          "0",
                        )}
                      </p>

                      <h3 className="mt-3 text-3xl font-black tracking-tight text-white lg:text-4xl">
                        {haircut.title}
                      </h3>

                      <p className="mt-5 max-w-md text-sm leading-7 text-zinc-400 sm:text-base">
                        {haircut.description}
                      </p>
                    </div>

                    <div>
                      <div className="mb-7 flex items-center gap-3">
                        <button
                          type="button"
                          onClick={showPrevious}
                          className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                          aria-label="Mostrar trabajo anterior"
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

                        <button
                          type="button"
                          onClick={showNext}
                          className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                          aria-label="Mostrar siguiente trabajo"
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

                      <Link
                        to="/reservar"
                        className="group inline-flex items-center gap-2 text-sm font-semibold text-white"
                      >
                        Quiero un corte así

                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          className="h-4 w-4 transition-transform group-hover:translate-x-1"
                          aria-hidden="true"
                        >
                          <path
                            d="M5 12h14M13 6l6 6-6 6"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </article>
              ),
            )}
          </div>
        </div>

        <div
          className="mt-7 flex items-center justify-center gap-2"
          aria-label="Seleccionar trabajo"
        >
          {haircutsMock.map(
            (haircut, index) => (
              <button
                key={haircut.id}
                type="button"
                onClick={() =>
                  showSlide(index)
                }
                className={[
                  "h-2.5 rounded-full transition-all duration-300",
                  activeIndex === index
                    ? "w-8 bg-white"
                    : "w-2.5 bg-zinc-700 hover:bg-zinc-500",
                ].join(" ")}
                aria-label={`Mostrar ${haircut.title}`}
                aria-current={
                  activeIndex === index
                    ? "true"
                    : undefined
                }
              />
            ),
          )}
        </div>
      </div>
    </section>
  );
};

export default HaircutsCarousel;