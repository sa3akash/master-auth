import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function timeAgo(date: Date | string): string {
  const mainDate = typeof date === "string" ? new Date(date) : date;

  const now = new Date();
  const seconds = Math.floor((now.getTime() - mainDate.getTime()) / 1000);

  // Calculate the different intervals
  const years = Math.floor(seconds / 31536000); // years
  const months = Math.floor(seconds / 2592000); // months
  const days = Math.floor(seconds / 86400); // days
  const hours = Math.floor(seconds / 3600); // hours
  const minutes = Math.floor(seconds / 60); // minutes

  if (years >= 1) return `${years} year${years > 1 ? "s" : ""} ago`;
  if (months >= 12)
    return `${Math.floor(months / 12)} year${
      Math.floor(months / 12) > 1 ? "s" : ""
    } ago`;

  if (months >= 1) return `${months} month${months > 1 ? "s" : ""} ago`;
  if (days >= 1) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (hours >= 1) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (minutes >= 1) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;

  return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
}
