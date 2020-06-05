import { addDays, addWeeks, addMonths } from 'date-fns';
import { formatLabel } from './formatters';

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

    // If it only happens once, then just add this calculation for today
    if (intervalUnit === 'once') {
      transactions.push([new Date(), effectiveValue, label]);
      continue;
    }

    // Check for invalid intervals (e.g. every 0 days) to prevent bugs
    if (interval < 1) {
      continue;
    }

    // Generate an array of dates on which this transaction will occur
    const dates = generateDateArray(today, end, interval, intervalUnit);
    for (const date of dates) {
      // For each date that a transaction should occur on, push the date,
      // effective value of the transaction, and its label
      transactions.push([date, effectiveValue, label]);
    }
  }

  // Reverse sort by value, sort by date, and return
  transactions.sort((a, b) => b[1] - a[1]);
  transactions.sort((a, b) => a[0] - b[0]);
  return transactions;
}


/*
  Given a start date, the total months to show, and an interval and units (e.g.
  every 3 weeks), generate an array with a date for each day that a particular
  recurring transaction will occur on.
*/
export function generateDateArray(start, monthsTotal, interval, intervalUnit) {

  // This picks an addFunction based on the intervalUnit specified, or throws
  // an error if there was an invalid one
  let addFunction = null;
  if (intervalUnit === 'days') {
    addFunction = addDays;
  } else if (intervalUnit === 'weeks') {
    addFunction = addWeeks;
  } else if (intervalUnit === 'months') {
    addFunction = addMonths;
  } else {
    throw new Error("Invalid interval unit");
  }

  // This while loop will keep on generating date objects until it generates
  // one that's passed the end date, adding each individual date to the dates.
  const dates = [];
  const endDate = addMonths(start, monthsTotal); // find the end date
  let date = start; // start with the first date
  while (date < endDate) { // loop until we pass the last date
    date = addFunction(date, interval); // add the interval each time
    dates.push(date); // and include into the dates array
  }
  return dates;
}


/*
  Given an array of transactions in the format that the above function
  generates, this steps through each one and "applies" them to generate the
  resulting cash in the bank account at every step of the process.  The result
  will be in the format that VictoryCharts expects it.
*/
export function generateDataArray(transactions) {
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
