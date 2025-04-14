import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(date) {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  // const thisWeek = new Date(today);
  // thisWeek.setDate(today.getDate() - today.getDay());
  // const thisMonth = new Date(today);
  // thisMonth.setDate(1);
  // const thisYear = new Date(today);
  // thisYear.setFullYear(today.getFullYear(), 0, 1);

  if (date >= today) {
    return "Today";
  } else if (date >= yesterday) {
    return "Yesterday";
  } else {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
}
