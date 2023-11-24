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

export function objectHasGivenKeysWithTruthyValues(obj, arr) {
  for (const index in arr) {
    const key = arr[index];
    if (obj[key] === undefined || obj[key] === "") {
      return { booleanValue: false, field: key };
    }
  }
  return { booleanValue: true, field: "none" };
}
