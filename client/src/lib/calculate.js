import { addDays, addYears, addMonths, differenceInCalendarDays, format, formatRelative } from 'date-fns';


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
  return format(date, 'LLL');
}


export function generateDateArray(start, end, step) {
  const dates = [];
  let date = start;
  const endDate = addMonths(date, end);
  while (date < endDate) {
    date = addDays(date, step);
    dates.push(date);
  }
  return dates;
}

export function formatLabel(date, money, value, label) {
  return `$${numberFormatter(money)} | ${format(date, 'LLL mo')}\n` +
    `$${numberFormatter(value)} (${label})`;
}



export function generateTransactionArray(calcList,  startingValue, end) {
  const today = new Date();
  const transactions = [
    [today, startingValue, 'Starting cash'],
  ];

  // Create "transactions" for each calculation
  for (const calc of calcList) {
    const {interval, value, label} = calc;
    if (interval < 1) {
      // No < 1 intervals allowed (less than a day)
      continue;
    }
    const dates = generateDateArray(today, end, interval);
    for (const date of dates) {
      // For each date that a transaction should occur on, push the date, value
      // of the transaction, and its label
      transactions.push([date, value, label]);
    }
  }

  // Reverse sort by value, sort by date
  transactions.sort((a, b) => b[1] - a[1]);
  transactions.sort((a, b) => a[0] - b[0]);
  return transactions;
}

export function generateDataArray(calcList,  startingValue, end) {
  const transactions = generateTransactionArray(calcList, startingValue, end);
  //console.log('transactions', transactions);
  const results = [];
  let money = 0;
  for (const [date, value, label] of transactions) {
    money += value;
    results.push({
      x: date,
      y: money,
      label: formatLabel(date, money, value, label),
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

