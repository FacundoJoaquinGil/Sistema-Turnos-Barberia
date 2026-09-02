import { Link } from "react-router";

interface ComingSoonProps {
  title: string;
  description: string;
}

const ComingSoon = ({
  title,
  description,
}: ComingSoonProps) => {
  return (
    <section className="flex min-h-[calc(100svh-72px)] items-center justify-center px-5 py-16">
      <div className="mx-auto max-w-xl text-center">
        <span className="inline-flex rounded-full bg-zinc-100 px-4 py-2 text-xs font-semibold tracking-wide text-zinc-600 uppercase">
          Próxima etapa
        </span>

        <h1 className="mt-6 text-4xl font-black tracking-tight text-zinc-950 sm:text-5xl">
          {title}
        </h1>

        <p className="mt-5 text-base leading-7 text-zinc-600 sm:text-lg">
          {description}
        </p>

        <Link
          to="/"
          className="mt-8 inline-flex min-h-12 items-center justify-center rounded-xl bg-zinc-950 px-6 py-3 font-semibold text-white transition-colors hover:bg-zinc-800"
        >
          Volver al inicio
        </Link>
      </div>
    </section>
  );
};

export default ComingSoon;