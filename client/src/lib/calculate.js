import {
  addDays,
  addWeeks,
  addMonths,
  format,
} from 'date-fns';


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

export function dateFormatter(date) {
  // Format a date with a month abbreviation
  return format(date, 'LLL');
}



/*
  Given a start date, a date to end by, and an interval and units (e.g. every 3
  weeks), generate an array with a date for each day that a particular
  recurring transaction will occur on.
*/
export function generateDateArray(start, end, interval, intervalUnit) {
  const dates = [];
  let date = start;
  const addFunction = {
    'days': addDays,
    'weeks': addWeeks,
    'months': addMonths,
  }[intervalUnit];

  if (!addFunction) {
    throw new Error("Invalid interval unit");
  }

  const endDate = addMonths(date, end);
  while (date < endDate) {
    date = addFunction(date, interval);
    dates.push(date);
  }
  return dates;
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


/*
  Given an array of recurring transaction descriptions (calcList), and a date
  to end by, this will generate an array of the individual transactions, each
  transaction an array in the format of `[date, value, description]`
*/
export function generateTransactionArray(calcList, end) {
  const today = new Date();
  const transactions = [];

  // Create "transactions" for each calculation
  for (const calc of calcList) {
    const {interval, value, type, label, intervalUnit} = calc;

    // If it's an expense, make the effective value negative (subtracts)
    const effectiveValue = type === 'expense' ? (0 - value) : value;

    if (intervalUnit === 'once') {
      transactions.push([new Date(), effectiveValue, label]);
      continue;
    }

    if (interval < 1) {
      // No < 1 intervals allowed (less than a day)
      continue;
    }

    const dates = generateDateArray(today, end, interval, intervalUnit);
    for (const date of dates) {
      // For each date that a transaction should occur on, push the date,
      // effective value of the transaction, and its label
      transactions.push([date, effectiveValue, label]);
    }
  }

  // Reverse sort by value, sort by date
  transactions.sort((a, b) => b[1] - a[1]);
  transactions.sort((a, b) => a[0] - b[0]);
  return transactions;
}


/*
  Given an array of recurring transaction descriptions (calcList), this will
  generate an array of transactions, then step through and "apply" those
  transactions to generate the resulting cash in the bank account at every step
  in the format that VictoryCharts expects it.
*/
export function generateDataArray(calcList, end) {
  const transactions = generateTransactionArray(calcList, end);
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

