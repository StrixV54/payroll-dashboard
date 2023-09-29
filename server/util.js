const options = {
  timeZone: "Asia/Kolkata", // IST time zone
  hour12: true, // 24-hour format
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
};

export const dateTime = () => new Date().toLocaleString("en-IN", options);
