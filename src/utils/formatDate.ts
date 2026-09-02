const longDateFormatter = new Intl.DateTimeFormat(
  "es-AR",
  {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  },
);

export const formatDateLong = (
  isoDate: string,
): string => {
  const date = new Date(`${isoDate}T00:00:00`);

  return longDateFormatter.format(date);
};