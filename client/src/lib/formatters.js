import { format } from 'date-fns';

/*
  Format a date with a month abbreviation
*/
export function dateFormatter(date) {
  return format(date, 'LLL');
}


/*
  Given a Number, format and round the number using K, M, or B as abbreviations
  for thousand, million, or billion (e.g. 10056 becomes "10k")
*/
export function numberFormatter(num) {
  // thanks to: https://stackoverflow.com/a/9462382
  const absNum = Math.abs(num);
  if (absNum >= 1000000000) {
    // Greater than a billion, format with B
    return (num / 1000000000)
      .toFixed(1)
      .replace(/\.0$/, '') + 'B';
  }
  if (absNum >= 1000000) {
    // Greater than a million, format with M
    return (num / 1000000)
      .toFixed(1)
      .replace(/\.0$/, '') + 'M';
  }
  if (absNum >= 1000) {
    // Greater than a thousand, format with k
    return (num / 1000)
      .toFixed(1)
      .replace(/\.0$/, '') + 'k';
  }
  return num;
}

/*
// A more extensive label formatter that could be used instead:
export function formatLabel(date, money, value, label) {
  return `$${numberFormatter(money)} | ${format(date, 'LLL mo')}\n` +
    `$${numberFormatter(value)} (${label})`;
}
*/

/* Format a graph label */
export function formatLabel(date, money, value, label) {
  return `$${numberFormatter(money)}`;
}
