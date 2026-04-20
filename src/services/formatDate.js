export const formatDate = (dateString) => {
  if (!dateString) return "Invalid Date";

  const date = new Date(dateString);

  if (isNaN(date)) return "Invalid Date";

  const options = { year: "numeric", month: "long", day: "numeric" };
  const formattedDate = date.toLocaleDateString("en-US", options);

  let hour = date.getHours();
  const minutes = date.getMinutes();

  const period = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 || 12;

  const formattedTime = `${formattedHour}:${minutes
    .toString()
    .padStart(2, "0")} ${period}`;

  return `${formattedDate} | ${formattedTime}`;
};