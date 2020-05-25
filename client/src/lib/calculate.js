import { addDays, addYears, addMonths, differenceInCalendarDays } from 'date-fns';


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

export function dateFormatter(date) {
  return new Date(date).toLocaleString('en-us', { month: 'short' });
}


export function generateDateArray(start, end = null, step = null) {
  const dates = [];
  let date = start;
  const stepDays = step || end || 7;
  const endDate = addMonths(date, end || 12);
  while (date < endDate) {
    date = addDays(date, stepDays);
    dates.push(date);
  }
  return dates;
}

export function formatLabel(date, value, label) {
  return `${value} for ${label}`;
}

export function generateDataArray(calcList,  startingMoney, end) {
  const today = new Date();
  const transactions = [
    [today, startingMoney],
  ];

  // Create "transactions" for each calculation
  for (const calc of calcList) {
    const {interval, value, label} = calc;
    if (interval < 1) {
      // No < 1 intervals allowed (less than a day)
      continue;
    }
    const dates = generateDateArray(today, end, interval);
    const calcResults = dates.map(date => [date, value, label]);
    transactions.push(...calcResults)
  }

  // Sort by date (the 0th item)
  transactions.sort((a, b) => a[0] - b[0]);
  console.log('transactions', transactions);
  const results = [];
  let money = 0;
  for (const [date, value, label] of transactions) {
    money += value;
    results.push({
      x: date,
      y: money,
      label: formatLabel(date, value, label),
    });
  }

  return results;
}


/*
// Condense code:
//const results = [];
let money = 0;
const byDate = {}; // collapse into a single object to remove duped days
for (const [date, value] of transactions) {
  money += value;
  byDate[date] = money;
}
const condensedTransactions = Array.from(Object.entries(byDate));
condensedTransactions.sort((a, b) => a[0] - b[0]);
const results = condensedTransactions.map(([x, y]) => ({x, y}));
*/

