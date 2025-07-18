import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Customer } from "@/features/customer/types/customerTypes";

/**
 * Combines class names using `clsx` and merges Tailwind CSS classes intelligently using `tailwind-merge`.
 * @param {...ClassValue[]} inputs - List of class names or expressions to merge.
 * @returns {string} - Merged class name string.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

export interface SortOption {
  /** Field name to sort by */
  field: string
  /** Direction of sorting: ascending or descending */
  direction: "asc" | "desc"
}

/**
 * Formats a date string (YYYY-MM-DD) or a Date object into a readable format like "01 ene 2024".
 * If no date is provided, the current date is used.
 *
 * @param {string | Date} [inputDate] - Optional date string in 'YYYY-MM-DD' format or a Date object.
 * @returns {string} - Formatted date string in the format "dd mon yyyy".
 * @throws {Error} - Throws if the string format is invalid.
 */
export const formaterDate = (inputDate?: string | Date): string => {
  const months = [
    "ene", "feb", "mar", "abr", "may", "jun",
    "jul", "ago", "sep", "oct", "nov", "dic"
  ];

  let dateObj: Date;

  if (!inputDate) {
    dateObj = new Date(); // use current date if none provided
  } else if (typeof inputDate === "string") {
    const [year, month, day] = inputDate.split("-");
    if (!year || !month || !day) {
      throw new Error("Invalid date format. Use 'YYYY-MM-DD'.");
    }
    dateObj = new Date(Number(year), Number(month) - 1, Number(day));
  } else {
    dateObj = inputDate;
  }

  const day = dateObj.getDate().toString().padStart(2, "0");
  const month = months[dateObj.getMonth()];
  const year = dateObj.getFullYear();

  return `${day} ${month} ${year}`;
};

/**
 * Retrieves the value from a nested object using a dot-separated path string.
 *
 * @param {object} obj - The object to query.
 * @param {string} path - Dot-separated string representing the path (e.g. "user.name.first").
 * @returns {*} - The value at the specified path, or undefined if not found.
 */
export const getValueByPath = (obj: any, path: string): any => {
  return path.split('.').reduce((acc, part) => acc?.[part], obj);
}

/**
 * Sorts an array of customers by their most recent purchase date (descending).
 *
 * @param {Customer[]} customers - Array of customer objects.
 * @returns {Customer[]} - New sorted array from most recent to oldest purchase.
 */
export function sortCustomersByLastPurchase(customers: Customer[]): Customer[] {
  return [...customers].sort((a, b) => {
    const dateA = a.last_purchase?.purchase_date
      ? new Date(a.last_purchase.purchase_date)
      : null;
    const dateB = b.last_purchase?.purchase_date
      ? new Date(b.last_purchase.purchase_date)
      : null;

    if (!dateA && !dateB) return 0;
    if (!dateA) return 1;
    if (!dateB) return -1;

    return dateB.getTime() - dateA.getTime();
  });
}

/**
 * Returns a color variant based on the number of remaining days.
 * Used for visual indicators such as badges or progress.
 *
 * @param {number} days - The number of days remaining.
 * @returns {"destructive" | "primary"} - "destructive" if days < 10, otherwise "primary".
 */
export const getDaysRemainingColor = (days: number): "destructive" | "primary" => {
  return days < 10 ? "destructive" : "primary";
};
