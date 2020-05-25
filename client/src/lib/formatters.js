/*
export function nFormatter(num, digits) {
  // thanks to: https://stackoverflow.com/a/9462382
  const si = [
    { value: 1, symbol: '' },
    { value: 1E3, symbol: 'k' },
    { value: 1E6, symbol: 'M' },
    { value: 1E9, symbol: 'B' },
    { value: 1E12, symbol: 'T' },
    { value: 1E15, symbol: 'Q' },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  let i;
  for (i = si.length - 1; i > 0; i--) {
    if (num >= si[i].value) {
      break;
    }
  }
  return (num / si[i].value).toFixed(digits).replace(rx, '$1') + si[i].symbol;
}
*/

export function nFormatter(num) {
     if (num >= 1000000000) {
        return (num / 1000000000)
          .toFixed(1)
          .replace(/\.0$/, '') + 'B';
     }
     if (num >= 1000000) {
        return (num / 1000000)
          .toFixed(1)
          .replace(/\.0$/, '') + 'M';
     }
     if (num >= 1000) {
        return (num / 1000)
          .toFixed(1)
          .replace(/\.0$/, '') + 'k';
     }
     return num;
}

