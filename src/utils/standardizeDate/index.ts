export default function standardizeDate(date: string) {
  let DateTime = new Date(date);
  let intlDateObj = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
  });
  return intlDateObj.format(DateTime);
}
