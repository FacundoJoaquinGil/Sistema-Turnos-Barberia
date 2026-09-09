import {
  Construction,
} from "lucide-react";

interface AdminPlaceholderProps {
  title: string;
  description: string;
}

const AdminPlaceholder = ({
  title,
  description,
}: AdminPlaceholderProps) => {
  return (
    <section className="mx-auto max-w-7xl">
      <div className="flex min-h-[60vh] items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center">
        <div className="max-w-md">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-700">
            <Construction size={25} />
          </div>

          <h2 className="mt-5 text-xl font-semibold text-[var(--color-text)]">
            {title}
          </h2>

          <p className="mt-3 leading-6 text-zinc-500">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
};

export default AdminPlaceholder;