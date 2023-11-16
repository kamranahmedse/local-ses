import type { EmailType } from "../pages";

export function calculateSendingRate(emails: EmailType[]) {
  const dateArray = emails.map((email) => email.date);

  // Convert date strings to Date objects
  const dateObjects = dateArray.map((dateString) => new Date(dateString));

  // Count occurrences of each second
  const secondCounts: Record<string, number> = {};

  dateObjects.forEach((date) => {
    const dateYear = date.getFullYear();
    const dateMonth = date.getMonth() + 1;
    const dateDay = date.getDay();
    const dateHour = date.getHours();
    const dateMinute = date.getMinutes();
    const dateSecond = date.getSeconds();

    const secondsKey = `${dateYear}-${dateMonth}-${dateDay} ${dateHour}:${dateMinute}:${dateSecond}`;

    secondCounts[secondsKey] = (secondCounts[secondsKey] || 0) + 1;
  });

  // Find the maximum occurrences
  const maxOccurrences = Math.max(...Object.values(secondCounts));

  // Find seconds with the maximum occurrences
  const maxOccurrenceSeconds = Object.keys(secondCounts).filter(
    (seconds) => secondCounts[seconds] === maxOccurrences,
  );

  return { maxRateDateTime: maxOccurrenceSeconds, maxRate: maxOccurrences };
}
