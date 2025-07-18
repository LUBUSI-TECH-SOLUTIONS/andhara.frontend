/**
 * Formats a number as Colombian currency (COP).
 *
 * @param {number | null} value - The numeric value to format. If null, it defaults to 0.
 * @returns {string} The formatted currency string in "es-CO" locale.
 *
 * @example
 * formatCurrency(1500); // "$ 1.500,00"
 * formatCurrency(null); // "$ 0,00"
 */
export const formatCurrency = (value: number | null) => {
   return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
   }).format(value ?? 0);
};

/**
 * Formats a number as a percentage string with two decimal places.
 *
 * @param {number} value - The numeric value to format.
 * @returns {string} The formatted percentage string (e.g., "45.67%").
 *
 * @example
 * formatPercent(0.4567); // "0.46%"
 * formatPercent(45.678); // "45.68%"
 */
export const formatPercent = (value: number) => {
   return `${value.toFixed(2)}%`;
};
