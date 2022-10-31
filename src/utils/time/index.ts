import moment from "moment"

const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thurday",
  "Friday",
  "Saturday"
];

export function when(timestamp: number) {
  const delta = (new Date().getTime() - timestamp) / 1000
  const date = new Date(timestamp)
  if (delta > 3600 * 24 * 7) {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`
  } else if (delta > 3600 * 24 * 2) {
    return `${Math.floor(delta / (3600 * 24))} days ago`
  } else if (delta > 3600 * 24) {
    return "yesterday"
  } else if (delta > 3600) {
    return `${Math.floor(delta / 3600)} hour${Math.floor(delta / 3600) == 1 ? '' : 's'} ago`
  } else if (delta > 60) {
    return `${Math.floor(delta / 60)} minute${Math.floor(delta / 60) == 1 ? '' : 's'} ago`
  } else if (delta > 0) {
    return `${Math.floor(delta)} second${delta == 1 ? '' : 's'} ago`
  }
}

export function day(timestamp: string | Date | number) {
  const dateString = new Date(timestamp).toDateString();
  if (dateString == new Date().toDateString()) return "Today";
  else if (new Date(dateString).getTime() - new Date(new Date().toDateString()).getTime() == 86400000) return "Yesterday";
  return weekdays[new Date(dateString).getDay()];
}

export function date(timestamp: string | Date | number | null) {
  if (!timestamp) return "no timestamp set";
  const date = new Date(timestamp)
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
}

export function datetime(timestamp: string | Date | number | null) {
  if (!timestamp) return "no timestamp set";
  return moment(new Date(timestamp)).format("DD/MM/YYYY HH:mm")
}

export function time(timestamp: string | Date | number | null) {
  if (!timestamp) return "no timestamp set";
  return moment(new Date(timestamp)).format("HH:mm")
}

export function duration(timestamp: string | Date | number) {
  const date = new Date(timestamp)
  return [
    date.getFullYear() - 1970,
    date.getMonth(),
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds()
  ]
}

export async function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve: Function) => setTimeout(resolve, milliseconds))
}
