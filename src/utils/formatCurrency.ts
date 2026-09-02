const currencyFormatter = new Intl.NumberFormat(
  "es-AR",
  {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  },
);

export const formatCurrency = (
  value: number,
): string => {
  return currencyFormatter.format(value);
};